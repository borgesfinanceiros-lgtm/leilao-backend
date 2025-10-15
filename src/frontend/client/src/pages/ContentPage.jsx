// src/frontend/client/src/pages/ContentPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContentBySlug } from '../services/contentService';

const styles = {
    container: { maxWidth: '900px', margin: '50px auto', padding: '30px', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    header: { borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' },
    content: { lineHeight: '1.6', fontSize: '1.1em' }
};

const ContentPage = () => {
    const { slug } = useParams();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            setError(null);
            setPageContent(null);

            try {
                // Busca o conteúdo com base na slug da URL
                const data = await getContentBySlug(slug);
                setPageContent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchContent();
        }
    }, [slug]);

    if (loading) return <div style={styles.container}><h3>Carregando Conteúdo...</h3></div>;
    if (error) return <div style={styles.container}><p style={{ color: 'red' }}>Erro: {error}</p></div>;
    if (!pageContent) return <div style={styles.container}><h3>Página não encontrada.</h3></div>;

    // É CRÍTICO usar dangerouslySetInnerHTML para renderizar o HTML salvo.
    // Lembre-se: O conteúdo deve ser sanitizado no backend para evitar ataques XSS!
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>{pageContent.titulo}</h1>
            
            <div 
                style={styles.content}
                // Renderiza o HTML (conteúdo) salvo pelo Admin
                dangerouslySetInnerHTML={{ __html: pageContent.conteudo }} 
            />
        </div>
    );
};

export default ContentPage;