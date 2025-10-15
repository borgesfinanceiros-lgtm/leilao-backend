// src/frontend/admin/src/services/api.js

import axios from 'axios';

// Configuração base do Axios. 
// A baseURL aponta para o endpoint do Admin no seu backend Node.js.
const api = axios.create({
    baseURL: '/api/v1/admin',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar o token JWT automaticamente
api.interceptors.request.use(
    (config) => {
        // Obtém o token do armazenamento local (localStorage)
        const token = localStorage.getItem('adminToken'); 

        if (token) {
            // Se o token existe, adiciona-o ao cabeçalho Authorization
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
            // Se o token for inválido/expirado, desloga o usuário
            localStorage.removeItem('adminToken');
            // Redireciona para a página de login (necessário implementar no Router)
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;