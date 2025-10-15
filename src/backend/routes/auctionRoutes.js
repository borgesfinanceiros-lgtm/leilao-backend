// src/backend/routes/auctionRoutes.js

const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');

// Rota para listar todos os leilões ativos na home page
router.get('/active', auctionController.getActiveAuctions);

// Rota para obter os detalhes de um leilão específico (ID)
router.get('/:id', auctionController.getAuctionDetail);

module.exports = router;