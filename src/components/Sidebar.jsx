import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./../styles/Sidebar.css";


const Sidebar = () => {
  const location = useLocation();
  const allowedPaths = ["/", "/pokepedia", "/about", "/findmon"];
  const isSidebarActiveRoute = allowedPaths.includes(location.pathname);

  return (
    <div className="sidebar">
      <h2 className="sidebar-title sidebar-title-child">
        <span className="pokemon-text">Pokémon</span> 
        <span className="spinel-text">Spinel</span>
      </h2>
      <hr className="sidebar-divider" />
      <br></br>
      <ul className="sidebar-list">
        <li>
          <Link to="/" className={isSidebarActiveRoute ? '' : 'disabled-link'}>Gameboy</Link>
        </li>
        <li>
          <Link to="/pokepedia" className={isSidebarActiveRoute ? '' : 'disabled-link'}>About Pokémon</Link>
        </li>
        <li>
          <Link to="/about" className={isSidebarActiveRoute ? '' : 'disabled-link'}>About Pokémon Spinel</Link>
        </li>
        <li>
        <Link to="/findmon" className={isSidebarActiveRoute ? '' : 'disabled-link'}>
          Guess The Pokémon!
        </Link>
      </li>
      <li>
        <a 
          href="https://github.com/vincentalvarez418/pokemon-gba" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={isSidebarActiveRoute ? 'github-link' : 'disabled-link'}
        >
          Contribute on GitHub
        </a>
      </li>

      </ul>
      <p className="disclaimer">
        This is a non-profit fan project created for educational and entertainment purposes only. Pokémon is a registered trademark of The Pokémon Company, Game Freak, and Nintendo.
      </p>
    </div>
  );
};

export default Sidebar;
