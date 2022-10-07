import AlienPDF from "../../index.js";

export default {
  register: function (app) {
    return app.get("/delivery-note", (req, res) => {
      const alienTemplates = AlienPDF.templates;
      const deliveryNote = alienTemplates.delivery_note;
      const alienDeliveryNote = deliveryNote.register(AlienPDF);
      res.write(alienDeliveryNote);
      res.end();
    });
  },
};
