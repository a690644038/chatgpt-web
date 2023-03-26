const mysql = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
  host: '150.158.196.191',
  user: 'lanzuan',
  password: '123456',
  database: 'lanzuan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


module.exports = pool;
