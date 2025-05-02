import { html, render } from './html.js';

const props = { name: 'Componente 1' };

const comp1 = html`
	<div>
		<h1>${props.name}</h1>
		<button onClick="${event => myFunc(event)}">OK!!</button>
	</div>
`;

render(document.body, comp1);

function myFunc(event) {
	console.log('myFunc!!', event);
}
