// src/backend/src/scheduler/auctionScheduler.js

const cron = require('node-cron');
const { Auction, User } = require('../models'); // Importe seus modelos

// Função para processar os leilões
const checkAndProcessAuctions = async () => {
    console.log(`[SCHEDULER] Executando verificação de leilões às ${new Date().toLocaleString('pt-BR')}`);

    // 1. Encontrar Leilões ATIVOS que DEVERIAM ter encerrado
    try {
        const now = new Date();
        
        // Buscamos leilões com status 'ativo' onde a data_fim já passou.
        const finishedAuctions = await Auction.findAll({
            where: {
                status: 'ativo',
                data_fim: {
                    [Sequelize.Op.lt]: now // Operador 'Less Than' (menor que)
                }
            },
            // Incluir informações do vencedor (se houver) e o lance final
        });

        for (const auction of finishedAuctions) {
            console.log(`[SCHEDULER] Encerrando leilão #${auction.id}: ${auction.titulo}`);
            
            // Lógica de ENCERRAMENTO e ATRIBUIÇÃO do VENCEDOR:
            if (auction.lance_atual && auction.lance_atual > auction.lance_inicial) {
                // Se houver lances, o último lance é o vencedor
                // Em um sistema real, você buscaria o último Bid e a User ID
                const winningBid = await Bid.findOne({ 
                    where: { auction_id: auction.id }, 
                    order: [['amount', 'DESC']], 
                });
                
                if (winningBid) {
                    await auction.update({
                        status: 'encerrado',
                        vencedor_id: winningBid.user_id,
                        valor_final: winningBid.amount
                    });
                    console.log(`Leilão #${auction.id} vencido pelo Usuário ${winningBid.user_id} por R$ ${winningBid.amount}.`);
                    
                    // Notificar o vencedor (e-mail, notificação, etc.)
                } else {
                    // Sem lances válidos, mas lance atual > inicial (caso de lance automático)
                     await auction.update({ status: 'encerrado' });
                }

            } else {
                // Leilão encerra sem lances (ou lance igual ao inicial)
                await auction.update({ status: 'encerrado' });
                console.log(`Leilão #${auction.id} encerrado sem lances.`);
            }
        }

    } catch (error) {
        console.error('[SCHEDULER] Erro ao processar leilões encerrados:', error);
    }
    
    // 2. Encontrar Leilões FUTUROS que DEVEM iniciar
    try {
        const now = new Date();

        // Buscamos leilões com status 'futuro' onde a data_inicio já passou.
        const startingAuctions = await Auction.findAll({
            where: {
                status: 'futuro',
                data_inicio: {
                    [Sequelize.Op.lte]: now // Operador 'Less Than or Equal' (menor ou igual que)
                }
            }
        });

        for (const auction of startingAuctions) {
            console.log(`[SCHEDULER] Iniciando leilão #${auction.id}: ${auction.titulo}`);
            await auction.update({ status: 'ativo' });
            // Notificar licitantes (Implementação futura)
        }
    } catch (error) {
        console.error('[SCHEDULER] Erro ao processar leilões a iniciar:', error);
    }
};

/**
 * Inicia o cron job para rodar a cada minuto.
 */
const initScheduler = () => {
    // Configura para rodar a cada 1 minuto ('* * * * *')
    // Você pode usar '*/5 * * * *' para rodar a cada 5 minutos
    cron.schedule('* * * * *', checkAndProcessAuctions, {
        scheduled: true,
        timezone: "America/Sao_Paulo" // Use seu fuso horário de referência
    });
    console.log('[SCHEDULER] Scheduler de leilões iniciado. Executa a cada minuto.');
};

module.exports = {
    initScheduler
};