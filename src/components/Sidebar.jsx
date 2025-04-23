import React from 'react';
import { Link } from 'react-router-dom';
import "./../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title sidebar-title-child">
        <span className="pokemon-text">Pokémon</span> 
        <span className="spinel-text">Spinel</span>
      </h2>
      <ul className="sidebar-list">
        <li>
          <Link to="/">Gameboy</Link>
        </li>
        <li>
          <Link to="/pokepedia">About Pokémon</Link>
        </li>
        <li>
          <Link to="/about">About Pokémon Spinel</Link>
        </li>
        <li>
          <Link to="/findmon">Guess The Pokémon!</Link>
        </li>
      </ul>
      <p className="disclaimer">
        This is a non-profit fan project created for educational and entertainment purposes only. Pokémon is a registered trademark of The Pokémon Company, Game Freak, and Nintendo.
      </p>
    </div>
  );
};

export default Sidebar;
