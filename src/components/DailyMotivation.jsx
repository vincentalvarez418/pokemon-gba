import React, { useEffect, useState, useRef } from 'react';
import "../styles/DailyMotivation.css";

const quotes = [
  "Every great trainer knows that success isn't built in a day. It's the battles, the growth, and the journey that shape you into something stronger.",
  "Like a Pokémon evolving, each challenge you face is just another step toward becoming your best self. Embrace each transformation, no matter how small.",
  "The path to greatness is filled with obstacles, but just like a determined Pokémon, you'll find the strength to rise above and conquer whatever stands in your way.",
  "In the world of endless possibilities, don't be afraid to push yourself beyond your limits. Just like the strongest trainers, the sky's the limit when you believe in your power.",
  "Even the toughest opponents teach you something valuable. Every victory and defeat adds to your experience, making you more prepared for what's to come.",
  "Just as every Pokémon has its unique abilities, you too have your own strengths. Never doubt your potential to achieve greatness, for you're capable of more than you realize."
];

const DailyMotivation = () => {
  const [pokemon, setPokemon] = useState(null);
  const [quote, setQuote] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    const cachedHideTime = localStorage.getItem('motivationHideTime');
    const currentTime = new Date().getTime();

    if (cachedHideTime && currentTime - cachedHideTime < 24 * 60 * 60 * 1000) {
      setIsHidden(true);
      return;
    }

    if (!isHidden) {
      if (hasFetched.current) return;

      hasFetched.current = true;

      const randomPokemonId = Math.floor(Math.random() * 151) + 1;

      fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
        .then((response) => response.json())
        .then((data) => {
          setPokemon({
            name: data.name,
            image: data.sprites.front_default
          });
        })
        .catch((error) => console.error('Error fetching Pokémon:', error));

      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    }
  }, [isHidden]);

  const handleHideOverlay = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem('motivationHideTime', currentTime);
    setIsHidden(true);
  };

  return (
    !isHidden && (
      <div className="daily-motivation-overlay">
        {pokemon && (
          <div>
            <h1>DAILY POKEMON: {pokemon.name.toUpperCase()}</h1>
            <img className="motivation-pokemon-img" src={pokemon.image} alt={pokemon.name} />
            <p>{quote}</p>
            <br />
            <button className="hide-button" onClick={handleHideOverlay}>
              START
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default DailyMotivation;
