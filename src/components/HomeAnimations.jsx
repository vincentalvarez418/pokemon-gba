import React, { useEffect, useState } from 'react';
import bulbasaurrun from '../assets/bulbasaurrun.gif';
import pikachurun from '../assets/pikachu.gif';
import bird from '../assets/birds.gif';
import '../styles/HomeAnimations.css';

const HomeAnimations = () => {
  const [isMaximized, setIsMaximized] = useState(true);

  useEffect(() => {
    const checkWindowSize = () => {
      const isMaximized =
        window.outerWidth - window.innerWidth < 90 && window.outerHeight - window.innerHeight < 90;

      setIsMaximized(isMaximized);
    };


    checkWindowSize();

    window.addEventListener('resize', checkWindowSize);


    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  return (
    <div className="animation-container">
      {isMaximized && (
        <>
          <img src={bulbasaurrun} alt="Bulbasaur Running" className="bulbasaur-gif" />
          <img src={pikachurun} alt="Pikachu Running" className="pikachu-gif" />
        </>
      )}
      <img src={bird} alt="Bird Flying" className="bird-gif bird-one" />
      <img src={bird} alt="Bird Flying" className="bird-gif bird-two" />
    </div>
  );
};

export default HomeAnimations;