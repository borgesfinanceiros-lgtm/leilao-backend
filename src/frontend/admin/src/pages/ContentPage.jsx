// src/frontend/admin/src/pages/ContentPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { getAllContent, saveContent } from '../services/contentService';

const styles = {
    container: { display: 'flex', gap: '20px' },
    sidebar: { width: '250px', borderRight: '1px solid #ccc', paddingRight: '20px' },
    main: { flex: 1 },
    listItem: { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' },
    activeItem: { backgroundColor: '#e6f7ff', fontWeight: 'bold' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    button: { padding: '10px 20px', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    textarea: { ...this.input, height: '300px' }
};

const EMPTY_FORM = { 
    id: null, 
    slug: '', 
    titulo: '', 
    conteudo: '', 
    is_publico: true 
};

const ContentPage = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentContent, setCurrentContent] = useState(EMPTY_FORM);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState('');

    // 1. Função para carregar a lista de páginas
    const fetchPages = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllContent();
            setPages(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    // 2. Lógica para selecionar ou criar novo
    const selectContentForEditing = (page) => {
        setError(null);
        setNotification('');
        // No mundo real, faríamos um GET API para obter o conteúdo completo.
        // Aqui, simulamos os dados completos com base no que temos da lista.
        // É necessário que o backend retorne o 'conteudo' na lista para funcionar 100%
        // ou criar um endpoint GET /content/:slug no Admin.
        
        // Por enquanto, apenas inicializa com os dados básicos
        const fullContent = pages.find(p => p.id === page.id) || page;
        setCurrentContent({
            id: fullContent.id,
            slug: fullContent.slug || '',
            titulo: fullContent.titulo || '',
            conteudo: fullContent.conteudo || '', // Assume que o conteudo está na lista, se não, estará vazio.
            is_publico: fullContent.is_publico === 1 // Converte 1/0 para boolean
        });
    };
    
    const handleNewContent = () => {
        setCurrentContent(EMPTY_FORM);
    };

    // 3. Lógica para salvar
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setNotification('');

        try {
            const dataToSave = {
                ...currentContent,
                is_publico: currentContent.is_publico ? 1 : 0 // Converte boolean para 1/0
            };
            
            const result = await saveContent(dataToSave);
            
            setNotification(result.message);
            // Re-fetch para atualizar a lista de slugs/títulos se for uma nova criação
            fetchPages(); 

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <h3>Carregando Conteúdo...</h3>;

    return (
        <div>
            <h2>Gerenciamento de Conteúdo Estático</h2>
            
            <div style={styles.container}>
                
                {/* Sidebar de Páginas */}
                <div style={styles.sidebar}>
                    <button 
                        onClick={handleNewContent} 
                        style={{ ...styles.button, width: '100%', marginBottom: '15px' }}
                    >
                        + Criar Nova Página
                    </button>
                    
                    <h3>Páginas Existentes:</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {pages.map(page => (
                            <li 
                                key={page.id} 
                                style={{ 
                                    ...styles.listItem, 
                                    ...(currentContent.id === page.id ? styles.activeItem : {}) 
                                }}
                                onClick={() => selectContentForEditing(page)}
                            >
                                {page.titulo} 
                                <span style={{ float: 'right', color: page.is_publico === 1 ? '#2ecc71' : '#e74c3c' }}>
                                    ({page.is_publico === 1 ? 'Público' : 'Rascunho'})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Formulário de Edição */}
                <div style={styles.main}>
                    {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
                    {notification && <p style={{ color: 'green', fontWeight: 'bold' }}>{notification}</p>}
                    
                    <form onSubmit={handleSubmit}>
                        
                        <h3>{currentContent.id ? `Editar: ${currentContent.titulo}` : 'Novo Conteúdo'}</h3>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Título da Página:</label>
                            <input 
                                type="text" 
                                name="titulo" 
                                value={currentContent.titulo} 
                                onChange={(e) => setCurrentContent({...currentContent, titulo: e.target.value})}
                                style={styles.input} required 
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Slug (URL amigável):</label>
                            <input 
                                type="text" 
                                name="slug" 
                                value={currentContent.slug} 
                                onChange={(e) => setCurrentContent({...currentContent, slug: e.target.value})}
                                style={styles.input} required 
                            />
                            <small>Ex: termos-de-uso. Não mude o slug a menos que seja necessário.</small>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Conteúdo (Aceita HTML Básico):</label>
                            <textarea 
                                name="conteudo" 
                                value={currentContent.conteudo} 
                                onChange={(e) => setCurrentContent({...currentContent, conteudo: e.target.value})}
                                style={{...styles.input, height: '300px'}} required 
                            />
                        </div>

                         <div style={styles.formGroup}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="is_publico" 
                                    checked={currentContent.is_publico} 
                                    onChange={(e) => setCurrentContent({...currentContent, is_publico: e.target.checked})}
                                />
                                &nbsp; Tornar Público
                            </label>
                        </div>
                        
                        <button 
                            type="submit" 
                            style={styles.button}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Salvando...' : 'Salvar Conteúdo'}
                        </button>
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContentPage;