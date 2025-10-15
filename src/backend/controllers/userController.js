// src/backend/controllers/userController.js

// ------------------------------------------------------------------------------------------
// CORREÇÃO FINAL: Usando 'User' com U maiúsculo para coincidir com o nome do arquivo 'User.js' no GitHub.
const UserModel = require('../models/Client'); 
// ------------------------------------------------------------------------------------------

const authService = require('../services/authService'); 

/** [PUBLIC] Registra um novo usuário (licitante). */
const register = async (req, res) => {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    }

    try {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
        }

        const senhaHash = await authService.hashPassword(password);
        const newUserData = { nome, email, senha_hash: senhaHash, nivel_acesso: 'user' };
        const userId = await UserModel.create(newUserData);

        const token = authService.generateToken({ id: userId, email, role: 'user' });

        return res.status(201).json({ message: 'Registro bem-sucedido!', token, user: { id: userId, nome, email } });

    } catch (error) {
        console.error('Erro no registro de usuário:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao registrar.' });
    }
};

/** [PUBLIC] Lógica de Login do Usuário. */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isMatch = await authService.comparePassword(password, user.senha_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const token = authService.generateToken({ id: user.id, email: user.email, role: 'user' });

        return res.json({ message: 'Login bem-sucedido', token, user: { id: user.id, nome: user.nome, email: user.email } });

    } catch (error) {
        console.error('Erro no login do usuário:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/** [PROTECTED] Obtém os dados do perfil do usuário logado. */
const getProfile = async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        return res.json({ success: true, user });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
};