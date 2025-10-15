// src/backend/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../../config/auth.js');

// Middleware para verificar se o token do usuário é válido (usuário público)
const requireUserAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Necessita de login.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        
        if (decoded.role && decoded.role !== 'user') {
             // Aceita usuários sem 'role' definido (assume user) ou com role 'user'
             // Bloqueia se for explicitamente 'admin' ou 'superadmin'
             if (decoded.role.includes('admin')) { 
                return res.status(403).json({ message: 'Acesso negado. Administrador deve usar o painel correto.' });
             }
        }
        
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role || 'user' };
        
        next();

    } catch (error) {
        console.error('Erro na autenticação de usuário:', error.message);
        return res.status(401).json({ message: 'Sessão expirada ou token inválido. Faça login novamente.' });
    }
};

module.exports = { requireUserAuth };