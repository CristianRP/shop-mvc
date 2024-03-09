const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: null,
  })
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
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
    .catch(console.error);
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
      });
    })
    .catch(console.error);
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  Product.findById(productId)
    .then(product => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;    
      return product.save();
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(console.error);
};

exports.deleteProduct = (req, res, next) => {
  console.log("DELETE");
  const { productId } = req.params;

  Product.findByIdAndDelete(productId)
    .then(() => {
      console.log('destroyed product', productId);
      res.redirect('/admin/products');
    })
    .catch(console.error);
}

exports.getProducts = (req, res, next) => {
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
    .catch(console.error);
}
