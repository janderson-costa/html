import { html } from './html.js';

const origens = ['Correio', 'E-Mail', 'Fone'];
const items = [
	{ name: 'Correio' },
	{ name: 'E-Mail' },
	{ name: 'Fone' },
];
const props = {
	Componente1: { name: 'Componente 1', items: items, color: 'Red', origemRadio: 'E-Mail', origemCheckbox: ['Correio', 'Fone']},
	Componente2: { name: 'Componente 2', items: items },
};

// ! Exemplo 1
const comp1 = html`
	<div style="display: inline-flex; flex-direction: column; gap: 8px;">
		<h1>${() => props.Componente1.name}</h1>
		<div>
			<button @onClick="${e => console.log(e.event)}">Test</button>
			<button @onClick="${e => {
				props.Componente1.name = new Date().toUTCString();
				e.reload();
			}}">Change</button>
			<button @onClick="${e => {
				props.Componente1.items.push({ name: new Date().toUTCString() });
				e.reload();
			}}">Add</button>
			<button @onClick="${e => {
				props.Componente1.items.pop(1);
				e.reload();
			}}">Remove</button>
		</div>
		<input type="text" value="${() => props.Componente1.name}" @onChange="${e => {
			props.Componente1.name = e.element.value;
			e.reload();
		}}" />
		<textarea @onChange="${e => {
			props.Componente1.color = e.element.value;
			e.reload();
		}}">${() => props.Componente1.color}</textarea>
		${props.Componente1.items.map((item, index) => html`
			<label>
				<input type="checkbox" name="checkboxOrigem" @onChange="${e => {
					item.checked = e.element.checked;
				}}">${item.name}
			</label>`
		)}
	</div>
`;

document.body.appendChild(comp1);

// ${() => props.Componente1.items.map((item, index) =>
// 	html`<li @onClick="${e => console.log(e.element)}">${ index + ' - ' + item.name}</li>`.outerHTML
// ).join('')}

// {/* <label @for="${props.Componente1.items}">
// 	<input type="checkbox" name="checkboxOrigem" @onChange="${e => e.item.checked = e.element.checked}">{item.name}
// </label> */}
