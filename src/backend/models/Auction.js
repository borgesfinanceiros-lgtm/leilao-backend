// src/backend/models/Auction.js

const db = require('../../../database/db.js'); 
const Lot = require('./Lot.js'); // GARANTIR QUE Lot.js FOI CRIADO

class Auction {
    
    /** Busca todos os leilões para a gestão do Admin. */
    static async findAll() {
        const query = 'SELECT * FROM Leiloes ORDER BY data_inicio DESC';
        const [rows] = await db.query(query);
        return rows;
    }
    
    /** Busca todos os leilões ativos para o público. */
    static async findAllActive() {
        const query = 'SELECT * FROM Leiloes WHERE status = ? ORDER BY data_fim ASC';
        const [rows] = await db.query(query, ['ativo']);
        return rows;
    }

    /** Busca um leilão pelo ID e anexa todos os seus Lotes. */
    static async findByIdWithLots(id) {
        // 1. Busca o Leilão
        const auctionQuery = 'SELECT * FROM Leiloes WHERE id = ?';
        const [auctionRows] = await db.query(auctionQuery, [id]);
        const auction = auctionRows[0];

        if (!auction) {
            return null;
        }
        
        // 2. Busca todos os Lotes relacionados
        const lots = await Lot.findAllByAuction(id);

        // 3. Junta tudo
        auction.lotes = lots;
        return auction;
    }
    
    // ATENÇÃO: Se você usa o findById em algum lugar, ele deve buscar o leilão, 
    // mas sugiro usar o findByIdWithLots na maioria dos casos.
    static async findById(id) {
        const query = 'SELECT * FROM Leiloes WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }
    
    /** Cria um novo leilão (usado pelo Admin). */
    static async create(auctionData) {
        const query = 'INSERT INTO Leiloes SET ?';
        const [result] = await db.query(query, [auctionData]);
        return result.insertId;
    }

    /** Atualiza um leilão (usado pelo Admin). */
    static async update(id, auctionData) {
        const query = 'UPDATE Leiloes SET ? WHERE id = ?';
        const [result] = await db.query(query, [auctionData, id]);
        return result.affectedRows > 0;
    }

    /** Propriedade para acessar o módulo de conexão (usado no Scheduler). */
    static get db() {
        return db;
    }
}

module.exports = Auction;