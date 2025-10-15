// src/backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireUserAuth } = require('../middlewares/authMiddleware'); // Middleware de proteção pública

// Rota de registro
router.post('/register', userController.register);

// Rota de login
router.post('/login', userController.login);

// Rota de perfil (requer autenticação)
router.get('/profile', requireUserAuth, userController.getProfile);

module.exports = router;