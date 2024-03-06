const Order = require('../models/order');
const Product = require('../models/product');

exports.getProducts =  (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(console.log);
};

exports.getProduct = (req, res, next) => {
  const { productId }= req.params;
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(console.error);
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(console.error);
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(({ cart }) => {
      console.log(cart.items);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cart.items,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(console.error);
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(console.error);
}

exports.postCartDeleteItem = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .removeFromCart(productId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(console.error);
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    isAuthenticated: req.session.isLoggedIn
  });
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.session.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(console.error);
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(({ cart }) => {
      const products = cart.items.map(item => {
        return { quantity: item.quantity, product: { ...item.productId._doc } }
      });
      const order = new Order({
        user: {
          name: req.session.user.name,
          userId: req.session.user
        },
        products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(console.error);
}
