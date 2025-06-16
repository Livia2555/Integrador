import { Routes, Route } from 'react-router-dom';
import { Home } from '../Paginas/Home';
import { Login } from '../Paginas/Login';



export function Rotas() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Login' element={<Login />} />

        </Routes >
    )
}