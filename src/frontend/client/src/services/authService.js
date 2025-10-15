// src/frontend/client/src/services/authService.js

import api from './api';

const AUTH_STORAGE_KEY = 'userToken';
const PROFILE_STORAGE_KEY = 'userProfile';

/**
 * [PUBLIC] Registro de novo usuário.
 */
export const register = async (nome, email, password) => {
    try {
        const response = await api.post('/users/register', { nome, email, password });
        const { token, user } = response.data;
        
        if (token) {
            localStorage.setItem(AUTH_STORAGE_KEY, token);
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(user)); 
        }
        return { success: true, user };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Falha no registro.');
    }
};

/**
 * [PUBLIC] Login de usuário.
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/users/login', { email, password });
        const { token, user } = response.data;
        
        if (token) {
            localStorage.setItem(AUTH_STORAGE_KEY, token);
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(user)); 
        }
        return { success: true, user };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Credenciais inválidas.');
    }
};

/**
 * [PROTECTED] Busca os dados do perfil do usuário logado.
 */
export const getProfile = async () => {
    try {
        const response = await api.get('/users/profile');
        const user = response.data.user;
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(user)); 
        return user;
    } catch (error) {
        // Se falhar, o interceptor do Axios fará o logout
        return null;
    }
};

/**
 * Logout do usuário.
 */
export const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
};

/**
 * Verifica se o usuário está logado.
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem(AUTH_STORAGE_KEY);
};

/**
 * Retorna o perfil (ou null).
 */
export const getUserProfile = () => {
    const profile = localStorage.getItem(PROFILE_STORAGE_KEY);
    return profile ? JSON.parse(profile) : null;
};