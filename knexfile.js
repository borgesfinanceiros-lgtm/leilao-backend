// knexfile.js

// Garantindo que as variáveis de ambiente sejam carregadas.
require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    // **Este é o caminho mais provável para suas migrações. Se a pasta for diferente,
    // como "database/migrations", ajuste o caminho abaixo.**
    migrations: {
      directory: './database/migrations' 
    }
  }
};