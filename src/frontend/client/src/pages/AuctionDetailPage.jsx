// src/frontend/client/src/pages/AuctionDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAuctionDetails } from '../services/auctionService';

// Importa a lógica do Socket.IO
import { 
    connectSocket, 
    disconnectSocket, 
    subscribeToAuction, 
    unsubscribeFromAuction,
    sendBid 
} from '../services/socketService';

const getStatusStyle = (status) => {
    switch (status) {
        case 'ativo': return { backgroundColor: '#2ecc71' };
        case 'futuro': return { backgroundColor: '#f1c40f' };
        case 'encerrado': return { backgroundColor: '#95a5a6' };
        default: return { backgroundColor: '#ccc' };
    }
};

const styles = {
    container: { maxWidth: '900px', margin: '0 auto' },
    header: { borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' },
    detailsGrid: { display: 'flex', gap: '40px' },
    itemImage: { flex: 1, backgroundColor: '#f0f0f0', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2em', borderRadius: '8px' },
    biddingPanel: { flex: 1, border: '1px solid #ccc', padding: '20px', borderRadius: '8px' },
    priceDisplay: { fontSize: '2.5em', fontWeight: 'bold', color: '#e74c3c', margin: '10px 0' },
    timer: { fontSize: '1.5em', fontWeight: 'bold', color: '#3498db', marginBottom: '20px' },
    bidInput: { padding: '10px', width: '60%', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    bidButton: { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    log: { maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginTop: '20px' }
};

const AuctionDetailPage = ({ user }) => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentBidAmount, setCurrentBidAmount] = useState('');
    const [timerDisplay, setTimerDisplay] = useState('...');
    const [bidLog, setBidLog] = useState([]); // Log de lances (atualizado pelo Socket)
    const [notification, setNotification] = useState(''); // Feedback de lance

    // 1. Carregar Detalhes do Leilão (REST) e Setup do Socket.IO (Tempo Real)
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const data = await getAuctionDetails(id);
                setAuction(data);
                // Define o próximo lance mínimo
                setCurrentBidAmount(data.lance_atual ? (data.lance_atual + 1).toFixed(2) : (data.lance_inicial + 1).toFixed(2));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchDetails();
        
        // --- Lógica do Socket.IO ---
        // 1. Conecta o socket
        connectSocket(); 
        
        // 2. Define o handler de atualização em tempo real
        const updateHandler = (data) => {
            console.log('Dados do leilão atualizados (Socket):', data);
            
            // Atualiza o estado do leilão com os novos dados
            setAuction(data.auction);
            
            // Adiciona o novo lance ao log, se houver
            if (data.newBid) {
                setBidLog(prevLog => [data.newBid, ...prevLog]);
            }
            
            // Atualiza o valor sugerido para o próximo lance mínimo
            const newMinBid = (data.auction.lance_atual + 1).toFixed(2);
            setCurrentBidAmount(newMinBid);
        };
        
        // 3. Subscreve à sala do leilão
        subscribeToAuction(id, updateHandler);
        
        // 4. Cleanup function (chamada ao desmontar o componente)
        return () => {
            unsubscribeFromAuction(id); // Deixa a sala do leilão
            disconnectSocket(); // Desconecta totalmente o socket
        };
        
    }, [id]);

    // 2. Lógica do Cronômetro (Permanece a mesma)
    useEffect(() => {
        if (!auction || auction.status !== 'ativo') return;

        const interval = setInterval(() => {
            const now = new Date();
            const endTime = new Date(auction.data_fim);
            const remaining = endTime.getTime() - now.getTime();

            if (remaining <= 0) {
                setTimerDisplay('ENCERRADO');
                clearInterval(interval);
                return;
            }

            const totalSeconds = Math.floor(remaining / 1000);
            const days = Math.floor(totalSeconds / (3600 * 24));
            const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            setTimerDisplay(
                `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [auction]);
    
    // 3. Lógica de Envio de Lance (Usando Socket.IO)
    const handleBid = (e) => {
        e.preventDefault();
        setError(null);
        setNotification('');
        
        if (!user) {
            alert('Você precisa estar logado para dar lances!');
            return;
        }

        const bidValue = parseFloat(currentBidAmount);
        const minBid = (auction.lance_atual || auction.lance_inicial) + 1;

        if (isNaN(bidValue) || bidValue < minBid) {
            setError(`O lance deve ser de no mínimo R$ ${minBid.toFixed(2)}.`);
            return;
        }
        
        // Envia o lance via Socket.IO
        sendBid(id, bidValue, (response) => {
            if (response.success) {
                setNotification('Lance enviado com sucesso! Aguardando confirmação em tempo real...');
                // O servidor emitirá 'auctionUpdate' para todos, atualizando o UI
            } else {
                // Se houve um erro (ex: lance muito baixo, leilão encerrado)
                setError(response.message);
            }
        });
    };
    
    if (loading) return <div style={styles.container}><h2>Carregando detalhes do leilão...</h2></div>;
    if (error || !auction) return <div style={styles.container}><p style={{ color: 'red' }}>{error || 'Leilão não encontrado.'}</p><Link to="/">Voltar à lista</Link></div>;

    const currentPrice = auction.lance_atual || auction.lance_inicial;
    const nextMinBid = (currentPrice + 1).toFixed(2);
    const auctionActive = auction.status === 'ativo';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>{auction.titulo}</h1>
                <p>Status: <span style={{...getStatusStyle(auction.status), padding: '5px', borderRadius: '4px'}}>{auction.status.toUpperCase()}</span></p>
            </div>
            
            <div style={styles.detailsGrid}>
                {/* Coluna da Imagem/Descrição */}
                <div style={{ flex: 1 }}>
                    <div style={styles.itemImage}>
                        {auction.titulo}
                    </div>
                    <h3 style={{ marginTop: '20px' }}>Descrição</h3>
                    <p>{auction.descricao}</p>
                    <p>Comissão do Leiloeiro: {auction.comissao_leiloeiro}%</p>
                </div>
                
                {/* Coluna do Lance */}
                <div style={styles.biddingPanel}>
                    {auctionActive && (
                        <div style={styles.timer}>
                            Tempo Restante: {timerDisplay}
                        </div>
                    )}
                    
                    <p style={{ fontSize: '1.2em' }}>Lance Atual:</p>
                    <div style={styles.priceDisplay}>
                        R$ {currentPrice.toFixed(2)}
                    </div>
                    
                    {auctionActive ? (
                        <form onSubmit={handleBid}>
                            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                            {notification && <p style={{ color: 'green', marginBottom: '10px' }}>{notification}</p>}
                            
                            <p style={{ marginBottom: '10px', color: '#7f8c8d' }}>
                                Lance Mínimo: R$ {nextMinBid}
                            </p>
                            <input
                                type="number"
                                step="0.01"
                                min={nextMinBid}
                                value={currentBidAmount}
                                onChange={(e) => setCurrentBidAmount(e.target.value)}
                                style={styles.bidInput}
                                required
                                disabled={!user}
                            />
                            <button
                                type="submit"
                                style={styles.bidButton}
                                disabled={!user}
                            >
                                Dar Lance
                            </button>
                            {!user && <p style={{ color: '#e74c3c', marginTop: '10px' }}>Faça **login** para dar um lance.</p>}
                        </form>
                    ) : (
                        <h3 style={{ color: '#e74c3c' }}>Leilão {auction.status.toUpperCase()}</h3>
                    )}

                    {/* Log de Lances - Agora atualizado pelo Socket.IO */}
                    <h4 style={{ marginTop: '20px' }}>Histórico de Lances:</h4>
                    <div style={styles.log}>
                        {bidLog.length === 0 && <p>Nenhum lance ainda. Seja o primeiro!</p>}
                        {bidLog.map((log, index) => (
                            <p key={index} style={{ margin: '5px 0', borderBottom: '1px dotted #eee', paddingBottom: '3px' }}>
                                **{log.userName || log.user}** deu lance de R$ **{log.amount.toFixed(2)}** {log.timestamp && <span style={{ fontSize: '0.8em', color: '#999' }}>({new Date(log.timestamp).toLocaleTimeString('pt-BR')})</span>}
                            </p>
                        ))}
                         <p style={{ margin: '5px 0' }}>Lance Inicial: R$ {auction.lance_inicial.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetailPage;