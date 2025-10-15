// src/frontend/client/src/components/PublicLayout.jsx

import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const styles = {
    header: { 
        backgroundColor: '#34495e', 
        padding: '15px 40px', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    nav: { display: 'flex', gap: '20px' },
    link: { color: 'white', textDecoration: 'none', fontWeight: 'bold' },
    auth: { display: 'flex', gap: '10px', alignItems: 'center' },
    button: { padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

const PublicLayout = ({ user, onLogout }) => {
    return (
        <div>
            <header style={styles.header}>
                <Link to="/" style={{ ...styles.link, fontSize: '1.5em' }}>
                    Leilão.Online
                </Link>

                <div style={styles.nav}>
                    <Link to="/" style={styles.link}>Leilões Ativos</Link>
                    <Link to="/pages/termos-de-uso" style={styles.link}>Termos de Uso</Link>
                </div>
                
                <div style={styles.auth}>
                    {user ? (
                        <>
                            <Link to="/profile" style={styles.link}>
                                Olá, {user.nome || 'Usuário'}
                            </Link>
                            <button 
                                onClick={onLogout} 
                                style={{ ...styles.button, backgroundColor: '#e74c3c', color: 'white' }}
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button style={{ ...styles.button, backgroundColor: '#2ecc71', color: 'white' }}>
                                    Entrar
                                </button>
                            </Link>
                            <Link to="/register">
                                <button style={{ ...styles.button, backgroundColor: '#3498db', color: 'white' }}>
                                    Cadastrar
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* O Outlet renderiza a página específica */}
            <main style={{ padding: '40px' }}>
                <Outlet />
            </main>
            
            <footer style={{ backgroundColor: '#ccc', padding: '20px', textAlign: 'center', marginTop: '40px' }}>
                © {new Date().getFullYear()} Leilão Online. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default PublicLayout;