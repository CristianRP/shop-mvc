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
  const product = new Product(
    title,
    price,
    description,
    imageUrl
  );
  product.save()
    .then(() => {
      res.redirect('/products');
    })
    .catch(console.err);
};

exports.getEditProduct = (req, res, next) => {
  const { edit } = req.query;

  if (!edit) {
    return res.redirect('/'); //redudant
  }

  const { productId } = req.params;

  Product.findById(productId)
    .then(product => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/add-product',
        editing: edit,
        product
      });
    })
    .catch(console.err);
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  const product = new Product(title, price, description, imageUrl, productId);

  product.save()
    .then(result => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch(console.err)
};

exports.deleteProduct = (req, res, next) => {
  console.log("DELETE");
  const { productId } = req.params;

  Product.deleteById(productId)
    .then(() => {
      console.log('destroyed product', productId);
      res.redirect('/admin/products');
    })
    .catch(console.err);
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        products: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(console.err);
}
