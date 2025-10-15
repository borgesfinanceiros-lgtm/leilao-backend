// src/frontend/admin/src/components/AuctionFormModal.jsx

import React, { useState, useEffect } from 'react';

// Função utilitária para formatar datas no formato YYYY-MM-DDThh:mm (para o input datetime-local)
const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Ajusta fuso horário local
    return date.toISOString().slice(0, 16);
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '600px', maxHeight: '90vh', overflowY: 'auto' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    button: { padding: '10px 20px', marginRight: '10px', borderRadius: '4px', cursor: 'pointer' },
};

/**
 * Modal de Formulário para Criar ou Editar Leilões.
 * @param {object} initialData - Dados do leilão a ser editado (ou nulo para criação).
 * @param {function} onClose - Função para fechar o modal.
 * @param {function} onSave - Função para salvar os dados (recebe os dados do formulário).
 */
const AuctionFormModal = ({ initialData, onClose, onSave, isLoading }) => {
    const isEdit = !!initialData?.id;

    // Inicializa o estado com os dados do leilão (formatando datas)
    const [formData, setFormData] = useState({
        titulo: initialData?.titulo || '',
        descricao: initialData?.descricao || '',
        data_inicio: formatDateTime(initialData?.data_inicio),
        data_fim: formatDateTime(initialData?.data_fim),
        lance_inicial: initialData?.lance_inicial || 0,
        comissao_leiloeiro: initialData?.comissao_leiloeiro || 0,
        status: initialData?.status || 'futuro',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Converte valores numéricos e garante que as datas são objetos Date para o backend
        const dataToSubmit = {
            ...formData,
            lance_inicial: parseFloat(formData.lance_inicial),
            comissao_leiloeiro: parseFloat(formData.comissao_leiloeiro),
            // O backend deve aceitar a string ISO 8601 gerada pelo input datetime-local
            data_inicio: formData.data_inicio,
            data_fim: formData.data_fim,
        };

        onSave(dataToSubmit);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>{isEdit ? `Editar Leilão #${initialData.id}` : 'Criar Novo Leilão'}</h2>
                
                <form onSubmit={handleSubmit}>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Título:</label>
                        <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} style={styles.input} required />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Descrição:</label>
                        <textarea name="descricao" value={formData.descricao} onChange={handleChange} style={styles.input} rows="3"></textarea>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Lance Inicial (R$):</label>
                        <input type="number" name="lance_inicial" value={formData.lance_inicial} onChange={handleChange} style={styles.input} min="0.01" step="0.01" required />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Data e Hora de Início:</label>
                            <input type="datetime-local" name="data_inicio" value={formData.data_inicio} onChange={handleChange} style={styles.input} required />
                        </div>
                        <div style={{ ...styles.formGroup, flex: 1 }}>
                            <label style={styles.label}>Data e Hora de Fim:</label>
                            <input type="datetime-local" name="data_fim" value={formData.data_fim} onChange={handleChange} style={styles.input} required />
                        </div>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Status:</label>
                        <select name="status" value={formData.status} onChange={handleChange} style={styles.input} required>
                            <option value="futuro">Futuro</option>
                            <option value="ativo">Ativo</option>
                            <option value="encerrado">Encerrado</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            style={{ ...styles.button, backgroundColor: '#ccc' }}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            style={{ ...styles.button, backgroundColor: '#2ecc71', color: 'white' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Salvando...' : (isEdit ? 'Salvar Alterações' : 'Criar Leilão')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuctionFormModal;