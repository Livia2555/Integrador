import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormLogin.css';

export function FormLogin({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);

        const response = await fetch('http://localhost:8000/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Salva token e categoria no localStorage
            localStorage.setItem('access_token', data.access);
            
            localStorage.setItem('categoria', data.usuario.categoria);
            onLoginSuccess(data.usuario.categoria); 
            console.log(onLoginSuccess);
            navigate('/')
        } else {
            setErro('Usuário ou senha inválidos');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1 className='Login'>LOGIN</h1>
                <input
                    type="text" placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password" placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className='login'>Entrar</button>
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
            </form>
        </div>
    );
}