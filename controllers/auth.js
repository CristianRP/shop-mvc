const bcrypt = require('bcryptjs');
const { createTransport } = require('nodemailer')
const postMarkTransport = require('nodemailer-postmark-transport');

const User = require('../models/user');

const transport = createTransport(postMarkTransport({
  auth: {
    apiKey: '3aa33b29-f7ea-4da7-a47b-18ec83299790'
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
    errorMessage: message
  });
}

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        throw new Error('No User Found');
      }

      return bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save();
          }
          throw new Error('User not valid');
        });
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(error => {
      req.flash('error', 'Invalid email or password.');
      console.error("ERROR=>", error);
      res.redirect('/login');
    });
}

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error')[0]
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then(user => {
      if (user) {
        throw new Error('User alredy exists.')
      }

      return bcrypt.hash(password, 12);
    })
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
      req.flash('error', error.message);
      res.redirect('/signup');
    });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect('/login');
  });
}
