// src/backend/models/AdminUser.js

const db = require('../../../database/db.js');

class AdminUser {

    /** Busca um administrador pelo ID. */
    static async findById(id) {
        const query = 'SELECT id, nome, email, data_criacao FROM Administradores WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    /** Busca um administrador pelo email (usado no login). */
    static async findByEmail(email) {
        const query = 'SELECT id, nome, email, senha FROM Administradores WHERE email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];
    }

    /** Cria um novo administrador (usado na inicialização ou por outro admin). */
    static async create(adminData) {
        const query = 'INSERT INTO Administradores SET ?';
        const [result] = await db.query(query, [adminData]);
        return result.insertId;
    }
}

module.exports = AdminUser;