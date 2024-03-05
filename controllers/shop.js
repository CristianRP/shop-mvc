const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts =  (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render('shop/product-list', {
        products: rows,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(console.log);
};

exports.getProduct = (req, res, next) => {
  const { productId }= req.params;
  Product.findByPk(productId)
  // Product.findAll({ where: { id: productId}})
    .then((product) => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product,
      });
    })
    .catch(console.err);
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      console.log(rows);
      console.log(rows.meta);
      res.render('shop/index', {
        products: rows,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(console.err);
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      // console.log(cart);
      return cart.getProducts();
    }).then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products
      });
    })
    .catch(console.err);
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } })
    })
    .then(([product]) => {
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(console.err);
}

exports.postCartDeleteItem = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId }});
    })
    .then(([product]) => {
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(console.err);
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
}
