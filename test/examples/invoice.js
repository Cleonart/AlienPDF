import AlienPDF from "../../index.js";

export default {
  register: function (app) {
    return app.get("/invoice-simple", (req, res) => {
      const doc = AlienPDF.create({
        size: "LEGAL",
        font: "Times-Roman",
        bufferPages: true,
        margins: {
          top: 35.43,
          right: 43.08,
          bottom: 15.3,
          left: 70,
        },
      });
      doc.breakpoint = 850;
      AlienPDF.PDFLeftHeader(doc);
      AlienPDF.PDFCenterHeading(doc, "Coba COba", {});
      const finalPDF = AlienPDF.endAndRead(doc);
      res.write(finalPDF);
      res.end();
    });
  },
};
