// * Import necessary testing components
import express from "express";
import Invoice from "./examples/invoice.js";
import DeliveryNote from "./examples/delivery_note.js";

// * Build app the server
const app = express();
const port = 8888;

// * Register all the route
Invoice.register(app);
DeliveryNote.register(app);

// * Listen to change
app.listen(port, () => {
  console.log(`Last alien seen at ${port}`);
});
