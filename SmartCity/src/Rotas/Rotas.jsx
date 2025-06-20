import { Routes, Route } from 'react-router-dom';
import { Home } from '../Paginas/Home';
import { Login } from '../Paginas/Login';
import { Sensores } from '../Paginas/Sensores';
import { Ambientes } from '../Paginas/Ambientes';
import { Historicos } from '../Paginas/Historicos';



export function Rotas() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Sensores' element={<Sensores />} />
            <Route path='/Ambientes' element={<Ambientes />} />
            <Route path='/Historicos' element={<Historicos />} />

        </Routes >
    )
}