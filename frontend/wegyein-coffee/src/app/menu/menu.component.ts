import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../coffee.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	showMenu: boolean = false;
	menu: any = null;
	constructor(private coffeeService: CoffeeService) { }

	ngOnInit(): void {
		this.getMenu();
	}

	getMenu(): void {
		this.coffeeService.getMenu().subscribe((res) => {
			this.menu = {
				drinks : this.coffeeService.sortDrinks(res.drinks), 
				food: res.food, 
				beans: res.beans, 
				creamers: res.creamers
			};
		})
	}

	toggleMenu() {
		this.showMenu = !this.showMenu;
	}

}
