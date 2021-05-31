$(document).ready(() => {
  init();
});

/// ja inicializar a página com a preferência criada

function init() {
  const mp = new MercadoPago("APP_USR-6096a634-0b35-452c-94c9-a18adb8ffb15", {
    locale: "pt-BR",
  });
  // Inicialize o checkout
  mp.checkout({
    preference: {
      id: paymentData.preferenceId,
    },
    render: {
      container: ".mercadopago-button",
      label: "Pague a compra",
    },
  });
}
