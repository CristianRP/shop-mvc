const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

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
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(file, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

}
