import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/FindMon.css";

const FindMon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [highestAtkPokemon, setHighestAtkPokemon] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (windowWidth <= 1000) {
      navigate("/");
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth, navigate]);

  const fetchRandomPokemon = async () => {
    try {
      const randomIds = [];
      while (randomIds.length < 3) {
        const randomId = Math.floor(Math.random() * 151) + 1;
        if (!randomIds.includes(randomId)) randomIds.push(randomId);
      }

      const pokemonData = await Promise.all(
        randomIds.map((id) =>
          axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.data)
        )
      );

      const highestAtk = pokemonData.reduce((max, pokemon) => {
        const attackStat = pokemon.stats.find(stat => stat.stat.name === "attack").base_stat;
        if (attackStat > max.attack) {
          return { pokemon, attack: attackStat };
        }
        return max;
      }, { attack: 0 });

      setHighestAtkPokemon(highestAtk.pokemon);
      setPokemon(pokemonData);
      setSelectedPokemon(null);
      setIsGameOver(false);
    } catch (error) {
      console.error("Error fetching Pokémon data", error);
    }
  };

  const handlePlayAgain = () => {
    fetchRandomPokemon();
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  const handleSelectPokemon = (pokemon) => {
    setSelectedPokemon(pokemon);
    setIsGameOver(true);
  };

  return (
    <div className="findmon">
      <h1>Guess The Pokémon!</h1>
      <p>
        Welcome to FindMon, a thrilling mini-game where your Poké-knowledge is put to the test!
        You’ll be presented with three mysterious Pokémon. Your mission: identify which one
        packs the biggest punch—literally. Only one has the highest base attack stat. Choose wisely,
        and you’ll be crowned a true Pokémon stat master!
      </p>
    <hr></hr>
    <br></br> 
    <br></br>

      <div className="findmon-content">
        <div className="findmon-cards">
          {pokemon.map((mon, index) => (
            <div
              key={index}
              className="findmon-card"
              onClick={() => handleSelectPokemon(mon)}
            >
              <img src={mon.sprites.front_default} alt={mon.name} />
              <h3>{mon.name}</h3>
            </div>
          ))}
        </div>

        <div className="result">
          {!isGameOver ? (
            <p>Waiting for your selection...</p>
          ) : selectedPokemon === highestAtkPokemon ? (
            <p className="correct">Correct! You selected the Pokémon with the highest attack!</p>
          ) : (
            <p className="incorrect">Incorrect! That wasn’t the strongest—better luck next time!</p>
          )}
        </div>

        <div className="play-again-container">
          <button className="play-again" onClick={handlePlayAgain}>
            {isGameOver ? 'PLAY AGAIN' : 'REFRESH'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindMon;
