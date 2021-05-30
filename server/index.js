const express = require("express");
const exphbs = require("express-handlebars");
const { createPreference } = require("./mercado-pago");

const port = process.env.PORT || 3000;
const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("assets"));

app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  console.log(req.query);
  res.render("detail", req.query);
});

app.listen(port, () => {
  console.log(`The server is now running on Port ${port}`);
});
