// server.js - Ponto de entrada do Backend

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config(); // Carrega as variáveis do .env
const { initSocketServer } = require('./src/backend/sockets/realtimeBids');
const { initScheduler } = require('./src/backend/services/schedulerService.js');

// Importar Rotas
const adminRoutes = require('./src/backend/routes/adminRoutes.js'); 
const apiRoutes = require('./src/backend/routes/api'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON (Body Parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API (API V1)
app.use('/api/v1/admin', adminRoutes); // Rotas Protegidas do Admin
app.use('/api/v1', apiRoutes); // Rotas Públicas

// Rota padrão para servir o Frontend SPA
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});


// Iniciar Servidor
const server = app.listen(PORT, () => { 
    console.log(`🚀 Servidor Node.js rodando na porta ${PORT}`);
    
    // Inicializa o Servidor de Socket.IO
    initSocketServer(server);
    
    // Inicializa o Agendador de Leilões
    initScheduler();
});