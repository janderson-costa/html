export { html };

//! >>>>> manter o focus no elemento ao recriar o elemento
let temp;

window.addEventListener('click', event => {
	//console.log(event.target);
	temp = event.target;
});

function html(templateString, ...expressions) {
	let _templateString = templateString;
	let _expressions = expressions;
	let _component = createComponent();

	return _component;

	function createComponent() {
		const html = parseTemplateString();
		const component = createElement(html);

		setComponent(component);

		// Público
		component.reload = reload;

		return component;
	}

	function parseTemplateString() {
		const htmlParts = _templateString;
		const html = htmlParts.reduce((acc, cur, index) => {
			const part = compressTemplateString(htmlParts[index - 1]);
			const onEventRegex = /@on[a-zA-Z0-9]*="$/; // Termina com @on<eventName>="

			acc = compressTemplateString(acc);
			cur = compressTemplateString(cur);

			if (index == 0)
				return cur;

			let expression = _expressions[index - 1];
			let isFunction = typeof expression == 'function';

			if (isElement(expression)) {
				>>>>>>>>>>>
			} else if (isFunction && (part.endsWith('>') || !onEventRegex.test(part))) {
				isFunction = false;
				expression = expression();
			}

			let html = acc + (isFunction ? index - 1 : expression) + cur;

			return html;
		}, '');

		return html;

		function compressTemplateString(text) {
			return typeof text == 'string' ? text.replace(/\n|\t/g, '').trim() : '';
		}

		function isElement(any) {
			return any instanceof HTMLElement || any[0] instanceof HTMLElement;
		}
	}

	function createElement(html) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		return doc.body.firstChild;
	}

	function reload() {
		// Recria um novo componente e substitui o anterior.

		const newComponent = createComponent();

		_component.replaceWith(newComponent);
		_component = newComponent;
	}

	function setComponent(element) {
		// Configura o componente e todos os seus elementos.

		set(element);

		Array.from(element.children).forEach(child => {
			set(child);

			if (child.children.length)
				setComponent(child);
		});

		function set(child) {
			Array.from(child.attributes).forEach(attr => {
				const attrName = attr.name.toLowerCase();

				// @onEvent
				if (attrName.startsWith('@on')) {
					const func = _expressions[attr.value];
					const _attrName = attrName.substring(3); // @onclick => click, @onchange => change, ...

					child.addEventListener(_attrName, event =>
						func({ event, element: event.target, reload })
					);

					child.removeAttribute(attrName);
				}
			});
		}
	}
}

function ___parseTemplateString() {
	const htmlParts = _templateString;
	const html = htmlParts.reduce((acc, cur, index) => {
		const part = compressTemplateString(htmlParts[index - 1]);
		const onEventRegex = /@on[a-zA-Z0-9]*="$/; // Termina com @on<eventName>="

		acc = compressTemplateString(acc);
		cur = compressTemplateString(cur);

		if (index == 0)
			return cur;

		let expression = _expressions[index - 1];
		let isFunction = typeof expression == 'function';

		if (isFunction && (part.endsWith('>') || !onEventRegex.test(part))) {
			isFunction = false;
			expression = expression();

			if (isElement(expression)) {
				console.log(expression);
				isFunction = true;
			}
		}

		const html = acc + (isFunction ? index - 1 : expression) + cur;

		return html;
	}, '');

	return html;

	function isElement(any) {
		return any instanceof HTMLElement || any[0] instanceof HTMLElement;
	}

	function compressTemplateString(text) {
		return typeof text == 'string' ? text.replace(/\n|\t/g, '').trim() : '';
	}
}
