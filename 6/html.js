export { bind, html };

>>>>> manter o focu no elemento ao recriar o elemento
// window.addEventListener('load', () => {
// 	bind(html`<h1>Hello World!</h1>`, {});
// });

function bind(htmlFunction, props) {
	let element = htmlFunction(props);

	element.data = deepProxy(props, (target, prop, value) => {
		// Cria um novo elemento e substitui o anterior
		const newElement = bind(htmlFunction, props);

		element.replaceWith(newElement);
		element = newElement;

		return;
	});

	return element;

	function deepProxy(obj, callback, proxied = new WeakMap()) {
		if (proxied.has(obj))
			return proxied.get(obj);

		const proxy = new Proxy(obj, {
			get(target, prop, receiver) {
				const value = Reflect.get(target, prop, receiver);

				if (value && typeof value === 'object')
					return deepProxy(value, callback, proxied);

				return value;
			},
			set(target, prop, value, receiver) {
				const oldValue = target[prop];
				const result = Reflect.set(target, prop, value, receiver);

				if (oldValue !== value)
					callback(target, prop, value);

				return result;
			}
		});

		proxied.set(obj, proxy);

		return proxy;
	}
}

function html(templateString, ...expressions) {
	const html = parseTemplateString();
	const element = createElement(html);

	createForElements(element);
	setEvents(element);

	return element;


	// FUNÇÕES

	function parseTemplateString() {
		const htmlParts = templateString;
		const html = htmlParts.reduce((acc, cur, i) => {
			if (i == 0)
				return cur;

			let expression = expressions[i - 1];
			let isFunction = typeof expression == 'function';
			let isFor = htmlParts[i - 1].match(/for=/);
			let html = acc + (isFunction || isFor ? i - 1 : expression) + cur;

			return html;
		}, '');

		return compressTemplateString(html);
	}

	function createElement(html) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const element = doc.body.firstChild;

		return element;
	}

	function createForElements(element) {
		// Cria os elementos conforme a expressão for.

		Array.from(element.children).forEach(child => {
			let _for = child.getAttribute('for');

			if (_for) {
				const forParts = _for.replace(/ +/g, ' ').split(' '); // for="item of expressionIndex"
				const exprIndex = Number(forParts[2]);
				const array = expressions[exprIndex];

				array.forEach((item, index) => {
					const valueOrPropExpr = child.outerHTML.match(/{[^}]+}/g); // Ex.: {index}, {value}, {item.name}, etc.
					let html = child.outerHTML;

					valueOrPropExpr.forEach(expr => {
						const regex = new RegExp(expr, 'g');
						let value = '';

						if (expr == '{index}') {
							value = index;
						} else {
							if (typeof item == 'object') {
								expr = expr.replace(/{|}/g, '').replace(/^[^.]+/, 'item') // Ex.: {prop.name} => item.name
								value = eval(expr);
							} else {
								value = item;
							}
						}

						html = html.replace(regex, value);
					});

					const newChild = createElement(html);

					newChild.removeAttribute('for');
					child.before(newChild);
				});

				// Remove o elemento original
				child.remove();
			}

			if (child.children.length)
				createForElements(child);
		});
	}

	function setEvents(parent) {
		// Percorre todos os elementos do pai de forma recursiva.

		set(parent);

		Array.from(parent.children).forEach(child => {
			set(child);

			if (child.children.length)
				setEvents(child);
		});

		function set(child) {
			Array.from(child.attributes).forEach(attr => {
				// Eventos
				if (attr.name.startsWith('on')) {
					const eventName = attr.name.slice(2).toLowerCase();

					child.removeAttribute(attr.name);
					child.addEventListener(eventName, expressions[Number(attr.value)]);

					//console.log(expressions[Number(attr.value)]);
					//child.addEventListener(eventName, () => console.log(123));

					//console.log(child, eventName, attr.value);

					// if (eventName == 'keypress') {
					// 	child.addEventListener(eventName, event => document.elementFromPoint(event.clientX, event.clientY).focus());
					// }
				}
			});
		}
	}

	function compressTemplateString(text) {
		return text.replace(/\n|\t/g, '').trim();
	}
}
