// src/backend/services/notificationService.js

const NotificationModel = require('../models/Notification');
// Certifique-se de que o Socket.IO está acessível se você quiser notificações em tempo real
// const io = require('../sockets/realtimeBids').getIO(); // Exemplo de como importar o IO

class NotificationService {
    
    /** * Cria um novo registro de notificação no banco de dados. 
     * @param {number} clienteId - ID do cliente a ser notificado.
     * @param {string} message - A mensagem de notificação.
     * @param {string} link - O link para onde a notificação deve levar.
     */
    static async createNotification(clienteId, message, link = null) {
        try {
            const notificationData = {
                cliente_id: clienteId,
                mensagem: message,
                link: link
            };
            
            const newId = await NotificationModel.create(notificationData);
            
            // Se você tiver Socket.IO (como sugerido pela sua estrutura), descomente a lógica abaixo
            /*
            if (io) {
                // Emite a notificação em tempo real para o cliente logado
                io.to(`client_${clienteId}`).emit('newNotification', { 
                    id: newId, 
                    mensagem: message, 
                    link: link, 
                    lida: false 
                });
            }
            */

            return newId;

        } catch (error) {
            console.error('Erro no NotificationService ao criar notificação:', error);
            // Continua a execução mesmo se a notificação falhar
            return null; 
        }
    }
}

module.exports = NotificationService;