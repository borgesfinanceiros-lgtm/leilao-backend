// src/backend/middlewares/adminMiddleware.js

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../../config/auth.js');

// Middleware para verificar se o usuário é um administrador logado
const requireAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
            return res.status(403).json({ message: 'Permissão negada. Usuário não é administrador.' });
        }

        req.admin = { id: decoded.id, email: decoded.email, role: decoded.role };
        
        next();

    } catch (error) {
        console.error('Erro na autenticação de administrador:', error.message);
        return res.status(401).json({ message: 'Token de autenticação inválido ou expirado.' });
    }
};

module.exports = { requireAdminAuth };