// src/frontend/client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'white' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' },
    error: { color: 'red', marginBottom: '15px', textAlign: 'center' },
    linkText: { textAlign: 'center', marginTop: '15px' }
};

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Chama a função de login na API pública
            const response = await login(email, password);
            
            // Notifica o componente pai (App.jsx) que o login ocorreu
            onLogin(response.user);
            
            // Redireciona para a página inicial
            navigate('/');
            
        } catch (err) {
            setError(err.message || 'Falha ao tentar logar. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Acesse sua Conta</h2>
            
            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit}>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>E-mail:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={styles.input} 
                        required
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Senha:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={styles.input} 
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    style={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <p style={styles.linkText}>
                Ainda não tem conta? <Link to="/register">Cadastre-se</Link>
            </p>
        </div>
    );
};

export default LoginPage;