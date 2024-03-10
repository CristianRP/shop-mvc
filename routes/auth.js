const { Router } = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const router = Router();

const User = require('../models/user');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    check(
      'email',
      'Email is not valid'
      )
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(user => {
            if (!user) {
              return Promise.reject('No user found');
            }
            return true;
          });
      })
      .normalizeEmail(),
    body('password')
      .isLength({ min: 3 })
      .withMessage('Password has to be at least 5 characters')
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email').isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(user => {
            if (user) {
              return Promise.reject('User alredy exists from validator.');
              // throw new Error('User alredy exists.')
            }
          });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and texts and at least 5 characters.' // omits the .withMessage
    ).notEmpty()
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match');
        }
        return true;
      })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getResetPassword);

router.post('/reset', authController.postResetPassword);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
