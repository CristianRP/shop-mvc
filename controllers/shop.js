const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts =  (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      products: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const { productId }= req.params;
  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/products',
      product,
    })
  });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (const product of products) {
        const cartProduct = cart.products.find(prod => prod.id === product.id);
        if (cartProduct) {
          cartProducts.push({ productData: product, qty: cartProduct.qty })
        }
      }

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    })
  });
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
}

exports.postCartDeleteItem = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
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
