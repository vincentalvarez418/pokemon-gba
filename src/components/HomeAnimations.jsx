import React from 'react';
import bulbasaurrun from '../assets/bulbasaurrun.gif';
import pikachurun from '../assets/pikachu.gif';
import bird from '../assets/birds.gif';
import '../styles/HomeAnimations.css';

const HomeAnimations = () => {
  return (
    <div className="animation-container">
      <img src={bulbasaurrun} alt="Bulbasaur Running" className="bulbasaur-gif" />
      <img src={pikachurun} alt="Pikachu Running" className="pikachu-gif" />
      <img src={bird} alt="Bird Flying" className="bird-gif bird-one" />
      <img src={bird} alt="Bird Flying" className="bird-gif bird-two" />
    </div>
  );
};

export default HomeAnimations;
