// src/backend/controllers/admin/adminUserController.js

const authService = require('../../services/authService');

/** Lógica de Login para o Painel Administrativo */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const result = await authService.adminLogin(email, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        return res.json({ message: 'Login bem-sucedido', token: result.token, admin: result.admin });
        
    } catch (error) {
        console.error('Erro no login do administrador:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/** Retorna estatísticas iniciais (stub) */
const getDashboardStats = (req, res) => {
    return res.json({ 
        stats: { cadastros_hoje: 0, leiloes_ativos: 0, lances_totais: 0 } 
    });
};

module.exports = {
    login,
    getDashboardStats,
};