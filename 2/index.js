import { html, render } from './html.js';

const props = { name: 'Componente 1', myFunc: () => console.log('OK!!') };

const comp1 = html(() => /*html*/`
	<div>
		<h1>${props.name}</h1>
		<button onClick=${props.myFunc}>OK!!</button>
		<button onClick=${() => console.log('OK!!')}>OK!!</button>
		<input type="text" value=${props.name} onKeypress=${props.myFunc} />
	</div>
`, props);

render(document.body, comp1);

function teste() {
	console.log('teste');
}
