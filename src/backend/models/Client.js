// src/backend/models/Client.js (Antigo User.js)

const db = require('../../../database/db.js');

class Client { // Renomeado de User para Client

    /** Busca um cliente pelo ID. */
    static async findById(id) {
        // Tabela Clientes
        const query = 'SELECT id, nome, email, data_cadastro FROM Clientes WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    /** Busca um cliente pelo email (usado no login). */
    static async findByEmail(email) {
        // Tabela Clientes
        const query = 'SELECT id, nome, email, senha_hash FROM Clientes WHERE email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];
    }

    /** Cria um novo cliente (registo). */
    static async create(clientData) {
        // Tabela Clientes
        const query = 'INSERT INTO Clientes SET ?';
        const [result] = await db.query(query, [clientData]);
        return result.insertId;
    }

    /** Busca o status de habilitação (KYC) de um cliente. */
    static async getHabilitationStatus(id) {
        // Assumimos que o status é o registro mais recente na tabela HabilitacaoDocumentos
        const query = `
            SELECT status 
            FROM HabilitacaoDocumentos 
            WHERE cliente_id = ? 
            ORDER BY data_upload DESC 
            LIMIT 1
        `;
        const [rows] = await db.query(query, [id]);
        // Retorna 'aprovado', 'pendente', 'rejeitado' ou 'nao_enviado'
        return rows[0] ? rows[0].status : 'nao_enviado'; 
    }
}

module.exports = Client;