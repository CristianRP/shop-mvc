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
  req.user.createProduct({
    title,
    imageUrl,
    price,
    description
  })
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

  req.user.getProducts({ where: { id: productId }})
    .then(([product]) => {
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

  Product.findByPk(productId)
    .then(product => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(result => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch(console.err)

};

exports.deleteProduct = (req, res, next) => {
  console.log("DELETE");
  const { productId } = req.params;

  // Product.destroy()
  Product.findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(console.err);
}

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render('admin/products', {
        products: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(console.err);
}
