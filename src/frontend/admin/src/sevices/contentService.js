// src/frontend/admin/src/services/contentService.js

import api from './api';

const CONTENT_ENDPOINT = '/content'; // Rotas do Admin: /api/v1/admin/content

/**
 * [ADMIN] Busca todas as páginas de conteúdo (lista de slugs e títulos).
 */
export const getAllContent = async () => {
    try {
        // GET /api/v1/admin/content
        const response = await api.get(CONTENT_ENDPOINT);
        return response.data.data; 
    } catch (error) {
        console.error('Erro ao buscar lista de conteúdo:', error);
        throw new Error('Não foi possível carregar o conteúdo para gestão.');
    }
};

/**
 * [ADMIN] Busca o conteúdo detalhado de uma página pelo ID para edição.
 * Nota: O backend retorna os detalhes se passarmos o slug/id na rota.
 * * Como as rotas de GET e POST são as mesmas no backend para o Admin,
 * faremos o GET para edição via API:
 * GET /api/v1/admin/content?slug=termos-de-uso
 *
 * *No entanto, para simplificar e seguir a rota que criamos no Admin,
 * *usaremos o POST/PUT para salvar e a lista para obter o conteúdo*
 * *para esta primeira iteração.*
 */


/**
 * [ADMIN] Cria ou atualiza uma página de conteúdo.
 * Usa a mesma rota POST para criar e atualizar no backend (upsert).
 * @param {object} contentData - Dados do conteúdo (slug, titulo, conteudo, is_publico)
 */
export const saveContent = async (contentData) => {
    try {
        // POST /api/v1/admin/content
        const response = await api.post(CONTENT_ENDPOINT, contentData);
        return response.data; // { success: true, message: ... }
    } catch (error) {
        console.error('Erro ao salvar conteúdo:', error);
        const message = error.response?.data?.message || 'Falha ao salvar o conteúdo.';
        throw new Error(message);
    }
};