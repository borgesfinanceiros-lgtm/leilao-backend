// src/frontend/client/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'white' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '5px' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' },
    error: { color: 'red', marginBottom: '15px', textAlign: 'center' },
    linkText: { textAlign: 'center', marginTop: '15px' }
};

const RegisterPage = ({ onLogin }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (password !== confirmPassword) {
            setError('As senhas não coincidem!');
            return;
        }

        setIsLoading(true);

        try {
            // Chama a função de registro na API pública
            const response = await register(nome, email, password);
            
            // Notifica o componente pai (App.jsx) que o login ocorreu
            onLogin(response.user); 
            
            // Redireciona para a página inicial (ou para o Dashboard do usuário)
            navigate('/');
            
        } catch (err) {
            setError(err.message || 'Falha ao registrar. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Crie sua Conta</h2>
            
            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit}>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Nome Completo:</label>
                    <input 
                        type="text" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        style={styles.input} 
                        required
                    />
                </div>
                
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
                        minLength="6"
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Confirme a Senha:</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        style={styles.input} 
                        required
                        minLength="6"
                    />
                </div>
                
                <button 
                    type="submit" 
                    style={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? 'Registrando...' : 'Criar Conta'}
                </button>
            </form>

            <p style={styles.linkText}>
                Já tem uma conta? <Link to="/login">Faça Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;