// src/frontend/client/src/services/contentService.js - Serviço de Conteúdo Público

import api from './api';

const CONTENT_ENDPOINT = '/content'; // Rotas públicas: /api/v1/content

/**
 * [PUBLIC] Busca o conteúdo de uma página estática pela sua slug (ex: 'termos-de-uso').
 */
export const getContentBySlug = async (slug) => {
    try {
        // GET /api/v1/content/:slug
        const response = await api.get(`${CONTENT_ENDPOINT}/${slug}`);
        return response.data.data; // Retorna { id, titulo, conteudo, slug, ... }
    } catch (error) {
        console.error(`Erro ao buscar conteúdo para slug: ${slug}`, error);
        throw new Error('Página de conteúdo não encontrada ou indisponível.');
    }
};