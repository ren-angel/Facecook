import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../img/Logo.png';
import './styles.css';

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={Logo} alt="Logo FaceCook" className="logo" />
        <h1 className="logo-text">FaceCook</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/adicionar" className="botao-adicionar">Adicionar</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

