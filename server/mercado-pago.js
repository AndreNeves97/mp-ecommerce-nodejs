const mercadopago = require("mercadopago");
const { getPublicUrl } = require("./utils");

mercadopago.configure({
  integrator_id: "dev_24c65fb163bf11ea96500242ac130004",
  access_token:
    "APP_USR-334491433003961-030821-12d7475807d694b645722c1946d5ce5a-725736327",
});

exports.createPreference = (products) => {
  let preference = {
    items: products,
    payer: {
      name: "Lalo",
      surname: "Landa",
      email: "test_user_92801501@testuser.com",
      phone: {
        area_code: "55",
        number: 985298743,
      },
      identification: {
        type: "CPF",
        number: "19119119100",
      },
      address: {
        street_name: "Insurgentes Sur",
        street_number: 1602,
        zip_code: "78134-190",
      },
    },
    payment_methods: {
      excluded_payment_methods: [{ id: "amex" }],
      installments: 6,
    },
    back_urls: {
      success: getPublicUrl("purchase-feedback/success"),
      failure: getPublicUrl("purchase-feedback/failure"),
      pending: getPublicUrl("purchase-feedback/pending"),
    },
    auto_return: "approved",
    notification_url:
      "https://webhook.site/c5742ce1-ca50-46d1-8342-9dbdf01c33a3",
    external_reference: "andreneves3@gmail.com",
  };

  return mercadopago.preferences.create(preference);
};
