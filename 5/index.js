import { bind, html } from './html.js';

const props = {
	Componente1: { name: 'Componente 1', items: [1, 2, 3, 4, 5], origem: ''},
	Componente2: { name: 'Componente 2', items: [1, 2, 3, 4, 5] },
};
const origens = ['Correio', 'E-Mail', 'Fone'];

// ! Exemplo 1: Vinculando ao objeto props
const comp1 = bind(() => html`
	<div name="${props.Componente1.name}">
		<h1>${props.Componente1.name}</h1>
		<div style="display: flex; gap: 8px; padding: 8px 0px;">
			${origens.map(name => /*html*/`
				<label>
					<input type="radio" name="origem" value="${name}" onChange="${event => comp1.data.Componente1.name = event.target.value}">${name}
				</label>
			`).join('')}
		</div>
		<span>
			<span>
				<span>
					<button onClick="${(event) => console.log(event)}">Test</button>
					<button onClick="${() => comp1.data.Componente1.items.push(comp1.data.Componente1.name)}">Add</button>
					<button onClick="${() => comp1.data.Componente1.items.pop(1)}">Remove</button>
					<input type="text" value="${props.Componente1.name}" onKeyup="${event => comp1.data.Componente1.name = event.target.value}" />
					${props.Componente1.items.map(item => /*html*/`
						<li>Item ${item}</li>
					`).join('')}
				</span>
			</span>
		</span>
	</div>
`, props);

// ! Exemplo 2: Desvinculado ao objeto props
const comp2 = html`
	<div name="${props.Componente2.name}">
		<h1>${props.Componente2.name}</h1>
		<button onClick="${event => myFunc(event)}">OK!!</button>
		${props.Componente2.items.map(item => /*html*/`
			<li>Item ${item}</li>
		`).join('')}
	</div>
`;

document.body.appendChild(comp1);
document.body.appendChild(comp2);

// comp1.data.Componente1.name = 'Componente Um!!';
// comp1.data.Componente1.items = [1, 2, 3];

function myFunc(event) {
	console.log('myFunc!!', event || '');
}
