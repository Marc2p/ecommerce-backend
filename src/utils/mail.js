const nodemailer = require("nodemailer");
const logger = require("./logger");
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

let newUserSendMail = (newUser, password) => {
  let mailOptions = {
    from: "Entrega final - Marcos Peirone",
    to: newUser.username,
    subject: "Nuevo registro",
    text: `Datos de registro:
    Email: ${newUser.username}
    Contraseña: ${password},
    Nombre: ${newUser.name},
    Dirección: ${newUser.address},
    Edad: ${newUser.age},
    Teléfono: ${newUser.phone}`
  };
  let info = transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger.error("Error al enviar mail: " + err);
    } else {
      logger.info("Message sent: %s", info.messageId);
      logger.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  });
}

let newOrderSendMail = (cart) => {
  let mailOptions = {
    from: "Entrega final - Marcos Peirone",
    to: cart.usuario.username,
    subject: `Nuevo pedido de ${cart.usuario.name} (${cart.usuario.username})`,
    text: `Productos a comprar:
    ${cart.productos}`
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger.error("Error al enviar mail: " + err);
    } else {
      logger.info("Message sent: %s", info.messageId);
      logger.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  });
}

module.exports = {newUserSendMail, newOrderSendMail};