import { jsx, render } from './jsx.js';

const comp1 = Component1({ name: 'João', setName: (name, event) => console.log(name, event) });

render(document.body, comp1);

function Component1(props) {
	return jsx/*html*/`
		<div>
			<h1>${props.name}</h1>
			<button onClick=${teste}>OK!!</button>
			<input type="text" value=${props.name} onChange=${(event) => props.setName(event.target.value, event)} />
		</div>
	`;

	function teste(e) {
		console.log(e, props.name);
	}
}
