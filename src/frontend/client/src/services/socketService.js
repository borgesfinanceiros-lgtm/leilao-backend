// src/frontend/client/src/services/socketService.js

import { io } from 'socket.io-client';

// A instância do socket.
// NOTA: No ambiente de desenvolvimento, o cliente React se conecta ao mesmo host
// que está servindo o Node.js/Express, onde o Socket.IO está rodando.
let socket = null;

/**
 * Conecta o cliente ao servidor Socket.IO.
 * O token JWT do usuário é enviado no handshake para autenticação no backend.
 */
export const connectSocket = () => {
    // Busca o token do localStorage
    const token = localStorage.getItem('userToken'); 

    if (!token) {
        console.warn("Nenhum token encontrado. Conectando o socket sem autenticação.");
    }
    
    // Configura a conexão, enviando o token no extraHeaders (transport)
    socket = io({
        extraHeaders: {
            Authorization: `Bearer ${token}`,
        },
        // O caminho '/socket.io' é o default, mas pode ser configurado.
    });

    socket.on('connect', () => {
        console.log('Socket conectado com sucesso:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket desconectado:', reason);
    });
    
    socket.on('connect_error', (error) => {
        console.error('Erro de conexão do Socket:', error.message);
    });

    return socket;
};

/**
 * Desconecta a instância do socket.
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('Socket desconectado e instância removida.');
    }
};

/**
 * Inscreve o cliente nos eventos de um leilão específico.
 * @param {string | number} auctionId - ID do leilão a ser subscrito.
 * @param {function} updateHandler - Função callback para lidar com as atualizações (novo lance, etc.).
 */
export const subscribeToAuction = (auctionId, updateHandler) => {
    if (!socket) {
        console.error("Socket não conectado.");
        return;
    }

    // 1. Envia o evento JOIN para entrar na "sala" do leilão no servidor.
    socket.emit('joinAuction', auctionId);
    
    // 2. Escuta o evento de atualização do leilão.
    // O backend emitirá 'auctionUpdate' para todos na sala quando um lance for dado.
    socket.on('auctionUpdate', (data) => {
        console.log('Dados do leilão atualizados (Socket):', data);
        updateHandler(data);
    });
};

/**
 * Remove a subscrição de um leilão específico.
 * Deve ser chamado ao desmontar o componente.
 */
export const unsubscribeFromAuction = (auctionId) => {
    if (socket) {
        socket.emit('leaveAuction', auctionId);
        socket.off('auctionUpdate'); // Remove o listener
    }
};


/**
 * Envia um novo lance para o leilão.
 * @param {string | number} auctionId - ID do leilão.
 * @param {number} amount - O valor do lance.
 * @param {function} callback - Função para lidar com a resposta do servidor (sucesso/erro).
 */
export const sendBid = (auctionId, amount, callback) => {
    if (!socket || !socket.connected) {
        callback({ success: false, message: 'Conexão perdida. Tente novamente.' });
        return;
    }
    
    // Envia o evento 'submitBid' para o backend
    socket.emit('submitBid', { auctionId, amount }, (response) => {
        // O callback é a confirmação (acknowledgment) do servidor.
        callback(response);
    });
};