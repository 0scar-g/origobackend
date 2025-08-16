// backend/config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // cambia si tienes otro usuario
  password: 'IDAT2206', // cambia si tienes contraseña
  database: 'db_origopetfood', // asegúrate de haberla creado
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
