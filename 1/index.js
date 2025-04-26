import { html, render } from './html.js';

const props = { name: 'Componente 1' };

const comp1 = html/*html*/`
	<div>
		<h1>${props.name}</h1>
		<button onClick=${() => console.log('OK!!')}>OK!!</button>
	</div>
`;

render(document.body, comp1);
