// src/backend/models/Bid.js

const db = require('../../../database/db.js');

class Bid {

    /** Registra um novo lance. */
    static async create(bidData) {
        // bidData deve conter: lote_id, cliente_id, valor_lance, data_lance
        const query = 'INSERT INTO Lances SET ?';
        const [result] = await db.query(query, [bidData]);
        return result.insertId;
    }

    /** Busca o lance vencedor (o lance mais alto) para um Lote. */
    static async findHighestBid(loteId) { // Troca auctionId por loteId
        const query = `
            SELECT * FROM Lances 
            WHERE lote_id = ? 
            ORDER BY valor_lance DESC, data_lance ASC
            LIMIT 1
        `;
        const [rows] = await db.query(query, [loteId]);
        return rows[0];
    }

    /** Lista todos os lances para um Lote. */
    static async findAllByLot(loteId) { // Troca findAllByAuction por findAllByLot
        const query = `
            SELECT 
                L.valor_lance, 
                L.data_lance, 
                C.nome AS nome_cliente 
            FROM Lances L
            JOIN Clientes C ON L.cliente_id = C.id -- Ajustado para Cliente
            WHERE L.lote_id = ? -- Ajustado para lote_id
            ORDER BY L.valor_lance DESC
        `;
        const [rows] = await db.query(query, [loteId]);
        return rows;
    }

    /** Calcula o lance mínimo atual. */
    static async calculateNextMinBid(loteId, minIncrement) { // Troca auctionId por loteId
        const highestBid = await this.findHighestBid(loteId);
        
        if (!highestBid) {
            return null;
        }
        return parseFloat(highestBid.valor_lance) + parseFloat(minIncrement);
    }
}

module.exports = Bid;