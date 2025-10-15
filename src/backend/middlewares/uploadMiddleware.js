// src/backend/middlewares/uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// Configuração de Armazenamento para os Documentos de KYC
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Altera o destino para onde os documentos serão salvos
        // NOTA: Crie este diretório na raiz do projeto
        cb(null, path.join(__dirname, '..', '..', '..', 'uploads', 'kyc')); 
    },
    filename: (req, file, cb) => {
        // Nomeia o arquivo como: clienteID-timestamp-tipoDoc.extensao
        const clientId = req.client.id; // Assume que o ID do cliente está no objeto req
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${clientId}-${uniqueSuffix}${fileExtension}`);
    }
});

// Filtro para aceitar apenas imagens e PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não suportado. Use JPG, PNG ou PDF.'), false);
    }
};

const uploadKYC = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});

module.exports = uploadKYC;