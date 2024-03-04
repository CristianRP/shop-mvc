const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dev_shop', 'shop', 'mdbroot', {
  dialect: 'mariadb', host: 'localhost'
});

module.exports = sequelize;
