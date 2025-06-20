import "./NavBar.css";
import Logo from "../assets/Logo.png";
import icone from "../assets/icone.png";
import { Link } from 'react-router-dom'; 


export function NavBar() {
  return (
    <nav  className="navbar" aria-label="Barra de navegação principal">
        <Link to="/"><img src={Logo} alt="logo smart city com um icone de nuvem" /></Link>
      <ul>
        <li><Link to="/Sensores"> Sensores</Link></li>
        <li><Link to="/Ambientes">Ambiente</Link></li>
        <li><Link to="/Historicos">Historico</Link></li>
        <li>
          <Link to="/Login"  className="login-link">
              <img src={icone} alt="icone de pessoa" className="login-link"/>Login
         </Link>
         </li>
      </ul>
    </nav>
  );
}
