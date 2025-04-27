function html(templateFunction, window) {
	console.log(window);
	const element = createElement(templateFunction());

	walk(element);

	return element;


	// FUNÇÕES

	function createElement(html) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		return doc.body.firstChild;
	}

	function walk(parent) {
		for (let child of parent.children) {
			Array.from(child.attributes).forEach(x => {
				// Eventos
				if (x.name.startsWith('on')) {
					child.removeAttribute(x.name);
					//console.log(x.value);
					//child.addEventListener(x.name.slice(2).toLowerCase(), eval(x.value));
					//child.addEventListener(x.name.slice(2).toLowerCase(), new Function(`return ${x.value}`)());
					console.log(x.value);
					child.addEventListener(x.name.slice(2).toLowerCase(), eval(x.value));
					//child[x.name].onclick = new Function(`return ${x.value}`)();
				}
			});
		}
	}
}

export { html };
