// src/backend/models/Content.js

const db = require('../../../database/db.js'); 

class Content {
    
    /** Busca uma página pelo seu 'slug' (público). */
    static async findBySlug(slug) {
        const query = 'SELECT titulo, conteudo, data_atualizacao FROM Conteudo WHERE slug = ? AND is_publico = TRUE';
        const [rows] = await db.query(query, [slug]);
        return rows[0];
    }
    
    /** [ADMIN] Cria ou atualiza uma página de conteúdo. */
    static async upsert(contentData) {
        // Tenta atualizar
        const updateQuery = 'UPDATE Conteudo SET titulo = ?, conteudo = ?, is_publico = ? WHERE slug = ?';
        const [updateResult] = await db.query(updateQuery, [
            contentData.titulo,
            contentData.conteudo,
            contentData.is_publico || false,
            contentData.slug
        ]);

        if (updateResult.affectedRows > 0) {
            return { id: contentData.slug, updated: true };
        }

        // Se não atualizou, insere
        const insertQuery = 'INSERT INTO Conteudo SET ?';
        const [insertResult] = await db.query(insertQuery, contentData);
        
        return { id: insertResult.insertId, updated: false };
    }

    /** [ADMIN] Lista todo o conteúdo para a gestão. */
    static async findAllForAdmin() {
        const query = 'SELECT id, slug, titulo, is_publico, data_atualizacao FROM Conteudo ORDER BY titulo';
        const [rows] = await db.query(query);
        return rows;
    }
}

module.exports = Content;