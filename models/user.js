const { INTEGER, STRING } = require('sequelize')

const sequelize = require('../util/database');

const User = sequelize.define('users', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: STRING,
  email: {
    type: STRING,
    allowNull: false
  }
});

module.exports = User;
