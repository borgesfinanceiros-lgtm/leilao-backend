// src/backend/models/Payment.js

const db = require('../../../database/db.js'); 

class Payment {
    
    /** Registra uma nova transação. */
    static async create(paymentData) {
        // paymentData deve ter: lote_id, cliente_id, valor_total, comissao_leiloeiro, etc.
        const query = 'INSERT INTO Pagamentos SET ?';
        const [result] = await db.query(query, [paymentData]);
        return result.insertId;
    }

    /** Atualiza o status de uma transação. */
    static async updateStatus(paymentId, newStatus, transactionDetails = {}) {
        const query = 'UPDATE Pagamentos SET status_pagamento = ?, detalhes_transacao = JSON_MERGE_PATCH(detalhes_transacao, ?), data_pagamento = NOW() WHERE id = ?';
        const [result] = await db.query(query, [
            newStatus, 
            JSON.stringify(transactionDetails), 
            paymentId
        ]);
        return result.affectedRows > 0;
    }

    /** Busca o histórico de pagamentos de um cliente. */
    static async findByClientId(clientId) {
        // Usando as tabelas Pagamentos e Lotes
        const query = `
            SELECT 
                P.valor_total, 
                P.status_pagamento, 
                P.data_pagamento, 
                L.titulo AS lote_titulo
            FROM Pagamentos P
            JOIN Lotes L ON P.lote_id = L.id -- Ajustado para Lotes e lote_id
            WHERE P.cliente_id = ? -- Ajustado para cliente_id
            ORDER BY P.data_pagamento DESC
        `;
        const [rows] = await db.query(query, [clientId]);
        return rows;
    }

    /** Busca um pagamento pelo ID. */
    static async findById(id) {
        const query = 'SELECT * FROM Pagamentos WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }
}

module.exports = Payment;