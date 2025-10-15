// database/seeds/initial_data.js

const db = require('../db'); // Seu módulo de conexão
const bcrypt = require('bcryptjs');
const { saltRounds } = require('../../config/auth');

async function runSeed() {
    try {
        const adminEmail = 'admin@leilao.com';
        const adminPassword = 'admin123'; // Mude esta senha imediatamente após o primeiro login!

        // 1. Gerar o hash da senha
        const senhaHash = await bcrypt.hash(adminPassword, saltRounds);

        // 2. SQL para inserir o administrador (nível superadmin)
        const sql = `
            INSERT INTO Administradores (nome, email, senha_hash, nivel_acesso)
            VALUES (?, ?, ?, ?)
        `;
        const values = ['Super Admin', adminEmail, senhaHash, 'superadmin'];

        const [result] = await db.execute(sql, values);
        
        console.log('✅ Administrador inicial criado com sucesso!');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Senha: ${adminPassword}`);
        
        return result;

    } catch (error) {
        // Ignora se o erro for de duplicidade (já existe o admin)
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('⚠️ Administrador inicial já existe no banco de dados.');
            return;
        }
        console.error('❌ Erro ao rodar o seed de Administrador:', error.message);
        throw error;
    }
}

// Em um ambiente de produção, este script seria executado via CLI
// Por enquanto, podemos executá-lo diretamente para fins de teste:
// runSeed(); 

module.exports = { runSeed };