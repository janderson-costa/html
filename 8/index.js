import { html } from './html.js';

const origins = ['Correio', 'E-Mail', 'Fone'];
const colors = ['Red', 'Blue', 'Green'];
const items = [
	{ name: 'Correio' },
	{ name: 'E-Mail' },
	{ name: 'Fone' },
];
const props = {
	Componente1: { name: 'Componente 1', color: 'Blue', origemRadio: 'E-Mail', origem: ['Correio', 'Fone']},
	Componente2: { name: 'Componente 2' },
};
const select = html`
	<select @onChange="${e => props.Componente1.color = e.element.value}">${() => colors.map((color, index) =>
		html`<option type="checkbox" selected="${props.Componente1.color == color}">${color}</option>`
	)}</select>
`;

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
				items.push({ name: new Date().toUTCString() });
				e.reload();
			}}">Add</button>
			<button @onClick="${e => {
				items.pop(1);
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

		${select}
		${select.cloneNode(true)}

		${() => items.map((item, index) => html`
			<label>
				<input type="checkbox" name="checkboxOrigem" checked="${props.Componente1.origem.some(x => x == item.name)}" @onChange="${e => {
					console.log(e.element.checked);
				}}">${item.name}
			</label>
		`)}

		${() => origins.map((item, index) => html`
			<label>
				<input type="radio" name="radioOrigem" @onChange="${e => {
					//..
				}}">${item}
			</label>
		`)}
	</div>
`;

document.body.appendChild(comp1);

// ${() => items.map((item, index) =>
// 	html`<li @onClick="${e => console.log(e.element)}">${ index + ' - ' + item.name}</li>`.outerHTML
// ).join('')}

// {/* <label @for="${items}">
// 	<input type="checkbox" name="checkboxOrigem" @onChange="${e => e.item.checked = e.element.checked}">{item.name}
// </label> */}
