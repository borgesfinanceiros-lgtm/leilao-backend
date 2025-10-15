// src/frontend/admin/src/pages/AuctionsPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { getAllAuctions, createAuction, updateAuction } from '../services/auctionService';
import AuctionFormModal from '../components/AuctionFormModal';

const AuctionsPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuction, setEditingAuction] = useState(null); // Armazena dados do leilão em edição
    const [isSaving, setIsSaving] = useState(false);

    // Função para buscar e atualizar a lista de leilões
    const fetchAuctions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllAuctions();
            setAuctions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuctions();
    }, [fetchAuctions]);

    // Ações do Modal
    const handleCreateNew = () => {
        setEditingAuction(null); // Limpa para criação
        setIsModalOpen(true);
    };

    const handleEdit = (auction) => {
        setEditingAuction(auction); // Define os dados para edição
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        setIsSaving(true);
        setError(null);

        try {
            if (editingAuction) {
                // Atualização
                await updateAuction(editingAuction.id, formData);
                alert('Leilão atualizado com sucesso!');
            } else {
                // Criação
                await createAuction(formData);
                alert('Leilão criado com sucesso!');
            }
            
            setIsModalOpen(false);
            setEditingAuction(null);
            
            // Recarrega a lista para mostrar a alteração
            fetchAuctions();

        } catch (err) {
            setError(err.message);
            alert(`Erro ao salvar: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Estilos simples para a página
    const styles = {
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
        th: { borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' },
        td: { borderBottom: '1px solid #eee', padding: '10px', verticalAlign: 'top' },
        actionButton: { padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px' }
    };
    
    if (loading) return <h3>Carregando Leilões...</h3>;
    if (error) return <p style={{ color: 'red' }}>Erro ao carregar: {error}</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Gerenciamento de Leilões ({auctions.length})</h2>
                <button 
                    onClick={handleCreateNew} 
                    style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    + Novo Leilão
                </button>
            </div>

            {/* Tabela de Leilões */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Título</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Início</th>
                        <th style={styles.th}>Fim</th>
                        <th style={styles.th}>Lance Inicial</th>
                        <th style={styles.th}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {auctions.map((auction) => (
                        <tr key={auction.id}>
                            <td style={styles.td}>{auction.id}</td>
                            <td style={styles.td}>{auction.titulo}</td>
                            <td style={styles.td}>
                                <span style={{ 
                                    padding: '5px', 
                                    borderRadius: '3px', 
                                    backgroundColor: 
                                        auction.status === 'ativo' ? '#2ecc71' : 
                                        auction.status === 'futuro' ? '#f1c40f' : 
                                        '#e74c3c',
                                    color: 'white'
                                }}>
                                    {auction.status.toUpperCase()}
                                </span>
                            </td>
                            <td style={styles.td}>{new Date(auction.data_inicio).toLocaleString('pt-BR')}</td>
                            <td style={styles.td}>{new Date(auction.data_fim).toLocaleString('pt-BR')}</td>
                            <td style={styles.td}>R$ {auction.lance_inicial.toFixed(2)}</td>
                            <td style={styles.td}>
                                <button 
                                    onClick={() => handleEdit(auction)} 
                                    style={{ ...styles.actionButton, backgroundColor: '#3498db', color: 'white' }}
                                >
                                    Editar
                                </button>
                                {/* Implementar funcionalidade de deletar no futuro */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Renderiza o Modal se estiver aberto */}
            {isModalOpen && (
                <AuctionFormModal 
                    initialData={editingAuction}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    isLoading={isSaving}
                />
            )}
        </div>
    );
};

export default AuctionsPage;