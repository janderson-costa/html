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

	function reload() {
		// Recria um novo componente e substitui o anterior.

		const newComponent = createComponent();

		_component.replaceWith(newComponent);
		_component = newComponent;
	}

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
		const html = htmlParts.reduce((acc, cur, i) => {
			acc = compressTemplateString(acc);
			cur = compressTemplateString(cur);

			if (i == 0)
				return cur;

			const index = i - 1;
			const part = compressTemplateString(htmlParts[i - 1]);
			const onEventRegex = /@on[a-zA-Z0-9]*="$/; // Termina com @on<eventName>="

			let expression = _expressions[index];
			let isFunction = typeof expression == 'function';

			if (isElement(expression)) {
				expression = `<element>${index}</element>`;
			} else if (isFunction && (part.endsWith('>') || !onEventRegex.test(part))) {
				isFunction = false;
				expression = expression();

				if (isElement(expression)) {
					expression = `<function>${index}</function>`;
				}
			}

			let html = acc + (isFunction ? index : expression) + cur;

			html = html
				.replaceAll('selected="true"', 'selected')
				.replaceAll('selected="false"', '')
				.replaceAll('checked="true"', 'checked')
				.replaceAll('checked="false"', '');

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

	function setComponent(element) {
		// Configura o componente e todos os seus elementos.

		const elements = element.querySelectorAll('element, function');

		elements.forEach(element => {
			const expression = element.tagName == 'FUNCTION' ? _expressions[element.textContent]() : _expressions[element.textContent];
			const children = expression instanceof Array ? expression : [expression];

			children.forEach((child, index) => {
				element.before(child);

				if (index == children.length - 1)
					element.remove();
			});
		});

		set(element);

		Array.from(element.children).forEach(child => {
			set(child);

			if (child.children.length)
				setComponent(child);
		});

		function set(element) {
			Array.from(element.attributes).forEach(attr => {
				const attrName = attr.name.toLowerCase();

				// @onEvent
				if (attrName.startsWith('@on')) {
					const func = _expressions[attr.value];
					const _attrName = attrName.substring(3);

					element.addEventListener(_attrName, event =>
						func({ event, element: event.target, reload })
					);

					element.removeAttribute(attrName);
				}
			});
		}
	}
}
