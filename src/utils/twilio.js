const logger = require("./logger");
const twilio = require("twilio");
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = twilio(accountSid, authToken);

let newOrderSendSms = async (cart) => {
  const message = await client.messages.create({
    body: "El pedido se encuentra en proceso",
    from: process.env.TWILIO_NUMBER,
    to: cart.usuario.phone
  });
  logger.info(message);
}

let newOrderSendWhatsapp = async (cart) => {
  const whatsapp = await client.messages.create({
    body: `Nuevo pedido de ${cart.usuario.name} (${cart.usuario.username})`,
    from: process.env.TWILIO_WH_NUMBER,
    to: `whatsapp:${cart.usuario.phone}`
  });
  logger.info(whatsapp);
}

module.exports = {newOrderSendSms, newOrderSendWhatsapp};