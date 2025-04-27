function convertTemplate(fnString) {
	// Extrai o conteúdo entre os backticks (` `)
	const templateMatch = fnString.toString().match(/`([\s\S]*)`/);

	if (!templateMatch) return '';

	let raw = templateMatch[1];

	// Substitui todos os ${...} por {{__expr__N__}}
	let exprIndex = 0;
	raw = raw.replace(/\$\{[^}]+\}/g, () => `{{__expr__${exprIndex++}__}}`);

	return raw;
}

function extractExpressions(fn) {
	const fnString = fn.toString();

	// Pega tudo entre os acentos graves (backticks)
	const templateMatch = fnString.match(/`([\s\S]*)`/);
	if (!templateMatch) return [];

	const templateContent = templateMatch[1];

	// Procura todas as expressões ${...}
	const expressions = [];
	const regex = /\$\{([^}]*)\}/g;
	let match;
	while ((match = regex.exec(templateContent)) !== null) {
		expressions.push(match[1].trim());
	}

	console.log(expressions);

	return expressions;
}


function html(templateFunction, props, a) {
	console.log(a)
	const template = document.createElement('template');
	const _html = convertTemplate(templateFunction);
	const expressions = extractExpressions(templateFunction)

	/*
		html:
			<div>
				<h1>{{__expr__0__}}</h1>
				<button onclick="{{__expr__1__}}">OK!!</button>
			</div>
	*/

	console.log(_html);

	template.innerHTML = _html;

	const children = Array.from(template.content.childNodes)
		.map(parseNode)
		.flat()
		.filter(Boolean);

	let element = children.length === 1 ? children[0] : createElement(Fragment, null, ...children);

	return element;


	// FUNÇÕES

	function Fragment(_, ...children) {
		const fragment = document.createDocumentFragment();

		children.forEach(child => fragment.append(child));

		return fragment;
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
				return eval(expressions[parseInt(match[1])]);

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
				? eval(expressions[parseInt(match[1])])
				: attr.value;
		}

		const children = Array.from(node.childNodes)
			.map(parseNode)
			.flat()
			.filter(Boolean); // Remove nulos

		return createElement(tag, props, ...children);
	}
}

function render(container, component) {
	container.innerHTML = ''; // Limpa o container
	container.appendChild(component); // Adiciona o componente ao container
}

export { html, render };
