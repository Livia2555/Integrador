import './Footer.css';
import Logo from "../assets/Logo.png";

export function Footer(){
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <img src={Logo} alt="logo smart city com um icone de nuvem" className="footer-logo" />
          <span>Senai Roberto Mange</span>
        </div>
      </div>
    </footer>
  );
}