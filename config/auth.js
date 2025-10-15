// config/auth.js

// A chave secreta e a expiração são lidas de variáveis de ambiente
module.exports = {
    // Chave secreta usada para assinar e verificar JSON Web Tokens (JWT).
    jwtSecret: process.env.JWT_SECRET || 'uma_chave_secreta_muito_longa_e_aleatoria',
    
    // Tempo de expiração do token (Ex: '1h', '7d')
    jwtExpiration: process.env.JWT_EXPIRATION || '1d', 

    // O fator de "salting" para a criptografia bcrypt. 10 é o padrão seguro.
    saltRounds: 10, 
};