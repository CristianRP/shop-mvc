// const products = [];

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  console.log('Users middleware');
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: null
  })
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, description, price);
  product.save()
    .then(() => res.redirect('/'))
    .catch(console.err);
};

exports.getEditProduct = (req, res, next) => {
  const { edit } = req.query;

  if (!edit) {
    return res.redirect('/'); //redudant
  }

  const { productId } = req.params;

  Product.findById(productId, product => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: edit,
      product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  const updatedProduct = new Product(productId, title, imageUrl, description, price);

  updatedProduct.save();

  res.redirect('/admin/products');
};

exports.deleteProduct = (req, res, next) => {
  console.log("DELETE");
  const { productId } = req.params;

  Product.deleteById(productId);
  res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      products: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
}
