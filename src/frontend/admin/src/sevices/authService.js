// src/frontend/admin/src/services/authService.js

import api from './api';

const AUTH_STORAGE_KEY = 'adminToken';

// Lógica para fazer login e armazenar o token
export const login = async (email, password) => {
    try {
        // Chama a rota POST /api/v1/admin/login
        const response = await api.post('/login', { email, password });
        
        const { token, admin } = response.data;
        
        if (token) {
            // Armazena o token para uso em requisições futuras
            localStorage.setItem(AUTH_STORAGE_KEY, token);
            // Opcional: Armazenar dados do usuário, se necessário
            localStorage.setItem('adminUser', JSON.stringify(admin)); 
        }
        
        return { success: true, admin };
        
    } catch (error) {
        // Lida com erros 401 (Credenciais Inválidas) ou outros
        console.error('Erro de login:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Erro ao tentar logar.');
    }
};

// Remove o token para fazer logout
export const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('adminUser');
};

// Verifica se o usuário está logado
export const isAuthenticated = () => {
    return !!localStorage.getItem(AUTH_STORAGE_KEY);
};