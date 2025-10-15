// config/database.js

// Verifica se estamos em ambiente de produção (RENDER)
// Se 'process.env.NODE_ENV' for 'production' (o padrão do Render),
// ele usa as variáveis de ambiente. Caso contrário, ele usaria o modo local.

const config = {
    host: process.env.DB_HOST || 'localhost', // Se não achar a variável, usa localhost (segurança)
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

module.exports = config;