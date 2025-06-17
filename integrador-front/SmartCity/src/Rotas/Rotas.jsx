import { Routes, Route } from 'react-router-dom';
import { Home } from '../Paginas/Home';
import { Login } from '../Paginas/Login';
import { Sensores } from '../Paginas/Sensores';



export function Rotas() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Sensores' element={<Sensores />} />

        </Routes >
    )
}