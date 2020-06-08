// **********************
// menu
// **********************
// variable to store data
let menu = {
	drinks : [
			{
				name: "Americano",
				shots: 2,
				iced: true,
				type: "espresso",
				misc: ""
			},
			{
				name: "Latte",
				shots: 2,
				iced: true,
				type: "espresso",
				misc: ""
			},
			{
				name: "Cappuccino",
				shots: 1,
				iced: false,
				type: "espresso",
				misc: ""
			},
			{
				name: "Cortado",
				shots: 1,
				iced: false,
				type: "espresso",
				misc: ""
			},
			{
				name: "Aero Americano",
				shots: 0,
				iced: true,
				type: "aeroPress",
				misc: ""
			},
			{
				name: "Aero Coffee",
				shots: 0,
				iced: true,
				type: "aeroPress",
				misc: ""
			},
			{
				name: "French Press",
				shots: 0,
				iced: true,
				type: "frenchPress",
				misc: ""
			},
			{
				name: "Water",
				shots: 0,
				iced: true,
				type: "other",
				misc: "ice at no additional charge"
			},
			{
				name: "Juice",
				shots: 0,
				iced: true,
				type: "other",
				misc: "check with your barista for currently available selection"
			}
	],
	beans : [
		{
			name: "Nicaragua",
			type: ["espresso", "aero-press"]
		},
		{
			name: "Ethiopia",
			type: ["aero-press", "french-press"]
		}
	],
	food: [
		{
			name: "Cutie",
			misc: "good on the go"
		},
		{
			name: "Cinnamon Toast",
			misc: "good on the go if you like a mess"
		},
		{
			name: "Cereal",
			misc: "check with your barista for currently available selection"
		},
		{
			name: "참치메요 삼각김밥",
			misc: "triangle rice ball with tuna and mayo filling"
		},
		{
			name: "Muffin",
			misc: "check with your barista for currently available selection"
		},
		{
			name: "Eggs",
			misc: "one to many eggs, cooked your way"
		}
	],
	creamers : ["Italian Sweet Cream"]
}
// **************************************
// formatting functionality
// **************************************
// format the time of the order
function formatOrderTime() {
	const orderTime = new Date();
	const orderMinutes = orderTime.getMinutes();
	const orderHour24 = orderTime.getHours();
	const orderTime12 = orderHour24 === 0 ? `12:${orderMinutes}am` : orderHour24 < 12 ? `${orderHour24}:${orderMinutes}am` : `${orderHour24 - 12}:${orderMinutes}pm`;
	return `${orderTime12} on ${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
}

// format a drink for email
function formatDrink(drink) {
	// determine the type of drink
	let formattedDrink = false;
	// espresso formatting
	if (drink.type === "espresso") {
		formattedDrink = `${drink.temp} ${drink.drink}, ${drink.shots} shots of ${drink.bean} ${drink.creamer.length ? drink.creamer : "black"}`;
	}
	// french press
	else if (drink.type === "french press") {
		formattedDrink = `${drink.temp} ${drink.bean} ${drink.drink} ${drink.creamer.length ? drink.creamer : "black"}`;
	}
	// aeropress formatting
	else if (drink.type === "aero press") {
		formattedDrink = `${drink.temp} ${drink.bean} ${drink.type} ${drink.drink} ${drink.creamer.length ? drink.creamer : "black"}`;
	}
	// other formatting
	else {
		formattedDrink = `${drink.drink}`;
	}
	return formattedDrink;
}

// create an HTML string for use in the email template
function getListHtmlString(list) {
	let listHtml = `<ul>`
	list.forEach((item) => {listHtml += `<li>${item}</li>`})
	return `${listHtml}</>`;
}

// **************************************
// nodemailer
// **************************************
const nodemailer = require("nodemailer");
const { sendToEmail, emailCredentials } = require("./config");
const sendToEmail = sendToEmail;

const emailCredentials = emailCredentials;

let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: emailCredentials.user,
		pass: emailCredentials.pass
	}
});

// **************************************
// express routes
// **************************************
// require express
const express = require("express");
// use express's Router to set endpoint
const routes = express.Router();

// **************************************
// endpoints
// **************************************
// GET endpoint (receive data)
routes.get("/menu", (req, res) => {
  res.json(menu);
});
// POST endpoint (send data)
routes.post("/order", (req, res) => {
	// ********************
	// date/time logic
	// ********************
	let orderTime = formatOrderTime();

	// ********************
	// customer logic
	// ********************
	// capture customer information
	const customer = {
		name : req.body.customer.name,
		email : req.body.customer.email,
		togo : req.body.customer.togo
	}
	// ********************
	// drink logic
	// ********************
	// create array of formatted drinks
	const drinks = req.body.drink.map((drink) => formatDrink(drink));
	const drinkHtmlString = getListHtmlString(drinks);
	// ********************
	// food logic
	// ********************
	const food = req.body.food;
	const foodHtmlString = getListHtmlString(food);

	// ********************
	// order
	// ********************
	// for use in order/receipt
	const order = {
		drinks : drinks,
		food : food,
		time : orderTime,
		name : customer.name,
		email : customer.email
	}
	// html structure for order
	const orderHtmlString = `
	<p>${customer.name} has placed the following order ${customer.togo}</p>
	<h2>Drinks:</h2>
	${drinkHtmlString}
	<h2>Food:</h2>
	${foodHtmlString}
	<p>Order placed at ${orderTime}</p>
	`;
	// mail options for order
	const orderMailOptions = {
		from: emailCredentials.user,
		to: sendToEmail,
		subject: `${customer.name} has placed an order!`,
		html: orderHtml
	}

	// send the order email
	transporter.sendMail(orderMailOptions, (err, info) => {
		if(err) {
			console.log(err);
		} else {
			console.log(info);
		}
	})

	// html structure for receipt
	const receiptHtml = `
	<p>Your barista will have your ${req.body.customer.togo} order, placed at ${orderTime}, ready soon!</p>
	<p>Please make sure the following order looks correct.</p>
	<h2>Drinks:</h2>
	${drinkHtmlString}
	<h2>Food:</h2>
	${foodHtmlString}
	<p>Preparation time may vary, thank you for your patience!</p>
	`;

	// mail options for receipt
	const receiptMailOptions = {
		from: emailCredentials.user,
		to: customer.email,
		subject: `Thanks for your order ${customer.name}!`,
		html: receiptHtml
	}

	// send the receipt email
	transporter.sendMail(receiptMailOptions, (err, info) => {
		if(err) {
			console.log(err);
		} else {
			console.log(info);
		}
	})

  	// the body of the request
  	res.json(req.body);
});

// PUT endpoint (update data)

// DELETE endpoint (remove data)


// export this module
module.exports = routes;
