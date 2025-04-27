import { bind, html } from './html.js';

const props = {
	Componente1: { name: 'Componente 1', items: [1, 2, 3] },
	Componente2: { name: 'Componente 2' },
};

// Vinculando ao objeto props
const comp1 = bind(() => html`
	<div>
		<h1>${props.Componente1.name}</h1>
		<button onClick="${event => myFunc(event)}">OK!!</button>
		${props.Componente1.items.map(item => /*html*/`<li>Item ${item}</li>`).join('')}
	</div>
`, props);

//comp1.data.Componente1.name = 'Componente One!!';

// // Desvinculado ao objeto props
// const comp2 = html`
// 	<div>
// 		<h1>${props.Componente2.name}</h1>
// 		<button onClick="${event => myFunc(event)}">OK!!</button>
// 	</div>
// `;

document.body.appendChild(comp1);
//document.body.appendChild(comp2);

function myFunc(event) {
	console.log('myFunc!!', event);
}
