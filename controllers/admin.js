const { validationResult } = require('express-validator');

const fileHelper = require('../util/file');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: null,
    hasError: true,
    errorMessage: null,
    validationErrors: []
  })
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  const { file } = req;

  if (!file) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: { title, price, description },
      errorMessage: 'Attached file is not an image',
      validationErrors: []
    });
  }

  const imageUrl = file.path;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: { title, price, description },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });

  product.save()
    .then(() => {
      res.redirect('/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const { edit } = req.query;

  if (!edit) {
    return res.redirect('/'); //redudant
  }

  const { productId } = req.params;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/add-product',
        editing: edit,
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: { _id: productId, title, imageUrl, price, description },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  console.log("PRODUCTID=> ", productId);
  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        throw new Error('User without permissions');
      }

      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }

      product.title = title;
      product.price = price;
      product.description = description;    
      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  console.log("DELETE");
  const { productId } = req.params;

  Product.findOneAndDelete({ _id: productId, userId: req.user._id })
    .then((product) => {
      fileHelper.deleteFile(product.imageUrl);
      console.log('destroyed product', productId);
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getProducts = (req, res, next) => {
  // Product.find({ userId: req.user._id })
  Product.find()
    // .select('title price -_id') select and exclude with "-"
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
