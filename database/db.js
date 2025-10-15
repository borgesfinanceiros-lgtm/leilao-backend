// database/db.js

const mysql = require('mysql2');
const dbConfig = require('../config/database');

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// Exporta o pool de promises para ser usado com async/await
module.exports = promisePool;