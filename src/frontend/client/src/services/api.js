// src/frontend/client/src/services/api.js - API Pública (Licitantes)

import axios from 'axios';

// A baseURL aponta para o endpoint público da API no seu backend Node.js.
const api = axios.create({
    baseURL: '/api/v1', 
    headers: {
        'Content-Type': 'application/json',
    },
});

const AUTH_STORAGE_KEY = 'userToken';

// Interceptor para adicionar o token JWT do USUÁRIO
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(AUTH_STORAGE_KEY); 

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para lidar com erros de autenticação (401/403)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Se o token do usuário for inválido/expirado, desloga e redireciona.
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem('userProfile');
            // Redirecionamento (Será implementado no Router)
        }
        return Promise.reject(error);
    }
);

export default api;