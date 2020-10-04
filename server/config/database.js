var mysql = require('mysql');

const DB_HOST = process.env.DB_HOST || 'localhost'; // Replace with your host name
const DB_USER = process.env.DB_USER || 'root'; // Replace with your database username
const DB_PASS = process.env.DB_PASS || ''; // Replace with your database password
const DB_NAME = process.env.db || 'matcha_db'; // Replace with your database Name

var conn = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  charset  : 'utf8mb4'
}); 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});

module.exports = conn;
