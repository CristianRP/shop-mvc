const { validationResult } = require('express-validator');

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
  const { title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: { title, imageUrl, price, description },
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
    .catch(error => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: { title, imageUrl, price, description },
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
      // res.redirect('/500');
      // const error = new Error('Creating a product failed.');
      const error = new Error(error);
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
    .catch(error => {
      const error = new Error(error);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

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

      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;    
      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(error => {
      const error = new Error(error);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  console.log("DELETE");
  const { productId } = req.params;

  Product.findOneAndDelete({ _id: productId, userId: req.user._id })
    .then(() => {
      console.log('destroyed product', productId);
      res.redirect('/admin/products');
    })
    .catch(error => {
      const error = new Error(error);
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
    .catch(error => {
      const error = new Error(error);
      error.httpStatusCode = 500;
      return next(error);
    });
}
