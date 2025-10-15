// src/backend/models/Notification.js

const db = require('../../../database/db.js');

class Notification {
    
    /** Cria uma nova notificação. Chamado pelo NotificationService. */
    static async create(notificationData) {
        // notificationData deve conter: cliente_id, mensagem, link (opcional)
        const query = 'INSERT INTO Notificacoes SET ?';
        const [result] = await db.query(query, [notificationData]);
        return result.insertId;
    }

    /** Busca todas as notificações de um cliente (lidas ou não). */
    static async findAllByClient(clienteId) {
        const query = `
            SELECT id, mensagem, link, lida, data_notificacao
            FROM Notificacoes
            WHERE cliente_id = ?
            ORDER BY data_notificacao DESC
        `;
        const [rows] = await db.query(query, [clienteId]);
        return rows;
    }
    
    /** Busca o número de notificações não lidas para exibição no front-end. */
    static async countUnread(clienteId) {
        const query = 'SELECT COUNT(id) AS unread_count FROM Notificacoes WHERE cliente_id = ? AND lida = FALSE';
        const [rows] = await db.query(query, [clienteId]);
        return rows[0].unread_count;
    }

    /** Marca uma ou todas as notificações como lidas. */
    static async markAsRead(notificationId = null, clienteId) {
        let query;
        let params;
        
        if (notificationId) {
            // Marcar uma notificação específica
            query = 'UPDATE Notificacoes SET lida = TRUE WHERE id = ? AND cliente_id = ?';
            params = [notificationId, clienteId];
        } else {
            // Marcar todas como lidas
            query = 'UPDATE Notificacoes SET lida = TRUE WHERE cliente_id = ? AND lida = FALSE';
            params = [clienteId];
        }

        const [result] = await db.query(query, params);
        return result.affectedRows > 0;
    }
}

module.exports = Notification;