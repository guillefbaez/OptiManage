// Conexión hacia la base de datos
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     '127.0.0.1',    // Es el localhost
  user:     'root',         // Es el usuario de MySQL
  password: '',             // Es la contraseña (esta en blanco porque no tiene)
  database: 'optica_jireh', // Es el nombre de la base de datos
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
