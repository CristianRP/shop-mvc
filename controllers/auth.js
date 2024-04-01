const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const { createTransport } = require('nodemailer')
const postMarkTransport = require('nodemailer-postmark-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transport = createTransport(postMarkTransport({
  auth: {
    apiKey: 'API_KEY'
  }
}));

const mail = {
  from: 'cristian.ramirez@mayan-tech.com',
  to: 'cristian.ramirez@mayan-tech.com',
  subject: 'Hello from NodeJS',
  text: 'Hello',
  html: '<h1>Hello from NodeJS</h1>'
}

exports.getLogin = (req, res, next) => {
  console.log(req.session);
  console.log(req.session.isLoggedIn);
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  console.log(message);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {},
    validationErrors: []
  });
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("errors", errors.array());
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array()
    });
  }
  let userFound;
  User.findOne({ email })
    .then(user => {
      userFound = user;
      if (!user) {
        throw new Error('No User Found');
      }

      return bcrypt.compare(password, user.password);
    })
    .then(doMatch => {
      console.log('match', doMatch);
      if (doMatch) {
        req.session.user = userFound;
        req.session.isLoggedIn = true;
        return req.session.save();
      }
      throw new Error('User not valid');
    })
    .then(() => {
      console.log('pass here?');
      res.redirect('/');
    })
    .catch(error => {
      // req.flash('error', 'Invalid email or password.');
      // console.error("ERROR=>", error);
      // res.redirect('/login');
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0]?.msg || error.message,
        oldInput: { email, password },
        validationErrors: errors.array()
      });
    });
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error')[0],
    oldInput: {},
    validationErrors: []
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const newUser = new User({
        email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return newUser.save();
    })
    .then(() => {
      return transport.sendMail(mail);
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch(error => {
      // req.flash('error', error.message);
      res.redirect('/signup');
    });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect('/login');
  });
}

exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('error')[0]
  })
}

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        console.log(token, user);
        if (!user) {
          throw new Error('No account with that email found');
        }
        
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360_000_0;
        return user.save();
      })
      .then(() => {
        transport.sendMail({
          ...mail,
          subject: 'Password Reset',
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        });
        res.redirect('/');
      })
      .catch(error => {
        req.flash('error', error.message);
        res.redirect('/reset');
      });
  });
}

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        throw new Error('Token is not valid');
      }

      console.log(user);
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: req.flash('error')[0],
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(error => {
      req.flash('error', error.message);
      res.redirect('/reset');
    });
}

exports.postNewPassword = (req, res, next) => {
  const { userId, passwordToken,  password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    console.log('pato', password, confirmPassword);
    req.flash('error', 'Passwords doesn\'t match');
    return res.redirect(`/reset/${passwordToken}`);
  }

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      return User.findOneAndUpdate({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() }
      }, { password: hashedPassword, resetToken: null, resetTokenExpiration: undefined })
        .then(() => {
          req.flash('success', 'Password changed');
          res.redirect('/products');
        });
    })
    .catch(error => {
      console.error(error);
      res.redirect('/');
    });
}
