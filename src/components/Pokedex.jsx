import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Pokedex.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Pokedex = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const pokemonPromises = [];
        for (let i = 1; i <= 151; i++) {
          pokemonPromises.push(
            fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
              .then((response) => response.json())
          );
        }

        const results = await Promise.all(pokemonPromises);
        setPokemons(results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    };

    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);

    fetchPokemons();
  }, []);

  const handleFavorite = (id) => {
    const updatedFavorites = [...favorites];
    const index = updatedFavorites.findIndex((fav) => fav.id === id);

    if (index !== -1) {
      updatedFavorites.splice(index, 1);
    } else {
      updatedFavorites.push({ id, favorite: true });  
    }

    setFavorites(updatedFavorites);

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="lobby2-gameboy-screen">
      <div className="lobby2-lobby-screen">
        <h1>Pokedex</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="pokedex-list">
            {pokemons.map((pokemon) => {
              const id = pokemon.id;

              const isFavorite = favorites.some((fav) => fav.id === id);

              return (
                <div className="pokedex-entry" key={id}>
                  <div className="image-stats">
                    <div className="pokemon-image-container">
                      <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        className="pokemon-image"
                      />
                    </div>
                    <p className="pokemon-name">
                      {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </p>
                    <div className="pokemon-stats">
                      <p><strong>HP:</strong> {pokemon.stats[0].base_stat}</p>
                      <p><strong>Attack:</strong> {pokemon.stats[1].base_stat}</p>
                      <p><strong>Defense:</strong> {pokemon.stats[2].base_stat}</p>
                      <p><strong>Speed:</strong> {pokemon.stats[5].base_stat}</p>
                    </div>
                  </div>
                  <div
                    className={`favorite-star ${isFavorite ? 'favorited' : ''}`}
                    onClick={() => handleFavorite(id)}
                  >
                    ★
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pokedex;
