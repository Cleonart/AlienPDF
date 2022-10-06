import AlienPDF from "../../index.js";
export default {
  register: function (app) {
    return app.get("/invoice-simple", (req, res) => {
      res.send("I'am Invoices");
    });
  },
};
