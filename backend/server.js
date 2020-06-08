// require the Express module
const express = require("express");
// require cors
const cors = require("cors");
// creates an instance of an Express server
const app = express();
// accept JSON response
app.use(express.json());
// use cors functionality in our express server
app.use(cors());
// define the port
const port = 8888;
// import/require our routes.js
const routes = require("./routes.js");
// declare our endpoint and assign it to use the module we created
app.use("/", routes);
// run the server
app.listen(port, () => {
  console.log(`Listening on port: ${port}.`);
});
