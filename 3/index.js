import { html } from './html.js';

const props = { name: 'Componente 1' };

const component1 = html(() => /*html*/`
	<div>
		<h1>${props.name}</h1>
		<button onClick="${() => myFunc()}">OK!!</button>
		<button onClick="${event => console.log(event, 'OK!!')}">OK!!</button>
		<input type="text" value="${props.name}" onKeyup="${myFunc}" />
	</div>
`);

document.body.appendChild(component1);

function myFunc() {
	console.log('myFunc!!');
}
