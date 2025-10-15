// src/backend/controllers/kycClientController.js

const KYCModel = require('../models/KYC');
const ClientModel = require('../models/Client'); // Para buscar status

/** [CLIENTE] Rota para upload de documentos de habilitação. */
const uploadDocuments = async (req, res) => {
    // req.file é preenchido pelo middleware de Multer (uploadMiddleware.js)
    const { tipo_documento } = req.body; 
    const clientId = req.client.id; 
    
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    if (!tipo_documento || !['rg_cnh', 'comprovante_residencia', 'outros'].includes(tipo_documento)) {
         // O arquivo foi salvo, mas o tipo está incorreto. Isso exigiria limpeza de arquivo.
         // Para simplificar, vamos retornar o erro.
        return res.status(400).json({ message: 'Tipo de documento inválido ou faltando.' });
    }

    try {
        const kycData = {
            cliente_id: clientId,
            tipo_documento: tipo_documento,
            caminho_arquivo: req.file.path, // Salva o caminho do arquivo no DB
            status: 'pendente' // Novo upload sempre vai para pendente
        };

        await KYCModel.create(kycData);

        return res.status(200).json({ success: true, message: 'Documento enviado com sucesso! Aguardando aprovação do administrador.' });

    } catch (error) {
        console.error('Erro ao registrar documento KYC:', error);
        return res.status(500).json({ message: 'Erro interno ao salvar documento.' });
    }
};

/** [CLIENTE] Busca o status atual da habilitação do cliente. */
const getHabilitationStatus = async (req, res) => {
    const clientId = req.client.id; 
    
    try {
        const status = await ClientModel.getHabilitationStatus(clientId);
        return res.json({ success: true, status: status });
    } catch (error) {
        console.error('Erro ao buscar status de habilitação:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar status.' });
    }
};

module.exports = {
    uploadDocuments,
    getHabilitationStatus
};