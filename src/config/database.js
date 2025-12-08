const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
  // host: 'localhost',
  // user: 'root',
  // password: '',
  // database: 'prasowla_moi_master'

});

module.exports = db;