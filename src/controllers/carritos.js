const logger = require("../utils/logger");
const newOrderSendMail = require("../utils/mail");
const {newOrderSendSms, newOrderSendWhatsapp} = require("../utils/twilio");
const Carritos = require("../daos/carritos");
const Productos = require("../daos/productos");

let carritos = new Carritos();
let productos = new Productos();

const getProductsFromCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const productsOfCart = await carritos.getProductsFromCart(id).then((res) => res);
    if (!productsOfCart) {
      throw new Error('Ese carrito no existe o no tiene productos');
    }
    res.json(productsOfCart);
  } catch (error) {
    next (error);
  }
}

const postCart = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const {id_product}= req.body;
      const userid = req.user._id;
      const producto = await productos.getProductById(id_product).then((res) => res);
      if (!producto) {
        throw new Error('No se puede crear el carrito porque el producto no existe');
      }
      const carrito = {productos: producto._id, usuario: userid};
      const cart = await carritos.createCart(carrito).then((res) => res);
      res.json(cart);
    }
    else {
      throw new Error("Debes estar autenticado para crear un carrito");
    } 
  } catch (error) {
    next(error);
  }
}

const addProductToCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {id_product}= req.body;
    const producto = await productos.getProductById(id_product).then((res) => res);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    const cart = await carritos.addProductToCart(id, producto._id).then((res) => res);
    if (!cart) {
      throw new Error('Ese carrito no existe');
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

const deleteProductFromCart = async (req, res, next) => {
  try {
    const id_product = req.params.id_prod;
    const id = req.params.id;
    const producto = await productos.getProductById(id_product).then((res) => res);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    const cart = await carritos.deleteProductFromCart(id, id_product).then((res) => res);
    if (!cart) {
      throw new Error('Carrito o producto no encontrados')
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

const deleteCart = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cart = await carritos.deleteCartById(id).then((res) => res);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

const procesar = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cart = await carritos.getProductsFromCart(id).then((res) => res);
    if (!cart) {
      throw new Error('Ese carrito no existe o no tiene productos');
    }
    if (req.isAuthenticated()) {
      if (cart.usuario.username === req.user.username) {
        newOrderSendMail(cart);
        newOrderSendSms(cart);
        newOrderSendWhatsapp(cart);
      } else {
        throw new Error("Ese carrito no te corresponde");
      }
      res.json({"Pedido enviado": cart});
    } else {
      throw new Error("Debes estar autenticado para enviar pedidos");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { getProductsFromCart, postCart, addProductToCart, deleteProductFromCart, deleteCart, procesar };
