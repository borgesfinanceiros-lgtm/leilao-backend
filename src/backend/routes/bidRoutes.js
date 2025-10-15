// src/backend/routes/bidRoutes.js

const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const { requireUserAuth } = require('../middlewares/authMiddleware'); // Middleware de proteção pública

// Rota para submeter um novo lance (Requer que o usuário esteja logado)
router.post('/place', requireUserAuth, bidController.placeBid);

// Rota para obter o histórico de lances de um leilão
router.get('/:auctionId', bidController.getBidsByAuction); 

module.exports = router;