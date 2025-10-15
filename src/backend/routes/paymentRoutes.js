// src/backend/routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireUserAuth } = require('../middlewares/authMiddleware');

// Rotas do Usuário
router.get('/history', requireUserAuth, paymentController.getPaymentHistory);
router.post('/checkout', requireUserAuth, paymentController.createCheckoutSession);

// Rota do Webhook (NÃO PROTEGIDA - Requer validação de segurança interna!)
router.post('/webhook', paymentController.handleWebhook); 

module.exports = router;