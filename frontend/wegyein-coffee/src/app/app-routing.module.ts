import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';


const routes: Routes = [
	{path: "order", component: OrderComponent},
	{path: "", redirectTo: "/order", pathMatch: "full"},
	{path: "**", redirectTo: "/order", pathMatch: "full"}
];

@NgModule({
  	imports: [RouterModule.forRoot(routes)],
  	exports: [RouterModule]
})

export class AppRoutingModule { }
