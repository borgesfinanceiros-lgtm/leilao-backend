// src/frontend/admin/src/pages/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Usamos o serviço API para buscar dados

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Chama a rota protegida GET /api/v1/admin/dashboard
                const response = await api.get('/dashboard'); 
                setStats(response.data.stats);
            } catch (err) {
                console.error('Falha ao buscar estatísticas:', err);
                // O interceptor do Axios cuidará do 401/403 (desloga o usuário)
                setError('Não foi possível carregar as estatísticas. Verifique a conexão com a API.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <p>Carregando Dashboard...</p>;
    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
    
    // Estilos simples para os cards
    const cardStyle = {
        padding: '20px',
        margin: '10px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        textAlign: 'center',
        flex: 1
    };

    return (
        <div>
            <h2>Visão Geral</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={cardStyle}>
                    <h3>{stats.leiloes_ativos}</h3>
                    <p>Leilões Ativos</p>
                </div>
                <div style={cardStyle}>
                    <h3>{stats.cadastros_hoje}</h3>
                    <p>Novos Cadastros Hoje</p>
                </div>
                <div style={cardStyle}>
                    <h3>{stats.lances_totais}</h3>
                    <p>Lances Totais</p>
                </div>
            </div>

            {/* Futuras visualizações de gráficos e logs */}
            
        </div>
    );
};

export default DashboardPage;