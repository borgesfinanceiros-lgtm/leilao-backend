// src/backend/services/schedulerService.js

const cron = require('node-cron');
const AuctionModel = require('../models/Auction');
const LotModel = require('../models/Lot');
const BidModel = require('../models/Bid');
const PaymentService = require('./paymentService'); // Importar o serviço de pagamento

let schedulerTask = null; // Para manter a referência da tarefa de cron

/**
 * Lógica para verificar e finalizar lotes que atingiram a data/hora final.
 */
const checkAndFinalizeLots = async () => {
    console.log(`[Scheduler] Executando verificação de lotes às ${new Date().toISOString()}`);

    try {
        // 1. Encontra todos os lotes ativos com data_fim no passado
        const query = `
            SELECT L.*, LE.administrador_id 
            FROM Lotes L
            JOIN Leiloes LE ON L.leilao_id = LE.id
            WHERE L.status = 'ativo' AND L.data_fim <= NOW()
        `;
        const [lotsToFinalize] = await AuctionModel.db.query(query); // Usando o módulo DB

        if (lotsToFinalize.length === 0) {
            console.log('[Scheduler] Nenhum lote para finalizar.');
            return;
        }

        console.log(`[Scheduler] Encontrados ${lotsToFinalize.length} lotes para finalizar...`);

        for (const lot of lotsToFinalize) {
            console.log(`[Scheduler] Processando Lote ID: ${lot.id}`);

            // 2. Encontra o lance vencedor (se houver)
            const highestBid = await BidModel.findHighestBid(lot.id);

            if (highestBid) {
                // 3a. Lote arrematado!
                const valorArremate = highestBid.valor_lance;
                const clienteVencedorId = highestBid.cliente_id;
                
                // 4. Cria o registro inicial na tabela Pagamentos
                await PaymentService.createInitialPayment(
                    lot.id, 
                    clienteVencedorId, 
                    valorArremate,
                    lot.comissao_leiloeiro // Passando a comissão do lote/leilão
                );
                
                // 5. Atualiza o status do Lote no DB para 'arrematado' e registra o valor final
                await LotModel.setArremateValue(lot.id, valorArremate, clienteVencedorId);
                
                // TODO: Enviar Notificação (Notificar vencedor e administrador)

            } else {
                // 3b. Lote não arrematado
                
                // 4. Atualiza o status do Lote no DB para 'nao_vendido'
                await LotModel.update(lot.id, { status: 'nao_vendido' }); // Assumindo que LotModel tem um update

                // TODO: Enviar Notificação (Notificar administrador)
            }
            
            // 6. Tenta finalizar o Leilão pai se todos os lotes terminarem
            await finalizeParentAuction(lot.leilao_id);
        }

    } catch (error) {
        console.error('ERRO CRÍTICO no Agendador de Lotes:', error);
    }
};

/**
 * Lógica auxiliar para finalizar o leilão pai se todos os seus lotes terminarem.
 */
const finalizeParentAuction = async (leilaoId) => {
    const query = `
        SELECT COUNT(id) AS active_lots 
        FROM Lotes 
        WHERE leilao_id = ? AND status = 'ativo'
    `;
    const [result] = await AuctionModel.db.query(query, [leilaoId]);

    // Se a contagem de lotes ativos for zero, finaliza o leilão pai.
    if (result[0].active_lots === 0) {
        // Encontra o status geral baseado nos lotes (todos vendidos/não vendidos)
        const finalStatus = 'encerrado'; 
        await AuctionModel.update(leilaoId, { status: finalStatus });
        console.log(`[Scheduler] Leilão pai ID ${leilaoId} finalizado.`);
    }
};


/**
 * Inicializa a tarefa de agendamento (chamada por server.js).
 */
const initScheduler = () => {
    // Roda a cada 1 minuto (Ajuste conforme a necessidade de precisão do leilão)
    schedulerTask = cron.schedule('* * * * *', checkAndFinalizeLots, {
        scheduled: true,
        timezone: "America/Sao_Paulo" // Use seu fuso horário local
    });

    console.log('✅ Agendador de Leilões inicializado para rodar a cada 1 minuto.');
};

/** Para a tarefa de agendamento, se necessário. */
const stopScheduler = () => {
    if (schedulerTask) {
        schedulerTask.stop();
        console.log('❌ Agendador de Leilões parado.');
    }
};


module.exports = {
    initScheduler,
    stopScheduler,
    checkAndFinalizeLots // Útil para testes
};