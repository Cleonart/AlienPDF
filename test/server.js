// * Import necessary testing components
import express from "express";
import table from "./examples/invoice.js";

// * Build app the server
const app = express();
const port = 8888;

// * Register all the route
table.register(app);

// * Listen to change
app.listen(port, () => {
  console.log(`Last alien seen at ${port}`);
});
