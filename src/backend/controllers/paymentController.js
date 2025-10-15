// src/backend/controllers/paymentController.js

const PaymentModel = require('../models/Payment');

/** [PROTECTED] Obtém o histórico de pagamentos de um usuário logado. */
const getPaymentHistory = async (req, res) => {
    const userId = req.user.id; 
    try {
        const history = await PaymentModel.findByUserId(userId);
        return res.json({ success: true, data: history });
    } catch (error) {
        console.error(`Erro ao buscar histórico de pagamento do usuário ${userId}:`, error);
        return res.status(500).json({ message: 'Erro interno ao buscar histórico.' });
    }
};

/** [PROTECTED] Inicia o processo de pagamento para um leilão vencido (Simulação). */
const createCheckoutSession = async (req, res) => {
    const { auctionId, winningBidId } = req.body;
    const userId = req.user.id; 

    // Validação crucial de vencedor aqui...
    
    try {
        // Simular a criação de um registro de pagamento (status: pendente)
        const paymentData = {
            leilao_id: auctionId,
            usuario_id: userId,
            valor: 1000.00, // Valor viria do leilão/lance
            status: 'pendente',
            metodo: 'gateway_simulado',
        };
        const paymentId = await PaymentModel.create(paymentData);

        return res.json({
            success: true,
            message: 'Sessão de checkout criada. Redirecione o usuário.',
            paymentId: paymentId,
        });

    } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error);
        return res.status(500).json({ message: 'Erro interno ao iniciar pagamento.' });
    }
};

/** [WEBHOOK] Endpoint para receber notificações do Gateway de Pagamento. */
const handleWebhook = async (req, res) => {
    const { paymentId, status } = req.body;
    
    try {
        if (status === 'aprovado') {
            await PaymentModel.updateStatus(paymentId, 'aprovado', req.body);
            console.log(`[Webhook] Pagamento ${paymentId} APROVADO.`);
        } else if (status === 'falhou') {
            await PaymentModel.updateStatus(paymentId, 'falhou', req.body);
            console.log(`[Webhook] Pagamento ${paymentId} FALHOU.`);
        }
        
        return res.status(200).send('OK');

    } catch (error) {
        console.error('Erro no Webhook de Pagamento:', error);
        return res.status(500).send('Erro interno do servidor ao processar webhook.');
    }
};

module.exports = {
    getPaymentHistory,
    createCheckoutSession,
    handleWebhook
};