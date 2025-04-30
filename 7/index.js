import { bind, html } from './html.js';

const origens = ['Correio', 'E-Mail', 'Fone'];
const items = [
	{ name: 'Correio' },
	{ name: 'E-Mail' },
	{ name: 'Fone' },
];
const props = {
	Componente1: { name: 'Componente 1', items: items, origemRadio: 'E-Mail', origemCheckbox: ['Correio', 'Fone']},
	Componente2: { name: 'Componente 2', items: items },
};

// ! Exemplo 1: Vinculando ao objeto props
const comp1 = bind(() => html`
	<div name="${props.Componente1.name}" style="display: inline-flex; flex-direction: column; gap: 8px;">
		<h1>${props.Componente1.name}</h1>
		<div>
			<label @for="value of ${origens}">
				<input type="radio" name="origemRadio" value="{value}" @data="${props.Componente1.origemRadio}">{value}
			</label>
		</div>
		<div>
			<label @for="value of ${origens}">
				<input type="checkbox" name="origemCheckbox" value="{value}" @data="${props.Componente1.origemCheckbox}">{value}
			</label>
		</div>
		<div>
			<button @onClick="${(event) => console.log(event)}">Test</button>
			<button @onClick="${() => {
				let item = { name: comp1.data.Componente1.name };
				comp1.data.Componente1.items.push(item);
			}}">Add</button>
			<button @onClick="${() => comp1.data.Componente1.items.pop(1)}">Remove</button>
		</div>
		<input type="text" @data="${props.Componente1.name}"/>
		<textarea @data="${props.Componente1.name}"></textarea>
		<li @for="item of ${props.Componente1.items}">
			{index} - {item.name}
		</li>
	</div>
`, props);

// ! Exemplo 2: Desvinculado ao objeto props
// const comp2 = html`
// 	<div name="${props.Componente2.name}">
// 		<h1>${props.Componente2.name}</h1>
// 		<button onClick="${event => myFunc(event)}">OK!!</button>
// 		${props.Componente2.items.map(item => /*html*/`
// 			<li>Item ${item}</li>
// 		`).join('')}
// 	</div>
// `;

document.body.appendChild(comp1);
//document.body.appendChild(comp2);

//comp1.data.Componente1.name = 'Componente Um!!';
// comp1.data.Componente1.items = [
// 	{ name: 'Item 1' },
// 	{ name: 'Item 2' },
// 	{ name: 'Item 3' },
// ];

function myFunc(event) {
	console.log('myFunc!!', event || '');
}

//eval="'{value}' == '${props.Componente1.origem}' ? 'checked' : ''"
