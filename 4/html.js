function bind(htmlFunction, props) {
	const element = htmlFunction();

	element.data = deepProxy(props, (target, prop, value) => {
		props[prop] = value;

		// Cria um novo elemento e substitui o anterior
		element.replaceWith(bind(htmlFunction, props));
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
	//console.log(templateString);

	//const html = templateString.reduce((acc, str, i) => acc + str + (i < expressions.length ? `{{__expr__${i}__}}` : ''), '');
	const html = templateString.reduce((acc, str, i) => {
		console.log(acc + str + expressions[i]);
		return acc + str + (i < expressions.length ? `{{__expr__${i}__}}` : '');
	}, '');
	  
	
	const template = document.createElement('template');

	template.innerHTML = html.trim();

	const children = Array.from(template.content.childNodes)
		.map(parseNode)
		.flat()
		.filter(Boolean);

	let element = children.length === 1 ? children[0] : createElement(Fragment, null, ...children);

	return element;


	// FUNÇÕES

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

	function Fragment(_, ...children) {
		const fragment = document.createDocumentFragment();

		children.forEach(child => fragment.append(child));

		return fragment;
	}
}

export { bind, html };
