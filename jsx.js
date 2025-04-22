function jsx(templateStrings, ...expressions) {
	const placeholder = i => `{{__expr__${i}__}}`;
	const html = templateStrings.reduce((acc, str, i) =>
		acc + str + (i < expressions.length ? placeholder(i) : ''), '');
	const template = document.createElement('template');

	template.innerHTML = html.trim();

	function parseNode(node) {
		if (node.nodeType === Node.TEXT_NODE) {
			return parseTextNode(node.nodeValue);
		}

		if (node.nodeType === Node.ELEMENT_NODE) {
			return parseElementNode(node);
		}

		return null;
	}

	function parseTextNode(text) {
		const parts = text.split(/({{__expr__\d+__}})/g).map(part => {
			const match = part.match(/{{__expr__(\d+)__}}/);

			if (match)
				return expressions[parseInt(match[1])];

			return part;
		});

		return parts.length === 1 ? parts[0] : parts.map(p => p instanceof Node ? p : document.createTextNode(p));
	}

	function parseElementNode(node) {
		const tag = node.tagName.toLowerCase();
		const props = {};

		for (const attr of node.attributes) {
			const match = attr.value.match(/{{__expr__(\d+)__}}/);

			props[attr.name] = match
				? expressions[parseInt(match[1])]
				: attr.value;
		}

		const children = Array.from(node.childNodes)
			.map(parseNode)
			.flat()
			.filter(Boolean); // Remove nulos

		return createElement(tag, props, ...children);
	}

	const children = Array.from(template.content.childNodes)
		.map(parseNode)
		.flat()
		.filter(Boolean);

	return children.length === 1 ? children[0] : createElement(Fragment, null, ...children);
}

function Fragment(_, ...children) {
	const frag = document.createDocumentFragment();

	children.forEach(child => frag.append(child));

	return frag;
}

function createElement(tag, props, ...children) {
	const element = typeof tag === 'function'
		? tag(props)
		: document.createElement(tag);

	for (const [name, value] of Object.entries(props || {})) {
		if (name.startsWith('on') && typeof value === 'function') {
			element.addEventListener(name.slice(2).toLowerCase(), value);
		} else {
			element.setAttribute(name, value);
		}
	}

	children.flat().forEach(child =>
		element.append(child instanceof Node ? child : document.createTextNode(child))
	);

	return element;
}

function render(container, component) {
	container.innerHTML = ''; // Limpa o container
	container.appendChild(component); // Adiciona o componente ao container
}

export { jsx, render };
