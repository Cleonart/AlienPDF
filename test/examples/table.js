export default {
  register: function (app) {
    return app.get("/table", (req, res) => {
      res.send("I'am Invoices");
    });
  },
};
