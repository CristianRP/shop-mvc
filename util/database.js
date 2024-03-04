const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost', // process.env.DB_HOST,
  user: 'shop',// process.env.DB_USER,
  database: 'dev_shop',
  password: 'mdbroot',
  connectionLimit: 5
});

module.exports = pool;
