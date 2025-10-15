// src/frontend/client/src/App.jsx - Roteador Público

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { isAuthenticated, logout, getUserProfile } from './services/authService';

// Páginas Públicas
import HomePage from './pages/HomePage'; // Será a lista de leilões
import AuctionDetailPage from './pages/AuctionDetailPage'; // Detalhes e Lances
import RegisterPage from './pages/RegisterPage'; 
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage'; // Perfil, Histórico de Pagamentos, etc.
import ContentPage from './pages/ContentPage'; // Termos, Sobre, etc.

// Layout Principal
import PublicLayout from './components/PublicLayout'; // Componente de Header/Footer

const App = () => {
    const [user, setUser] = useState(getUserProfile());

    useEffect(() => {
        // Força a atualização do perfil ao carregar
        setUser(getUserProfile());
    }, []);

    const handleLogin = (newUser) => {
        setUser(newUser);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                {/* O Layout Principal envolve todas as páginas */}
                <Route path="/" element={<PublicLayout user={user} onLogout={handleLogout} />}>
                    
                    {/* Rotas Principais */}
                    <Route index element={<HomePage />} />
                    <Route path="/auctions/:id" element={<AuctionDetailPage user={user} />} />
                    
                    {/* Autenticação */}
                    <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                    {/* Rotas Protegidas (Perfil) */}
                    <Route path="/profile" element={isAuthenticated() ? <ProfilePage user={user} /> : <LoginPage onLogin={handleLogin} />} />
                    
                    {/* Conteúdo Estático (Termos, Sobre Nós) */}
                    <Route path="/pages/:slug" element={<ContentPage />} />
                    
                    {/* Rota para 404/Página não encontrada */}
                    <Route path="*" element={<h2>404 - Página Não Encontrada</h2>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;