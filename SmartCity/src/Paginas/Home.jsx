import { Carrossel } from '../Componentes/Carrossel';
import { NavBar } from '../Componentes/NavBar';

export function Home() {
  return (
    <div className="pagina">
      <NavBar/>
      <Carrossel/>
    </div>
  );
}