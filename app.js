const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('65e75b975521cfe3e3be916d')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(console.error);
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

connect('mongodb+srv://cristianramirezgt:291fWV8RTsNeQPtc@clusternodejs.u8wma2f.mongodb.net/shop?retryWrites=true&w=majority&appName=ClusterNodeJS')
  .then(result => {
    return User.findOne().then(user => {
      if (!user) {
        const newUser = new User({
          name: 'Cristian',
          email: 'cristian@email.com',
          cart: {
            items: []
          }
        });
        return newUser.save();
      }
      return user;
    });
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(console.error);