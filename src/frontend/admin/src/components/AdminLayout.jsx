// src/frontend/admin/src/components/AdminLayout.jsx

import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const styles = {
    sidebar: { width: '250px', backgroundColor: '#2c3e50', color: 'white', height: '100vh', padding: '20px', position: 'fixed' },
    link: { display: 'block', padding: '10px 0', textDecoration: 'none', color: 'white', marginBottom: '10px' },
    mainContent: { marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#ecf0f1' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #bdc3c7' }
};

const AdminLayout = ({ onLogout }) => {
    const adminName = JSON.parse(localStorage.getItem('adminUser'))?.nome || 'Administrador';
    
    return (
        <div style={{ display: 'flex' }}>
            
            {/* Sidebar (Navegação) */}
            <nav style={styles.sidebar}>
                <h3>Painel Admin</h3>
                <hr style={{ borderColor: '#34495e' }}/>
                
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/auctions" style={styles.link}>Gerenciar Leilões</Link>
                <Link to="/content" style={styles.link}>Gerenciar Conteúdo</Link>
                <Link to="/users" style={styles.link}>Gerenciar Usuários</Link>
                
                <button 
                    onClick={onLogout} 
                    style={{ ...styles.link, background: '#e74c3c', border: 'none', cursor: 'pointer', marginTop: '30px', padding: '10px' }}
                >
                    Sair
                </button>
            </nav>
            
            {/* Conteúdo Principal (Onde as páginas Dashboard, Auctions, etc. serão renderizadas) */}
            <main style={styles.mainContent}>
                <header style={styles.header}>
                    <h1>Bem-vindo(a), {adminName}</h1>
                </header>
                
                {/* O Outlet renderiza o componente da rota aninhada (DashboardPage, AuctionsPage, etc.) */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;