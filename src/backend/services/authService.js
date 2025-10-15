// src/backend/services/authService.js

// Importação dos modelos que você acabou de criar/renomear
const Client = require('../models/Client'); 
const AdminUser = require('../models/AdminUser'); 

// Importação das bibliotecas de segurança (certifique-se de tê-las instaladas)
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

// Chave Secreta: DEVE ser definida em um arquivo .env na produção.
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_padrao_muito_longa_e_segura'; 

/** Cria um JWT para um usuário. */
const generateToken = (payload, expiresIn = '1d') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};


// --- LÓGICA DE LOGIN/REGISTRO DO CLIENTE ---

/** Registra um novo cliente. */
const clientRegister = async (name, email, password) => {
    try {
        const existingClient = await Client.findByEmail(email);
        if (existingClient) {
            return { success: false, message: 'Este email já está cadastrado.' };
        }

        // Hashing da senha antes de salvar
        const senhaHash = await bcrypt.hash(password, 10);
        
        const clientData = {
            nome: name,
            email: email,
            senha_hash: senhaHash // Conforme o modelo Client.js
        };

        const clientId = await Client.create(clientData);
        const token = generateToken({ id: clientId, role: 'client' });

        return { success: true, token, client: { id: clientId, nome: name, email: email } };

    } catch (error) {
        console.error('Erro no registro do cliente:', error);
        return { success: false, message: 'Erro interno no registro.' };
    }
};

/** Lógica de Login para Clientes. */
const clientLogin = async (email, password) => {
    try {
        const client = await Client.findByEmail(email);

        if (!client) {
            return { success: false, message: 'Email ou senha inválidos.' };
        }

        // Compara a senha fornecida com o hash no DB
        const isMatch = await bcrypt.compare(password, client.senha_hash);
        
        if (!isMatch) {
            return { success: false, message: 'Email ou senha inválidos.' };
        }

        const token = generateToken({ id: client.id, role: 'client' });

        return { success: true, token, client: { id: client.id, nome: client.nome, email: client.email } };

    } catch (error) {
        console.error('Erro no login do cliente:', error);
        return { success: false, message: 'Erro interno do servidor.' };
    }
};


// --- LÓGICA DE LOGIN DO ADMINISTRADOR ---

/** Lógica de Login para Administradores (Chamado pelo adminUserController.js). */
const adminLogin = async (email, password) => {
    try {
        const admin = await AdminUser.findByEmail(email);

        if (!admin) {
            return { success: false, message: 'Credenciais de Administrador inválidas.' };
        }

        // Compara a senha fornecida com a senha (hash) no DB
        const isMatch = await bcrypt.compare(password, admin.senha); 
        
        if (!isMatch) {
            return { success: false, message: 'Credenciais de Administrador inválidas.' };
        }

        const token = generateToken({ id: admin.id, role: 'admin' }, '1h'); // Token de admin com validade menor

        return { success: true, token, admin: { id: admin.id, nome: admin.nome, email: admin.email } };

    } catch (error) {
        console.error('Erro no login do administrador:', error);
        return { success: false, message: 'Erro interno do servidor.' };
    }
};

module.exports = {
    clientRegister,
    clientLogin,
    adminLogin,
    // outros
};