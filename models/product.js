const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const Cart = require('./cart');

const file = path.join(
  rootDir,
  'data',
  'products.json'
);

const getProductsFromFile = (callback) => {
  fs.readFile(file, (err, fileContent) => {
    if (err) {
      return callback([]);
    }
    callback(JSON.parse(fileContent));
  });
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(product => product.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(file, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(file, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id);
      const updatedProducts = products.filter(product => product.id !== id);
      fs.writeFile(file, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id == id);
      callback(product);
    });
  }
}
