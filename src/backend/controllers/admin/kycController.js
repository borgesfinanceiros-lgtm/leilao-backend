// src/backend/controllers/admin/kycController.js

const KYCModel = require('../../models/KYC');
const NotificationService = require('../../services/notificationService'); 
// O NotificationService precisa ser criado/ajustado (próxima etapa!)

/** [ADMIN] Lista todos os documentos de habilitação pendentes de aprovação. */
const getPendingDocuments = async (req, res) => {
    try {
        const pendingDocs = await KYCModel.findAllPending();
        return res.json({ success: true, data: pendingDocs });
    } catch (error) {
        console.error('Erro ao listar documentos pendentes de KYC:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar documentos.' });
    }
};

/** [ADMIN] Aprova ou Rejeita um documento de habilitação. */
const updateDocumentStatus = async (req, res) => {
    const { id } = req.params; // ID do registro na tabela HabilitacaoDocumentos
    const { status } = req.body; // 'aprovado' ou 'rejeitado'
    const adminId = req.admin.id; // ID do administrador logado

    if (!['aprovado', 'rejeitado'].includes(status)) {
        return res.status(400).json({ message: 'Status inválido. Use "aprovado" ou "rejeitado".' });
    }

    try {
        const success = await KYCModel.updateStatus(id, status, adminId);

        if (!success) {
            return res.status(404).json({ message: `Documento de habilitação ID ${id} não encontrado.` });
        }

        // --- LÓGICA DE NOTIFICAÇÃO (CRÍTICO) ---
        // Buscamos o cliente_id a partir do registro do documento
        const doc = await KYCModel.findById(id); // Assumindo que o KYCModel tem um findById simples
        if (doc && NotificationService) {
             const message = status === 'aprovado' 
                ? 'Sua habilitação (KYC) foi APROVADA! Você já pode dar lances.' 
                : 'Sua habilitação (KYC) foi REJEITADA. Verifique seus documentos e tente novamente.';
            
            // Dispara a notificação assincronamente (não precisa esperar)
            NotificationService.createNotification(doc.cliente_id, message, '/perfil/kyc');
        }

        return res.json({ success: true, message: `Documento ${status} com sucesso!` });

    } catch (error) {
        console.error(`Erro ao atualizar status do documento ${id}:`, error);
        return res.status(500).json({ message: 'Erro interno ao atualizar status.' });
    }
};

module.exports = {
    getPendingDocuments,
    updateDocumentStatus,
};