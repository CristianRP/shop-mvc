const { Schema, model, Types } = require('mongoose');

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = model('Product', productSchema);

// const { ObjectId } = require('mongodb');
// const { getDb } = require('../util/database');

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = new ObjectId(userId);
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db.collection('products')
//         .updateOne({ _id: new ObjectId(this._id) }, { $set: this })
//     } else {
//       dbOp = db.collection('products')
//         .insertOne(this)
//     }
//     return dbOp
//       .then(product => {
//         console.log(product);
//       })
//       .catch(console.error);
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       })
//       .catch(console.error);
//   }

//   static findById(productId) {
//     const db = getDb();
//     return db.collection('products')
//       .find({ _id: new ObjectId(productId) }).next()
//       .then(product => {
//         console.log(product);
//         return product;
//       })
//       .catch(console.error);
//   }

//   static deleteById(productId) {
//     const db = getDb();
//     return db.collection('products')
//       .deleteOne({ _id: new ObjectId(productId) })
//       .then(result => {
//         console.log('Deleted');
//       })
//       .catch(console.error);
//   }
// }

// module.exports = Product;
