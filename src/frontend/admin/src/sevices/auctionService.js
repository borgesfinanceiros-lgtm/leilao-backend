// src/frontend/admin/src/services/auctionService.js

import api from './api';

const AUCTION_ENDPOINT = '/auctions'; // Rotas do Admin: /api/v1/admin/auctions

/**
 * [ADMIN] Busca todos os leilões para o painel de gestão.
 */
export const getAllAuctions = async () => {
    try {
        const response = await api.get(AUCTION_ENDPOINT);
        return response.data.data; // Retorna a lista de leilões
    } catch (error) {
        console.error('Erro ao buscar lista de leilões:', error);
        throw new Error('Não foi possível carregar os leilões.');
    }
};

/**
 * [ADMIN] Cria um novo leilão.
 * @param {object} auctionData - Dados do novo leilão (titulo, descricao, data_inicio, etc.)
 */
export const createAuction = async (auctionData) => {
    try {
        // Envia os dados para a rota POST /api/v1/admin/auctions
        const response = await api.post(AUCTION_ENDPOINT, auctionData);
        return response.data; // { success: true, message: ..., auctionId: ... }
    } catch (error) {
        console.error('Erro ao criar leilão:', error);
        const message = error.response?.data?.message || 'Falha ao criar o leilão. Verifique os dados.';
        throw new Error(message);
    }
};

/**
 * [ADMIN] Atualiza os dados de um leilão existente.
 * @param {number} id - ID do leilão a ser atualizado.
 * @param {object} auctionData - Dados a serem atualizados.
 */
export const updateAuction = async (id, auctionData) => {
    try {
        // Envia os dados para a rota PUT /api/v1/admin/auctions/:id
        const response = await api.put(`${AUCTION_ENDPOINT}/${id}`, auctionData);
        return response.data; // { success: true, message: ... }
    } catch (error) {
        console.error(`Erro ao atualizar leilão ${id}:`, error);
        const message = error.response?.data?.message || 'Falha ao atualizar o leilão.';
        throw new Error(message);
    }
};