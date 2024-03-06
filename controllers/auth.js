const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  console.log(req.session);
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn
  });
}

exports.postLogin = (req, res, next) => {
  User.findById('65e75b975521cfe3e3be916d')
    .then(user => {
      if (!user) {
        console.log('no user');
        throw new Error('No User Found');
      }

      req.session.user = user;
      req.session.isLoggedIn = true;
      return req.session.save();
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(error => {
      console.error(error);
      res.redirect('/login');
    });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log(error);
    res.redirect('/login');
  });
}
