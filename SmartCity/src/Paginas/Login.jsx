import { NavBar } from '../Componentes/NavBar';
import { useNavigate } from 'react-router-dom';
import { FormLogin } from '../Componentes/FormLogin';

export function Login() {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        console.log('Login bem-sucedido');
        navigate('/');
    };

    return (
        <div>
            <NavBar />
            <FormLogin onLoginSuccess={handleLoginSuccess} />
        </div>
    );
}