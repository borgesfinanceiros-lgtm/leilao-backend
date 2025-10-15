// config/database.js

// Certifique-se de instalar 'dotenv' e criar um arquivo .env

require('dotenv').config(); // <--- AGORA DESCOMENTADO

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // O fallback para senha vazia está CORRETO
    database: process.env.DB_NAME || 'leilao_online_db',
    port: process.env.DB_PORT || 3306,
    
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

module.exports = dbConfig;