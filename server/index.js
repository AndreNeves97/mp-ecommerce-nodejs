const express = require("express");
const exphbs = require("express-handlebars");
const { createPreference } = require("./mercado-pago");
const { getPublicUrl } = require("./utils");

const port = process.env.PORT || 3000;
const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("../assets"));

app.use("/assets", express.static(__dirname + "/../assets"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/detail", function (req, res) {
  const product = req.query;

  createPreference([
    {
      id: 1234,
      title: product.title,
      description: "Celular de Tienda e-commerce",
      picture_url: getPublicUrl(product.img),
      quantity: 1,
      unit_price: Number(product.price),
      currency_id: "BRL",
    },
  ])
    .then((response) => {
      res.render("detail", { product, preferenceId: response.body.id });
    })
    .catch((error) => {
      res.status(500).json(error);
      console.log(error);
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
