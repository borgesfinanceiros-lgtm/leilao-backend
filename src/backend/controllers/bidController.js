// src/backend/controllers/bidController.js

const BidModel = require('../models/Bid');
const LotModel = require('../models/Lot');
const ClientModel = require('../models/Client');
const { getIO } = require('../sockets/realtimeBids'); // Ponto de acesso ao Socket.IO

/**
 * [CLIENTE] Registra um novo lance para um Lote específico.
 */
const placeBid = async (req, res) => {
    // req.client.id é fornecido pelo authMiddleware.verifyClientToken
    const clientId = req.client.id; 
    const { loteId, valorLance } = req.body; 

    if (!loteId || !valorLance) {
        return res.status(400).json({ message: 'Lote ID e valor do lance são obrigatórios.' });
    }

    const bidValue = parseFloat(valorLance);
    if (isNaN(bidValue) || bidValue <= 0) {
        return res.status(400).json({ message: 'Valor do lance deve ser um número positivo.' });
    }

    try {
        // 1. Verificar Status de Habilitação (KYC)
        const habilitationStatus = await ClientModel.getHabilitationStatus(clientId);
        if (habilitationStatus !== 'aprovado') {
            return res.status(403).json({ 
                message: `Você precisa ter a habilitação (KYC) aprovada para dar lances. Status atual: ${habilitationStatus}.` 
            });
        }

        // 2. Buscar Lote e checar o status
        const lot = await LotModel.findById(loteId);
        if (!lot || lot.status !== 'ativo') {
            return res.status(404).json({ message: 'Lote não encontrado ou leilão encerrado.' });
        }

        // 3. Checar Lance Mínimo
        const nextMinBid = await BidModel.calculateNextMinBid(loteId, lot.incremento_minimo) || lot.lance_inicial;
        
        if (bidValue < nextMinBid) {
            return res.status(400).json({ 
                message: `O lance mínimo atual é R$ ${nextMinBid.toFixed(2)}.` 
            });
        }
        
        // 4. Registrar o Lance
        const bidData = {
            lote_id: loteId,
            cliente_id: clientId,
            valor_lance: bidValue,
            data_lance: new Date()
        };
        const newBidId = await BidModel.create(bidData);

        // 5. Atualizar o Valor de Venda do Lote
        await LotModel.updateSellingPrice(loteId, bidValue, clientId);

        // 6. Notificação em Tempo Real (Socket.IO)
        const io = getIO();
        if (io) {
            // Emite a atualização para todos os clientes que estão olhando o lote/leilão
            io.to(`lot_${loteId}`).emit('newBid', {
                loteId: loteId,
                bidValue: bidValue,
                clientId: clientId,
                // O frontend deve buscar o nome do cliente se precisar
                data: new Date().toISOString()
            });

            // Opcional: Notificar o antigo líder do lance que ele foi superado
            // (Essa lógica é complexa e pode ser implementada no serviço de bids)
        }

        return res.status(201).json({ 
            success: true, 
            message: 'Lance registrado com sucesso!', 
            bidId: newBidId,
            newPrice: bidValue
        });

    } catch (error) {
        console.error('Erro ao registrar lance:', error);
        return res.status(500).json({ message: 'Erro interno ao processar o lance.' });
    }
};

/**
 * [PUBLIC] Busca o histórico de lances para um Lote.
 */
const getLotBids = async (req, res) => {
    const { loteId } = req.params;
    try {
        const bids = await BidModel.findAllByLot(loteId);
        return res.json({ success: true, data: bids });
    } catch (error) {
        console.error('Erro ao buscar lances do lote:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar histórico de lances.' });
    }
};

module.exports = {
    placeBid,
    getLotBids
};