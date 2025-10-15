// src/frontend/admin/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { login } from '../services/authService';
// Importe aqui o hook de navegação (ex: useNavigate do React Router)

const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Supondo que você usaria um hook de navegação do seu router aqui,
    // ou que a navegação será gerenciada pelo componente pai (App.jsx).
    // const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            
            // 💡 Se o login for bem-sucedido, notifica o componente principal para mudar de rota
            onLoginSuccess();
            // navigate('/dashboard'); // Exemplo de navegação
            
        } catch (err) {
            setError(err.message || 'Falha na autenticação. Verifique suas credenciais.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Painel de Acesso Admin</h2>
                
                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.group}>
                    <label>E-mail:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>
                
                <div style={styles.group}>
                    <label>Senha:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>
                
                <button type="submit" disabled={isLoading} style={styles.button}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

// Estilos básicos (seriam substituídos por CSS ou um framework)
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6' },
    form: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' },
    group: { marginBottom: '15px' },
    error: { color: 'red', marginBottom: '10px', textAlign: 'center' },
    button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default LoginPage;