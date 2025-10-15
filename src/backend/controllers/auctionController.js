// src/backend/controllers/auctionController.js

const AuctionModel = require('../models/Auction');
const LotModel = require('../models/Lot');
const BidModel = require('../models/Bid');

/**
 * [PÚBLICO] Lista todos os leilões ativos para a página inicial/listagem.
 * Esta rota deve retornar apenas os dados essenciais para o cartão do leilão.
 */
const getActiveAuctions = async (req, res) => {
    try {
        // Busca todos os leilões com status 'ativo'
        const activeAuctions = await AuctionModel.findAllActive();
        
        // Se a página inicial precisa exibir lotes (e não apenas o leilão pai),
        // precisaríamos de uma query mais complexa ou de um loop.
        
        return res.json({ success: true, data: activeAuctions });

    } catch (error) {
        console.error('Erro ao buscar leilões ativos:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar leilões.' });
    }
};

/**
 * [PÚBLICO] Busca os detalhes de um Leilão e todos os seus Lotes associados.
 * Usado na página de detalhes de um leilão.
 */
const getAuctionDetails = async (req, res) => {
    const { id } = req.params;

    try {
        // Usa a função do AuctionModel que junta Leilão e Lotes
        const auctionDetails = await AuctionModel.findByIdWithLots(id); 

        if (!auctionDetails) {
            return res.status(404).json({ message: 'Leilão não encontrado.' });
        }
        
        // Opcional: Para cada lote, buscar o lance mais alto (se for necessário)
        for (const lot of auctionDetails.lotes) {
            const highestBid = await BidModel.findHighestBid(lot.id);
            lot.current_bid = highestBid ? highestBid.valor_lance : lot.lance_inicial;
            lot.bid_count = (await BidModel.findAllByLot(lot.id)).length; 
        }

        return res.json({ success: true, data: auctionDetails });

    } catch (error) {
        console.error(`Erro ao buscar detalhes do leilão ${id}:`, error);
        return res.status(500).json({ message: 'Erro interno ao buscar detalhes.' });
    }
};


module.exports = {
    getActiveAuctions,
    getAuctionDetails,
};