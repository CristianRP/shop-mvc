const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts =  (req, res, next) => {
  Product.fetchAll()
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
  Product.findById(productId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product,
      });
    })
    .catch(console.err);
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
