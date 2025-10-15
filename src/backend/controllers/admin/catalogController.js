// src/backend/controllers/admin/catalogController.js

const AuctionModel = require('../../models/Auction');

/** [ADMIN] Cria um novo leilão. */
const createAuction = async (req, res) => {
    const { titulo, descricao, data_inicio, data_fim, lance_inicial, comissao_leiloeiro } = req.body;

    if (!titulo || !data_inicio || !data_fim || !lance_inicial) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    try {
        const newAuctionData = {
            titulo,
            descricao,
            data_inicio: new Date(data_inicio),
            data_fim: new Date(data_fim),
            lance_inicial,
            comissao_leiloeiro: comissao_leiloeiro || 0,
            status: 'futuro',
            administrador_id: req.admin.id // ID do admin logado via middleware
        };

        const newId = await AuctionModel.create(newAuctionData);
        
        return res.status(201).json({ success: true, message: 'Leilão criado com sucesso!', auctionId: newId });

    } catch (error) {
        console.error('Erro ao criar novo leilão:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao tentar criar o leilão.' });
    }
};

/** [ADMIN] Atualiza os dados de um leilão existente. */
const updateAuction = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    delete updateData.id; 

    try {
        const success = await AuctionModel.update(id, updateData);

        if (!success) {
            return res.status(404).json({ message: `Leilão com ID ${id} não encontrado.` });
        }

        return res.json({ success: true, message: 'Leilão atualizado com sucesso.' });

    } catch (error) {
        console.error(`Erro ao atualizar leilão ${id}:`, error);
        return res.status(500).json({ message: 'Erro interno do servidor ao atualizar o leilão.' });
    }
};

/** [ADMIN] Lista todos os leilões para o painel de gestão. */
const getAllAuctions = async (req, res) => {
    try {
        const allAuctions = await AuctionModel.findAll(); 
        return res.json({ success: true, data: allAuctions });
    } catch (error) {
        console.error('Erro ao listar todos os leilões para o Admin:', error);
        return res.status(500).json({ message: 'Erro ao buscar lista de leilões.' });
    }
};

module.exports = {
    createAuction,
    updateAuction,
    getAllAuctions
};