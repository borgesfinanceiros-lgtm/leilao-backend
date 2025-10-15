// src/frontend/client/src/services/auctionService.js - Serviço de API Pública

import api from './api';

const AUCTION_ENDPOINT = '/auctions'; // Rotas públicas: /api/v1/auctions

/**
 * [PUBLIC] Busca a lista de leilões (ativos e futuros).
 * Pode incluir filtros como status, categoria, etc.
 */
export const getActiveAuctions = async (filters = {}) => {
    try {
        // GET /api/v1/auctions?status=ativo
        const response = await api.get(AUCTION_ENDPOINT, { params: filters });
        return response.data.data; // Lista de leilões
    } catch (error) {
        console.error('Erro ao buscar leilões ativos:', error);
        throw new Error('Não foi possível carregar os leilões disponíveis.');
    }
};

/**
 * [PUBLIC] Busca os detalhes de um leilão específico pelo ID.
 */
export const getAuctionDetails = async (auctionId) => {
    try {
        // GET /api/v1/auctions/:id
        const response = await api.get(`${AUCTION_ENDPOINT}/${auctionId}`);
        return response.data.data; // Dados detalhados do leilão
    } catch (error) {
        console.error(`Erro ao buscar detalhes do leilão ${auctionId}:`, error);
        throw new Error('Leilão não encontrado ou indisponível.');
    }
};

// Futuramente, este módulo também terá as funções de dar lance
// (que usarão o Socket.IO ou uma rota POST/bids, mas vamos focar
// no Socket.IO para o tempo real).