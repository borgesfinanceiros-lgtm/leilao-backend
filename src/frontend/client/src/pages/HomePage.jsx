// src/frontend/client/src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { getActiveAuctions } from '../services/auctionService';
import { Link } from 'react-router-dom';

const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px 0' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
    card: { border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'transform 0.2s' },
    cardHover: { transform: 'translateY(-5px)' }, // Estilo para hover (simulado)
    cardContent: { padding: '15px' },
    cardTitle: { fontSize: '1.4em', marginBottom: '10px', color: '#2c3e50' },
    priceTag: { fontSize: '1.2em', fontWeight: 'bold', color: '#e74c3c' },
    statusTag: { padding: '5px 10px', borderRadius: '4px', color: 'white', display: 'inline-block', marginTop: '10px' },
    linkStyle: { textDecoration: 'none', color: 'inherit' }
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'ativo': return { backgroundColor: '#2ecc71' };
        case 'futuro': return { backgroundColor: '#f1c40f' };
        case 'encerrado': return { backgroundColor: '#95a5a6' };
        default: return { backgroundColor: '#ccc' };
    }
};

// Componente para um único cartão de leilão
const AuctionCard = ({ auction }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link 
            to={`/auctions/${auction.id}`} 
            style={styles.linkStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ ...styles.card, ...(isHovered ? styles.cardHover : {}) }}>
                {/* Imagem Placeholder (em um projeto real, aqui teria a imagem) */}
                <div style={{ height: '200px', backgroundColor: '#ecf0f1', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5em', color: '#ccc' }}>
                    Item do Leilão
                </div>

                <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{auction.titulo}</h3>
                    <p>Lance Atual/Inicial:</p>
                    <p style={styles.priceTag}>
                        R$ {(auction.lance_atual || auction.lance_inicial).toFixed(2)}
                    </p>
                    <span style={{...styles.statusTag, ...getStatusStyle(auction.status)}}>
                        {auction.status.toUpperCase()}
                    </span>
                </div>
            </div>
        </Link>
    );
};


const HomePage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            setLoading(true);
            setError(null);
            try {
                // Busca leilões ativos e futuros (deixamos o filtro para o backend)
                const data = await getActiveAuctions({ status: 'ativo,futuro' }); 
                setAuctions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    if (loading) return <div style={styles.container}><h3>Carregando Leilões...</h3></div>;
    if (error) return <div style={styles.container}><p style={{ color: 'red' }}>Erro ao carregar: {error}</p></div>;

    return (
        <div style={styles.container}>
            <h1>Leilões Disponíveis ({auctions.length})</h1>

            {auctions.length === 0 && (
                <p>Nenhum leilão disponível no momento. Volte mais tarde!</p>
            )}

            <div style={styles.grid}>
                {auctions.map(auction => (
                    <AuctionCard key={auction.id} auction={auction} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;