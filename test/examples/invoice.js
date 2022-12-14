import AlienPDF from "../../index.js";

export default {
  register: function (app) {
    return app.get("/invoice-simple", (req, res) => {
      const alienTemplates = AlienPDF.templates;
      const alienDeliveryNote = alienTemplates.delivery_note.register(AlienPDF);
      res.write(alienDeliveryNote);
      res.end();
    });
  },
};
