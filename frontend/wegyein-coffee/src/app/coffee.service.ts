import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class CoffeeService {
	baseUrl : string = "http://localhost:8888"
	menuEndpoint: string = `${this.baseUrl}/menu`
	constructor(private http : HttpClient) { }

	// sort drinks
	sortDrinks(drinks:any[]): any {
		let sortedDrinks = {};
		drinks.forEach((drink) => {
			if (!sortedDrinks[drink.type]) {
				sortedDrinks[drink.type] = [];
			}
			sortedDrinks[drink.type].push(drink);
		})
		return sortedDrinks;
	}

	// get menu
	getMenu(): any {
		
		return this.http.get(this.menuEndpoint);
	}

	// post ordering

}
