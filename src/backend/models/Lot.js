// src/backend/models/Lot.js

const db = require('../../../database/db.js');

class Lot {
    
    /** Cria um novo lote. Usado pelo Admin. */
    static async create(lotData) {
        const query = 'INSERT INTO Lotes SET ?';
        const [result] = await db.query(query, [lotData]);
        return result.insertId;
    }

    /** Busca um lote pelo ID, juntando dados do leilão pai. */
    static async findById(id) {
        const query = `
            SELECT 
                L.*, 
                LE.titulo AS leilao_titulo,
                LE.data_inicio AS leilao_data_inicio,
                LE.data_fim AS leilao_data_fim
            FROM Lotes L
            JOIN Leiloes LE ON L.leilao_id = LE.id
            WHERE L.id = ?
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    /** Busca todos os lotes de um leilão específico. */
    static async findAllByAuction(leilaoId) {
        const query = `
            SELECT * FROM Lotes 
            WHERE leilao_id = ? 
            ORDER BY id ASC
        `;
        const [rows] = await db.query(query, [leilaoId]);
        return rows;
    }

    /** Atualiza o valor de arremate de um lote após a conclusão do leilão. */
    static async setArremateValue(loteId, valorArremate) {
        const query = 'UPDATE Lotes SET valor_arremate = ? WHERE id = ?';
        const [result] = await db.query(query, [valorArremate, loteId]);
        return result.affectedRows > 0;
    }
}

module.exports = Lot;