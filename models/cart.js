const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const file = path.join(
  rootDir,
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(file, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex(product => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += parseInt(productPrice);
      fs.writeFile(file, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(file, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      if (err) {
        return;
      }
      const updatedCart = { ...cart };
      const product = updatedCart.products.find(product => product.id === id);
      if (!product) {
        return;
      }
      const productQty = parseInt(product.qty);
      updatedCart.products = updatedCart.products.filter(product => product.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - parseFloat(productPrice) * productQty;

      fs.writeFile(file, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }

  static getCart(callback) {
    fs.readFile(file, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }
}
