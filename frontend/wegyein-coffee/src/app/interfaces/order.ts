import { Drink } from './drink';
import { Customer } from './customer';

export interface Order {
	drinks: Drink[];
	food: string[];
	customer: Customer;
}
