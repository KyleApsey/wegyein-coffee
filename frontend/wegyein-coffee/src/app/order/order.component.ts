import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { CoffeeService } from '../coffee.service';
import { Drink } from '../interfaces/drink';
import { Order } from '../interfaces/order';
import { Customer } from '../interfaces/customer';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
	menu: any;
	drinksEspresso: Drink[] = [];
	drinksAeroPress: Drink[] = [];
	drinksFrenchPress: Drink[] = [];
	orderFood: any[] = []
	drinksOther: Drink[] = [];
	orderReady: boolean = false;
	orderConfirmed: boolean = false;
	needValidCustomer: boolean = false;
	customer: Customer = {
		name: "",
		email: "",
		togo: ""
	};
	showCustomerForm: boolean = false;
	confirmedOrder: Order = {
		drinks: [],
		food: [],
		customer: {
			name: "",
			email: "",
			togo: ""
		}
	};

	constructor(private coffeeService: CoffeeService) { }

	ngOnInit(): void {
		this.coffeeService.getMenu().subscribe((res) => {
			this.menu = {
				drinks : this.coffeeService.sortDrinks(res.drinks), 
				food: res.food, 
				beans: res.beans, 
				creamers: res.creamers
			};
		})
	}
	addCustomer(form: NgForm): void {
		if (form.value.customer_name.length && form.value.customer_email.length && form.value.customer_togo.length) {
			this.customer = {
				name: form.value.customer_name,
				email: form.value.customer_email,
				togo: form.value.customer_togo
			}
			this.showCustomerForm = false;
		} else {
			this.needValidCustomer = true;
		}
	}

	addDrinkEspresso(): void {
		this.drinksEspresso.push({type: "", temp: "", drink: "", shots: 0, bean: "", creamer: ""});
	}
	addDrinkAeroPress(): void {
		this.drinksAeroPress.push({type: "", temp: "", drink: "", shots: 0, bean: "", creamer: ""});
	}
	addDrinkFrenchPress(): void {
		this.drinksFrenchPress.push({type: "", temp: "", drink: "", shots: 0, bean: "", creamer: ""});
	}
	addDrinkOther(): void {
		this.drinksOther.push({type: "", temp: "", drink: "", shots: 0, bean: "", creamer: ""});
	}
	addFood(): void {
		this.orderFood.push({type: "", temp: "", drink: "", shots: 0, bean: "", creamer: ""});
	}

	submitEspresso(form: NgForm, index: number): void {
		let drink : Drink = {
			type: "espresso",
			temp: form.value["temp_espresso_" + index],
			drink: form.value["drink_espresso_" + index],
			shots: Number(form.value["shots_espresso_" + index]),
			bean: "nicaragua",
			creamer: form.value["creamer_espresso_" + index]
		};
		this.drinksEspresso.splice(index, 1, drink)
		this.showCustomerForm = this.customer.name.length ? false : true;
	}

	submitAeroPress(form: NgForm, index: number): void {
		let drink : Drink = {
			type: "aero press",
			temp: form.value["temp_aeropress_" + index],
			drink: form.value["drink_aeropress_" + index],
			shots: 0,
			bean: form.value["bean_aeropress_" + index],
			creamer: form.value["creamer_aeropress_" + index]
		};
		this.drinksAeroPress.splice(index, 1, drink)
		this.showCustomerForm = this.customer.name.length ? false : true;
	}

	submitFrenchPress(form: NgForm, index: number): void {
		let drink : Drink = {
			type: "french press",
			temp: "hot",
			drink: "french press",
			shots: Number(form.value["shots_frenchpress_" + index]),
			bean: "ethiopia",
			creamer: form.value["creamer_frenchpress_" + index]
		};
		this.drinksFrenchPress.splice(index, 1, drink)
		this.showCustomerForm = this.customer.name.length ? false : true;
	}

	submitOther(form: NgForm, index: number): void {
		let drink : Drink = {
			type: "other",
			temp: "ice",
			drink: form.value["drink_other_" + index],
			shots: 0,
			bean: "",
			creamer: ""
		};
		this.drinksOther.splice(index, 1, drink)
		this.showCustomerForm = this.customer.name.length ? false : true;
	}

	submitFood(form: NgForm, index: number): void {
		let food = form.value["food_name_" + index]
		this.orderFood.splice(index, 1, food)
		this.showCustomerForm = this.customer.name.length ? false : true;
	}
	  
	readyOrder(): void {
		if (this.drinksEspresso.length) {
			if (this.drinksEspresso[0].type.length) {
				this.confirmOrder()
				this.orderReady = true;
			}
		}
		if (this.drinksAeroPress.length) {
			if (this.drinksAeroPress[0].type.length) {
				this.confirmOrder()
				this.orderReady = true;
			}
		}
		if (this.drinksFrenchPress.length) {
			if (this.drinksFrenchPress[0].type.length) {
				this.confirmOrder()
				this.orderReady = true;
			}
		}
		if (this.drinksOther.length) {
			if (this.drinksOther[0].type.length) {
				this.confirmOrder()
				this.orderReady = true;
			}
		}
		if (this.orderFood.length) {
			if (this.orderFood[0].length) {
				this.confirmOrder()
				this.orderReady = true;
			}
		}
	}

	confirmOrder(): void {
		this.confirmedOrder.drinks = [...this.drinksEspresso.filter((drink) => drink.type.length), ...this.drinksAeroPress.filter((drink) => drink.type.length), ...this.drinksFrenchPress.filter((drink) => drink.type.length), ...this.drinksOther.filter((drink) => drink.type.length)];
		this.confirmedOrder.food = [...this.orderFood.filter((food) => food.length)];
	}

	submitOrder(): void {
		this.confirmOrder()
		console.log(this.confirmedOrder);
		this.orderConfirmed = true;
	}

}
