export { bind, html };

//! >>>>> manter o focu no elemento ao recriar o elemento
let temp;

window.addEventListener('click', event => {
	//console.log(event.target);
	temp = event.target;
});

let _templateString;
let _expressions;

function bind(htmlFunction, props) {
	let element = htmlFunction(props);

	element.data = deepProxy(props, (target, prop, value, receiver) => {
		// Cria um novo elemento e substitui o anterior
		const newElement = bind(htmlFunction, props);

		setElement(newElement);
		element.replaceWith(newElement);
		element = newElement;

		return;
	});

	return element;
}

function html(templateString, ...expressions) {
	_templateString = templateString;
	_expressions = expressions;

	const html = parseTemplateString();
	const element = createElement(html);

	createForElements(element);
	setElement(element);
	setEvents(element);

	return element;
}

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

			if (oldValue != value)
				callback(target, prop, value, receiver);

			return result;
		}
	});

	proxied.set(obj, proxy);

	return proxy;
}

function parseTemplateString() {
	const htmlParts = _templateString;
	const html = htmlParts.reduce((acc, cur, i) => {
		if (i == 0)
			return cur;

		let expression = _expressions[i - 1];
		let isFunction = typeof expression == 'function';
		let isFor = htmlParts[i - 1].match(/for=/);
		let isValueSelected = htmlParts[i - 1].match(/value-selected=/);
		let html = acc + (isFunction || isFor || isValueSelected ? i - 1 : expression) + cur;

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

	element.querySelectorAll('[for]').forEach(child => {
		const _for = child.getAttribute('for');
		const forParts = _for.replace(/ +/g, ' ').split(' '); // for="item of expressionIndex"
		const propName = forParts[0];
		const exprIndex = forParts[2];
		const array = _expressions[exprIndex];

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
	});
}

function setElement(element) {
	// value-selected
	element.parentNode.querySelectorAll('[value-selected]').forEach(input => {
		let selectedValue = _expressions[input.getAttribute('value-selected')];

		if (input.type == 'radio') {
			input.checked = input.value == selectedValue;
		} else if (input.type == 'checkbox') {
			input.checked = selectedValue.some(x => x == input.value);
		}
	});
}

function setEvents(element) {
	// Percorre todos os elementos do pai de forma recursiva.

	set(element);

	Array.from(element.children).forEach(child => {
		set(child);

		if (child.children.length)
			setEvents(child);
	});

	function set(child) {
		Array.from(child.attributes).forEach(attr => {
			// Eventos
			if (attr.name.startsWith('on')) {
				const eventName = attr.name.slice(2).toLowerCase();

				child.expressionIndex = attr.value;
				child.removeAttribute(attr.name);
				child.addEventListener(eventName, onEvent);
			}
		});
	}

	function onEvent(event) {
		const target = event.target;
		const result = _expressions[target.expressionIndex](event);

		return result;
	}
}

function compressTemplateString(text) {
	return text.replace(/\n|\t/g, '').trim();
}
