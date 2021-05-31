const express = require("express");
const exphbs = require("express-handlebars");
const { createPreference, getPayment } = require("./mercado-pago");
const { getPublicUrl } = require("./utils");

const port = process.env.PORT || 3000;
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("../assets"));

app.use("/assets", express.static(__dirname + "/../assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  const product = req.query;

  console.log("===== SHOW PRODUCT CHECKOUT PAGE =====");
  console.log(JSON.stringify(product));

  const products = [
    {
      id: 1234,
      title: product.title,
      description: "Celular de Tienda e-commerce",
      picture_url: getPublicUrl(product.img),
      quantity: 1,
      unit_price: Number(product.price),
      currency_id: "BRL",
    },
  ];
  const notification_url = getPublicUrl("mercado-pago/webhook");

  createPreference(products, notification_url)
    .then((response) => {
      console.log("--> Payment preference");
      console.log(JSON.stringify(response.body));
      res.render("detail", { product, preferenceId: response.body.id });
    })
    .catch((error) => {
      res.status(500).json(error);
      console.log(error);
    });
});

app.post("/mercado-pago/webhook", (req, res) => {
  console.log("===== WEBHOOK =====");
  console.log("--> Body");
  console.log(JSON.stringify(req.body));
  console.log("--> Query");
  console.log(JSON.stringify(req.query));

  const payload = req.body;

  if (req.body.action != "payment.created") {
    return res.status(200).json();
  }

  getPayment(payload.data.id)
    .then((payment) => {
      console.log("===== GET PAYMENT =====");
      console.log(JSON.stringify(payment));
      res.status(200).json(payment);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

app.get("/purchase-feedback/success", purchaseFeedback);
app.get("/purchase-feedback/failure", purchaseFeedback);
app.get("/purchase-feedback/pending", purchaseFeedback);

function purchaseFeedback(req, res) {
  const payload = req.query;

  if (payload.status === "null") {
    return res.redirect("/");
  }

  res.render("feedback", {
    ...payload,
    approved: payload.status === "approved",
    pending: payload.status === "pending" || payload.status === "in_process",
    rejected: payload.status === "rejected",
  });
}

app.listen(port, () => {
  console.log(`The server is now running on Port ${port}`);
});
