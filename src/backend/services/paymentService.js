// src/backend/services/paymentService.js

const PaymentModel = require('../models/Payment');
const NotificationService = require('./notificationService'); 

class PaymentService {

    /** * Cria o registro inicial de pagamento após o arremate de um lote.
     */
    static async createInitialPayment(loteId, clienteVencedorId, valorArremate, comissaoLeiloeiro) {
        const comissao = valorArremate * (comissaoLeiloeiro / 100);
        const valorTotal = valorArremate + comissao; // Ou apenas o valor do arremate, dependendo da sua regra de negócio

        const paymentData = {
            lote_id: loteId,
            cliente_id: clienteVencedorId,
            valor_arremate: valorArremate,
            comissao_leiloeiro: comissao,
            valor_total: valorTotal,
            status_pagamento: 'pendente_arremate', // Novo status
            // detalhes_transacao: '...'
        };

        try {
            const paymentId = await PaymentModel.create(paymentData);
            
            // Envia notificação ao cliente vencedor
            NotificationService.createNotification(
                clienteVencedorId, 
                `Parabéns! Você arrematou o lote ID ${loteId} por R$ ${valorArremate.toFixed(2)}. Acesse para pagar.`,
                `/payments/${paymentId}`
            );

            return paymentId;
        } catch (error) {
            console.error('Erro ao criar registro inicial de pagamento:', error);
            // Isso é crítico; você pode querer logar e notificar o admin
            return null;
        }
    }

    // Você adicionará mais funções aqui (ex: processarWebhook, getPaymentLink)
}

module.exports = PaymentService;