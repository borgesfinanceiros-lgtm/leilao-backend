// src/frontend/client/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { getProfile, getUserProfile } from '../services/authService';
import api from '../services/api'; // Para futuras chamadas de atualização ou histórico

const styles = {
    container: { maxWidth: '800px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'white' },
    header: { borderBottom: '2px solid #3498db', paddingBottom: '10px', marginBottom: '20px' },
    card: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '6px', marginBottom: '20px' },
    details: { display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px' },
    label: { fontWeight: 'bold', color: '#555' },
    data: { color: '#333' },
    sectionTitle: { borderLeft: '4px solid #3498db', paddingLeft: '10px', marginBottom: '15px' }
};

const ProfilePage = ({ user }) => {
    // Usamos o estado para armazenar dados mais detalhados ou atualizáveis
    const [profileData, setProfileData] = useState(user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]); // Histórico de lances/pagamentos

    useEffect(() => {
        const fetchFullProfile = async () => {
            setLoading(true);
            try {
                // Chama a rota protegida /api/v1/users/profile para obter dados atualizados
                const fullUser = await getProfile(); 
                setProfileData(fullUser);
                
                // (Opcional) Busca o histórico de lances
                // const historyResponse = await api.get('/users/bidding-history');
                // setHistory(historyResponse.data.data);

            } catch (err) {
                // Se falhar (token expirado), o interceptor do Axios fará o logout/redirecionamento.
                setError('Falha ao carregar o perfil completo. Tente recarregar.');
            } finally {
                setLoading(false);
            }
        };

        // Carrega o perfil se o estado 'user' for fornecido (do App.jsx)
        if (user) {
            fetchFullProfile();
        } else {
            // Se o App.jsx não passou o user, tentamos pegar do localStorage (mas já deveria ter sido pego)
            const localUser = getUserProfile();
            if (localUser) {
                 setProfileData(localUser);
                 fetchFullProfile();
            } else {
                // Se não há usuário logado (deveria ter sido pego pelo PrivateRoute), exibimos erro
                setError("Você não está logado.");
                setLoading(false);
            }
        }
    }, [user]); 

    if (loading) return <div style={styles.container}><h3>Carregando seu perfil...</h3></div>;
    if (error || !profileData) return <div style={styles.container}><p style={{ color: 'red' }}>{error}</p></div>;

    // Dados fictícios para o histórico, até que a API esteja pronta
    const mockHistory = [
        { id: 101, leilao: 'Cadeira de Design Clássico', lance: 550.00, status: 'Vencido' },
        { id: 102, leilao: 'Obra de Arte Moderna', lance: 1200.00, status: 'Perdido' },
        { id: 103, leilao: 'Relógio Suíço Raro', lance: 8000.00, status: 'Pendente Pagamento' }
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Painel de Perfil ({profileData.nome})</h1>

            {/* Seção de Dados Pessoais */}
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Informações Pessoais</h3>
                <div style={styles.details}>
                    <span style={styles.label}>ID de Usuário:</span> <span style={styles.data}>{profileData.id}</span>
                    <span style={styles.label}>E-mail:</span> <span style={styles.data}>{profileData.email}</span>
                    <span style={styles.label}>Membro Desde:</span> <span style={styles.data}>{new Date(profileData.created_at).toLocaleDateString('pt-BR')}</span>
                    <span style={styles.label}>Saldo Disponível:</span> <span style={{ ...styles.data, fontWeight: 'bold', color: '#2ecc71' }}>R$ 0,00</span> {/* Implementação futura */}
                </div>
                {/* Botão para editar perfil (Implementação futura) */}
                <button style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Editar Perfil
                </button>
            </div>

            {/* Seção de Histórico de Lances */}
            <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Histórico Recente de Lances</h3>
                
                {mockHistory.length === 0 ? (
                    <p>Você ainda não deu nenhum lance.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Leilão</th>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>Seu Lance</th>
                                <th style={{ borderBottom: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockHistory.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ padding: '10px' }}>{item.leilao}</td>
                                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>R$ {item.lance.toFixed(2)}</td>
                                    <td style={{ padding: '10px', textAlign: 'center', color: item.status === 'Vencido' ? 'green' : (item.status === 'Pendente Pagamento' ? 'orange' : 'red') }}>{item.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default ProfilePage;