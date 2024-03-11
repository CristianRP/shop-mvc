const path = require('path');
const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.use(isAuth);

router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
  ],
  adminController.postAddProduct
);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post(
  '/edit-product', 
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
  ],
  adminController.postEditProduct
);

router.post('/product/:productId', adminController.deleteProduct);

module.exports = router;
