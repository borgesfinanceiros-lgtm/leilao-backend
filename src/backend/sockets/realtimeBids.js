// src/backend/sockets/realtimeBids.js

let io;

/** Inicializa o servidor Socket.IO */
const initSocketServer = (server) => {
    io = require('socket.io')(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:8080", 
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] Novo cliente conectado: ${socket.id}`);

        socket.on('joinAuction', (auctionId) => {
            socket.join(`auction:${auctionId}`);
            console.log(`[Socket] Cliente ${socket.id} entrou na sala do leilão ${auctionId}`);
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] Cliente desconectado: ${socket.id}`);
        });
    });
    
    console.log('✅ Servidor Socket.IO inicializado.');
    return io;
};

/** Envia uma notificação de novo lance para todos os usuários na sala do leilão. */
const notifyNewBid = (auctionId, bidData) => {
    if (!io) {
        console.error('Socket.IO não inicializado. Não foi possível notificar.');
        return;
    }
    
    io.to(`auction:${auctionId}`).emit('newBid', bidData);
};

module.exports = {
    initSocketServer,
    notifyNewBid
};