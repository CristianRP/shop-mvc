const { ObjectId } = require('mongodb');

const { getDb } = require('../util/database');

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // { items: [] }
    this._id = id ? new ObjectId(id) : null;
  }

  save() {
    const db = getDb();

    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const db = getDb();

    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    })
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
    }

    const updatedCart = { items: updatedCartItems };
    return db.collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: updatedCart } }
      );

  }

  getCart() {
    const db = getDb();

    const productIds = this.cart.items.map(({ productId }) => productId);
    return db.collection('products')
      .find({ _id: { $in: productIds } }).toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product,
            quantity: this.cart.items.find(cartItem => {
              return cartItem.productId.toString() === product._id.toString();
            }).quantity
          }
        })
      })
      .catch(console.error);
  }
  
  deleteItemFromCart(productId) {
    const db = getDb();

    const newItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
    
    return db.collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: newItems } }}
      );
  }

  static findById(userId) {
    const db = getDb();

    return db.collection('users').findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
