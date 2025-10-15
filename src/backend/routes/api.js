// src/backend/routes/api.js (AJUSTADO)

const express = require('express');
const router = express.Router();

// --- Importar Controllers e Middlewares ---
const UserController = require('../controllers/userController'); 
const kycClientController = require('../controllers/kycClientController'); 
const auctionController = require('../controllers/auctionController'); // NOVO
const authMiddleware = require('../middlewares/authMiddleware'); 
const uploadKYC = require('../middlewares/uploadMiddleware'); 
const bidController = require('../controllers/bidController'); // Lógica de Lances


// =======================================================
// ROTAS PÚBLICAS (NÃO REQUEREM LOGIN)
// =======================================================

// Autenticação
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Catálogo de Leilões
router.get('/auctions', auctionController.getActiveAuctions); // Rota para a Página Inicial
router.get('/auctions/:id', auctionController.getAuctionDetails); // Detalhes do Leilão
router.get('/lots/:loteId/bids', bidController.getLotBids); // Histórico de Lances do Lote


// =======================================================
// ROTAS PROTEGIDAS (REQUEREM LOGIN DO CLIENTE)
// =======================================================

router.use(authMiddleware.requireUserAuth); // Tudo abaixo disso exige login de cliente

// Perfil/Usuário
router.get('/profile', UserController.getProfile); 

// Habilitação (KYC)
router.get('/kyc/status', kycClientController.getHabilitationStatus);
router.post('/kyc/upload', uploadKYC.single('documento'), kycClientController.uploadDocuments); 

// Lances
router.post('/bids', bidController.placeBid); // Fazer um novo lance



module.exports = router;
