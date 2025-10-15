// src/frontend/admin/src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, logout } from './services/authService';

// Páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // Será criado
import AuctionsPage from './pages/AuctionsPage'; // Futuro
import ContentPage from './pages/ContentPage';   // Futuro

// Layouts e Componentes
import AdminLayout from './components/AdminLayout'; // Será criado

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
    // Usamos o estado para forçar o re-render após login/logout
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                {/* Rota de Login (Não protegida) */}
                <Route 
                    path="/login" 
                    element={isLoggedIn ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <LoginPage onLoginSuccess={handleLoginSuccess} />
                    )} 
                />
                
                {/* Rotas Protegidas - Usam o AdminLayout */}
                <Route 
                    path="/" 
                    element={
                        <PrivateRoute>
                            {/* O children aqui é o AdminLayout */}
                            <AdminLayout onLogout={handleLogout} />
                        </PrivateRoute>
                    }
                >
                    {/* Páginas renderizadas dentro do Layout (Outlet) */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    
                    {/* Rotas futuras: */}
                    <Route path="/auctions" element={<AuctionsPage />} />
                    <Route path="/content" element={<ContentPage />} />
                    
                    {/* Rota padrão (redireciona para o dashboard se estiver logado) */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
                
            </Routes>
        </Router>
    );
};

export default App;