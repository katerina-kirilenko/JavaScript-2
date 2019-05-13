class Hamburger {
	constructor(size, stuffing) {
		this.size = size;
		this.stuffing = stuffing;
		this.spise = null;
		this.mayonnaise = null;
	}

	set Spice(value) {
		this.spise = value;
	}
	set Mayonnaise(value) {
		this.mayonnaise = value;
	}

	calculatePrice() {
		let prise = 0;
		prise += this.size.cost;
		if (this.spise != null ) {
			prise += this.spise.cost;
		}
		if (this.mayonnaise != null ) {
			prise += this.mayonnaise.cost;
		}
		prise += this.stuffing.reduce((acc, currentValue) => acc + currentValue.cost, 0);
		return prise;
	}

	calculateCalories() {
		let calories = 0;
		calories += this.size.calories;
		if (this.spise != null ) {
			calories += this.spise.calories;
		}
		if (this.mayonnaise != null ) {
			calories += this.mayonnaise.calories;
		}
		calories += this.stuffing.reduce((acc, currentValue) => acc + currentValue.calories, 0);
		return calories;
	}

	toString() {
		let text = "Готовый гамбургер: <br>";
		text += `Размер: ${this.size.name}, цена: ${this.size.cost} руб., калорийность: ${this.size.calories} Ккал<br>`;
		text += `Начинка: <br>`;
		text += this.stuffing.reduce((acc, item) => 
			acc += `&nbsp; &nbsp; Название: ${item.name}, цена: ${item.cost} руб., калорийность: ${item.calories}  Ккал<br>`, ''
		);		
		if (this.spise != null) {
			text += `Приправа: цена: ${this.spise.cost} руб., калорийность: ${this.spise.calories} Ккал<br>`;
		} else {
			text += `Приправа не добавлена <br>`;
		}
		if (this.mayonnaise != null ) {
			text += `Майонез: цена: ${this.mayonnaise.cost} руб., калорийность: ${this.mayonnaise.calories} Ккал<br>`;
		} else {
			text += `Майонез не добавлен <br>`;
		}
		text += `Итоговая стоимость: ${this.calculatePrice()} руб.<br>`;
		text += `Общая калорийность: ${this.calculateCalories()} Ккал<br>`;
		return text;
	}
}

let stuffing = [
	{name: "С сыром", cost: 10, calories: 20 },
	{name: "С салатом", cost: 20, calories: 5 },
	{name: "С картофелем", cost: 15, calories: 10 }
];

let size = {name: "Маленький", cost: 50, calories: 20};
let Hum = new Hamburger(size, stuffing);
Hum.Spice = {cost: 15, calories: 0};

document.querySelector('.container').innerHTML = Hum.toString();