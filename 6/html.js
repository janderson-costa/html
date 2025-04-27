export { bind, html };

// window.addEventListener('load', () => {
// 	bind(html`<h1>Hello World!</h1>`, {});
// });

function bind(htmlFunction, props) {
	let element = htmlFunction(props);

	element.data = deepProxy(props, (target, prop, value) => {
		// Cria um novo elemento e substitui o anterior
		const newElement = bind(htmlFunction, props);
		
		console.log(props); <<<<<<<< está sendo chamado 2 x

		element.replaceWith(newElement);
		element = newElement;
	});

	return element;

	function deepProxy(obj, callback) {
		// Captura alterações no objeto de forma recursiva.

		return new Proxy(obj, {
			get(target, prop, receiver) {
				const value = Reflect.get(target, prop, receiver);

				if (value && typeof value === 'object')
					return deepProxy(value, callback);

				return value;
			},
			set(target, prop, value, receiver) {
				const result = Reflect.set(target, prop, value, receiver);

				callback(target, prop, value);

				return result;
			}
		});
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

					valueOrPropExpr.forEach(prop => {
						const regex = new RegExp(prop, 'g');
						let value = '';

						if (prop == '{index}') {
							value = index;
						} else {
							if (typeof item == 'object') {
								value = eval(
									prop.replace(/{|}/g, '').replace(/^[^.]+/, 'item') // Ex.: {prop.name} => item.name
								);
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
