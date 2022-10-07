//* Accounting Templates
import DeliveryNote from "./accounting/delivery_note.js";
import InvoiceOrderPurchase from "./accounting/invoice_order_purchase.js";
import InvoiceOrdersales from "./accounting/invoice_order_sales.js";

//* Letter Templates
import SimpleLetter from "./letter/simple.js";

export default {
  delivery_note: DeliveryNote,
  invoice_order_purchase: InvoiceOrderPurchase,
  invoice_order_sales: InvoiceOrdersales,
  simple_letter: SimpleLetter,
};
