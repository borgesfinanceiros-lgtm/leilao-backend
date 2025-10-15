// src/backend/models/KYC.js

const db = require('../../../database/db.js');

class KYC {
    
    /** Registra o upload de um novo documento de habilitação. */
    static async create(kycData) {
        // kycData deve conter: cliente_id, tipo_documento, caminho_arquivo
        const query = 'INSERT INTO HabilitacaoDocumentos SET ?';
        const [result] = await db.query(query, [kycData]);
        return result.insertId;
    }

    /** Busca o status atual de habilitação de um cliente. */
    static async getStatusByClient(clienteId) {
        const query = `
            SELECT status, data_upload
            FROM HabilitacaoDocumentos
            WHERE cliente_id = ?
            ORDER BY data_upload DESC
            LIMIT 1
        `;
        const [rows] = await db.query(query, [clienteId]);
        
        // Se houver documentos, retorna o status mais recente. Senão, retorna 'nao_enviado'.
        return rows[0] ? rows[0].status : 'nao_enviado';
    }

    /** [ADMIN] Lista todos os documentos pendentes de revisão. */
    static async findAllPending() {
        const query = `
            SELECT H.*, C.nome AS cliente_nome, C.email AS cliente_email
            FROM HabilitacaoDocumentos H
            JOIN Clientes C ON H.cliente_id = C.id
            WHERE H.status = 'pendente'
            ORDER BY H.data_upload ASC
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    /** [ADMIN] Atualiza o status de um documento (aprovado/rejeitado). */
    static async updateStatus(documentId, newStatus, adminId) {
        const query = `
            UPDATE HabilitacaoDocumentos 
            SET status = ?, administrador_aprovador_id = ?, data_aprovacao = NOW() 
            WHERE id = ?
        `;
        // Nota: A coluna 'data_aprovacao' não está no seu DDL, mas é uma boa prática.
        // Se a query falhar, remova 'data_aprovacao = NOW()'.
        const [result] = await db.query(query, [newStatus, adminId, documentId]);
        return result.affectedRows > 0;
    }
}

module.exports = KYC;