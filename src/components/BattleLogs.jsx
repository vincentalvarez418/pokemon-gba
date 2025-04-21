import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/BattleLogs.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const BattleLogs = () => {
  const [battleLogs, setBattleLogs] = useState([]);
  const [pokemonSprites, setPokemonSprites] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGen1PokemonSprites = async () => {
      const sprites = {};
      for (let i = 1; i <= 151; i++) {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
          const data = await response.json();
          sprites[data.name] = data.sprites.front_default;
        } catch (error) {
          console.error("Failed to fetch sprite for Pokémon ID:", i);
        }
      }
      setPokemonSprites(sprites);
    };
    fetchGen1PokemonSprites();
  }, []);

  useEffect(() => {
    const fetchBattleLogs = async () => {
      try {
        const response = await fetch(`${apiUrl}/temporarybattlelog`);
        const data = await response.json();
        setBattleLogs(data || []);
      } catch (error) {
        console.error("Failed to fetch battle logs:", error);
      }
    };
    fetchBattleLogs();
  }, []);

  const goBack = () => {
    navigate("/lobby");
  };

  return (
    <div className="lobby2-gameboy-screen">
      <div className="lobby2-battle-screen">
        <h1>BATTLE LOG</h1>
        <div className="battle-log-list">
          {battleLogs.length === 0 ? (
            <p>NO BATTLE LOG AVAILABLE..</p>
          ) : (
            battleLogs.map((log, index) => (
              <div key={log.id} className="battle-log-item">
                <p><strong>Battle {index + 1}</strong></p>
                <p>Winner: {log.winner}</p>
                <div className="pokemon-info">
                  {log.winner === "Draw" ? (
                    <>
                      {log.winnerPokemon.split(', ').map((pokemon, i) => (
                        pokemonSprites[pokemon] && (
                          <div key={i} className="pokemon-item">
                            <img
                              src={pokemonSprites[pokemon]}
                              alt={pokemon}
                              className="pokemon-sprite"
                            />
                            <p>Fainted</p>
                          </div>
                        )
                      ))}
                    </>
                  ) : (
                    <>
                      {pokemonSprites[log.winnerPokemon] && (
                        <div className="pokemon-item">
                          <img
                            src={pokemonSprites[log.winnerPokemon]}
                            alt={log.winnerPokemon}
                            className="pokemon-sprite"
                          />
                          <p>Winner Pokémon: {log.winnerPokemon}</p>
                        </div>
                      )}
                      {pokemonSprites[log.faintedPokemon] && (
                        <div className="pokemon-item">
                          <img
                            src={pokemonSprites[log.faintedPokemon]}
                            alt={log.faintedPokemon}
                            className="pokemon-sprite"
                          />
                          <p>Fainted Pokémon: {log.faintedPokemon}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <br /><br />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleLogs;
