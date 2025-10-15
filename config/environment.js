// config/environment.js

module.exports = {
    PORT: process.env.PORT || 3000,
    BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:8080',
    // Outras configs globais (ex: chaves de APIs externas)
};