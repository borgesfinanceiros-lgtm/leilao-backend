// src/backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();

// --- Importar Controllers e Middlewares ---
const adminUserController = require('../controllers/admin/adminUserController');
const kycController = require('../controllers/admin/kycController'); // Controller de Admin para KYC
const adminMiddleware = require('../middlewares/adminMiddleware'); // Verifica o token de admin


// Rota de Acesso Público
router.post('/login', adminUserController.login);


// Rotas Protegidas (Requer Autenticação de Admin)
// ----------------------------------------------------------------------
// LINHA CORRIGIDA: Agora usa 'requireAdminAuth', que é o nome correto da função
router.use(adminMiddleware.requireAdminAuth); // Tudo abaixo disso exige login de admin
// ----------------------------------------------------------------------

// Rota do Dashboard
router.get('/dashboard', adminUserController.getDashboardStats);

// Rotas de Gestão de KYC
router.get('/kyc/pending', kycController.getPendingDocuments); // Lista pendentes
router.put('/kyc/:id/status', kycController.updateDocumentStatus); // Aprova/Rejeita documento


// Outras Rotas
// router.use('/catalog', require('../controllers/admin/catalogController'));
// router.use('/content', require('../controllers/admin/contentController'));

module.exports = router;