import "./NavBar.css";
import Logo from "../assets/Logo.png";
import icone from "../assets/icone.png";
import { Link } from 'react-router-dom'; 


export function NavBar() {
  return (
    <nav className="navbar">
        <Link to="/"><img src={Logo} alt="logo smart city com um icone de nuvem" /></Link>
      <ul>
        <li><Link to="/Login"> <img src={icone} alt="icone de pessoa"/>Login</Link></li>
      </ul>
    </nav>
  );
}
