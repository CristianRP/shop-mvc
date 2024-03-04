const pool = require('../util/database');

const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.conn;
  }

  async save() {
    this.conn = await pool.getConnection();
    return this.conn.execute("INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?);",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id) {
    
  }

  static async fetchAll() {
    this.conn = await pool.getConnection();
    return this.conn.query('SELECT * FROM products');
  }

  static async findById(id) {
    this.conn = await pool.getConnection();
    return this.conn.query('SELECT * FROM products WHERE products.id = ?', [id]);
  }
}
