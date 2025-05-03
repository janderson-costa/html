import { html, css } from '../html.js';

const list = ['Item 1', 'Item 2', 'Item 3'];
const items = [
	{ name: 'Item 1' },
	{ name: 'Item 2' },
	{ name: 'Item 3' },
];
const colors = ['Red', 'Blue', 'Green'];
const component1 = {
	name: 'Componente 1',
	color: 'Blue',
	colors: ['Blue', 'Green'],
	items: ['Item 1', 'Item 3'],
	disabled: true,
};
const select = html`
	<select @onChange="${e => {
		component1.color = e.element.value;
		e.reload();
	}}">${() => colors.map((color, index) =>
		html`<option type="checkbox" selected="${component1.color == color}">${color}</option>`
	)}</select>
`;


// ! Exemplo
const comp1 = html`
	<div style="flex-direction: column;">
		<h1>${() => component1.name}</h1>
		<div style="flex-direction: column;">
			<div>
				<button @onClick="${e => console.log(e.event)}">Test</button>
				<button @onClick="${e => {
					component1.name = new Date().toUTCString();
					e.reload();
				}}">Change</button>
				<button @onClick="${e => {
					list.push(new Date().toUTCString());
					e.reload();
				}}">Add</button>
				<button @onClick="${e => {
					list.pop(1);
					e.reload();
				}}">Remove</button>
			</div>

			<input type="text" value="${() => component1.name}" @onChange="${e => {
				component1.name = e.element.value;
				e.reload();
			}}" />

			<textarea rows="5" @onChange="${e => {
				component1.color = e.element.value;
				e.reload();
			}}">${() => component1.color}</textarea>

			${select}
			${select.cloneNode(true)}

			${() => items.map(item => html`
				<label>
					<input type="checkbox" name="checkboxOrigem" checked="${component1.items.some(x => x == item.name)}" @onChange="${e => {
						if (e.element.checked)
							component1.items.push(item.name);
						else
							component1.items = component1.items.filter(x => x != item.name);

						console.log(component1.items);
					}}">${item.name}
				</label>
			`)}

			<div>
				<div class="${() => component1.disabled ? 'html-disabled' : ''}">
					${() => colors.map(color => html`
						<label>
							<input type="checkbox" name="checkboxColor" checked="${component1.colors.some(x => x == color)}" @onChange="${e => {
								if (e.element.checked)
									component1.colors.push(color);
								else
									component1.colors = component1.colors.filter(x => x != color);
							}}">${color}
						</label>
					`)}
				</div>
				<button @onClick="${e => {
					component1.disabled = false;
					e.reload();
				}}">Enable</button>
			</div>

			${colors.map(color => html`
				<label>
					<input type="radio" name="radioColor" value="${color}" checked="${component1.color == color}" @onChange="${e => {
						component1.color = e.element.value;
					}}">${color}
				</label>
			`)}

			${() => list.map((item, index) => html`
				<li>${(index + 1) + ' - ' + item}</li>
			`)}
		</div>
	</div>
`;

// CSS - Exemplo de uso
comp1.querySelectorAll('button')[3].css({ color: 'red' }); // Para elementos gerados pela lib
select.css({ color: 'blue' });
css(comp1.querySelector('h1'), { color: 'blue' }); // Para qualquer elemento

document.body.appendChild(comp1);
console.log(comp1);
