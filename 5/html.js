export { bind, html };

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

	setEvents(element);

	return element;


	// FUNÇÕES

	function parseTemplateString() {
		const htmlParts = templateString.join('$').split('$');

		return htmlParts.reduce((acc, cur, i) => {
			if (i === 0)
				return cur;

			let expression = expressions[i - 1];

			return acc + (typeof expression == 'function' ? i - 1 : expression) + cur;
		}, '');
	}

	function createElement(html) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		return doc.body.firstChild;
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
					//child.addEventListener(eventName, () => console.log(123));

					//console.log(child, eventName, attr.value);

					// if (eventName == 'keypress') {
					// 	child.addEventListener(eventName, event => document.elementFromPoint(event.clientX, event.clientY).focus());
					// }
				}
			});
		}
	}
}
