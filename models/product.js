const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    const file = path.join(
      rootDir,
      'data',
      'products.json'
    );

    fs.readFile(file, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(file, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });

  }

  static fetchAll(callback) {
    const file = path.join(
      rootDir,
      'data',
      'products.json'
    );
    fs.readFile(file, (err, fileContent) => {
      if (err) {
        callback([]);
      }
      callback(JSON.parse(fileContent));
    });
  }

}
