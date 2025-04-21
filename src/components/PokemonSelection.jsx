import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import * as Dialog from '@radix-ui/react-dialog';
import '../styles/PokemonSelection.css';

const PokemonSelection = () => {
  const { battleId } = useParams();
  const location = useLocation();
  const role = location.state?.role;
  const navigate = useNavigate(); 

  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState(() => {
    const storedPokemons = JSON.parse(localStorage.getItem(`selectedPokemons_${battleId}`));
    return storedPokemons || [
      { id: 1, pokemon: null },
      { id: 2, pokemon: null },
      { id: 3, pokemon: null },
      { id: 4, pokemon: null },
      { id: 5, pokemon: null },
      { id: 6, pokemon: null }
    ];
  });
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const [isReady, setIsReady] = useState(false);
  const [battleStatus, setBattleStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await response.json();
      setPokemonList(data.results);
    };
    fetchPokemons();
  }, []);

  useEffect(() => {
    const fetchBattleData = async () => {
      const response = await fetch(`${apiUrl}/battles/${battleId}`);
      const battleData = await response.json();
      if (battleData) {
        setBattleStatus(battleData);
        const player = battleData.players.find(p => p.role === role);
        if (player) {
          setShufflesLeft(battleData.readyStatus[role] ? 0 : 3);
        }
      }
    };
    fetchBattleData();
  }, [battleId, role]);

  useEffect(() => {
    const fetchReadinessData = async () => {
      const response = await fetch(`${apiUrl}/readiness?battleId=${battleId}&role=${role}`);
      const readinessData = await response.json();
      if (readinessData.length > 0 && readinessData[0].readyStatus) {
        setIsReady(true);
      }
    };
    fetchReadinessData();
  }, [battleId, role]);

  const handleSelectPokemon = (index, pokemon) => {
    if (!pokemon) return;

    const pokemonId = getPokemonIdFromUrl(pokemon.url);

    const newSelectedPokemons = [...selectedPokemons];
    newSelectedPokemons[index].pokemon = {
      ...pokemon,
      uniqueID: Date.now() + Math.random(),
      pokemonID: pokemonId,
    };

    setSelectedPokemons(newSelectedPokemons);
    localStorage.setItem(`selectedPokemons_${battleId}`, JSON.stringify(newSelectedPokemons));
    setDropdownVisible(null);
  };

  const handleShuffle = async () => {
    if (hasShuffled || shufflesLeft <= 0) return;

    const newSelectedPokemons = [...selectedPokemons];
    for (let i = 3; i < 6; i++) {
      let randomPokemon;
      do {
        randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
      } while (isAlreadySelected(randomPokemon.name));

      // Use the true Pokémon ID from the API instead of randomizing the ID
      const pokemonId = getPokemonIdFromUrl(randomPokemon.url);
      newSelectedPokemons[i].pokemon = {
        ...randomPokemon,
        pokemonID: pokemonId,
        uniqueID: Date.now() + Math.random(),
      };
    }

    setSelectedPokemons(newSelectedPokemons);

    // After updating the state, update shufflesLeft
    const newShufflesLeft = shufflesLeft - 1;
    setShufflesLeft(newShufflesLeft);

    localStorage.setItem(storageKey, newShufflesLeft);
    localStorage.setItem(`selectedPokemons_${battleId}`, JSON.stringify(newSelectedPokemons));

    setHasShuffled(true);

    // Update the battle status
    await fetch(`${apiUrl}/battles/${battleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hasShuffled: true }),
    });

    // Refresh the page
    window.location.reload();
  };

  const handleReady = async () => {
    const selectedPokemonsData = selectedPokemons
      .filter(slot => slot.pokemon)
      .map(slot => ({
        pokemonID: slot.pokemon.pokemonID,
        name: slot.pokemon.name,
      }));

    if (selectedPokemonsData.length === 0) {
      setIsModalOpen(true); // Open modal if no Pokémon are selected
      return;
    }

    const readinessData = {
      battleId: battleId,
      role: role,
      readyStatus: true,
      timestamp: new Date().toISOString(),
      selectedPokemons: selectedPokemonsData,
    };

    try {
      const response = await fetch(`${apiUrl}/readiness`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(readinessData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create readiness entry: ${errorText}`);
      }

      const data = await response.json();
      setIsReady(true);

      const updatedBattleStatus = {
        ...battleStatus,
        readyStatus: {
          ...battleStatus.readyStatus,
          [role]: true,
        },
        matchready: {
          ...battleStatus.matchready,
          [role]: true,
        },
        selectedPokemons: selectedPokemonsData,
      };

      const updateResponse = await fetch(`${apiUrl}/battles/${battleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBattleStatus),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update battle readiness');
      }

      const updatedData = await updateResponse.json();

      console.log('Redirecting to BattleArena...');
      navigate(`/battleArena/${battleId}`, {
        state: { role },
      });
    } catch (error) {
      console.error("Error creating readiness entry:", error);
    }
  };

  const isAlreadySelected = (name) =>
    selectedPokemons.some(slot => slot.pokemon?.name === name);

  return (
    <div className="pokemon-selection-gameboy-screen">
      <div className="pokemon-selection-menu-screen">
        <br />

        {!isReady ? (
          <button className="ready-button" onClick={handleReady}>
            READY
          </button>
        ) : (
          <button
            className="ready-button"
            onClick={() => navigate(`/battleArena/${battleId}`, {
              state: { role }
            })}
          >
            ENTER BATTLE
          </button>
        )}

        <h2>Pokémon Selection for {role}</h2>

        <div className="pokemon-selection-grid">
          {selectedPokemons.map((slot, index) => (
            <div
            key={slot.id}
            className={`pokemon-selection-slot ${slot.pokemon ? 'filled' : ''}`}
            onClick={() => setDropdownVisible(index)}
          >
            {dropdownVisible === index ? (
              <select
                value={slot.pokemon?.name || ""}
                onChange={(e) => {
                  handleSelectPokemon(
                    index,
                    pokemonList.find(p => p.name === e.target.value)
                  );
                }}
                onBlur={() => setDropdownVisible(null)} 
                autoFocus
              >
                <option value="">Select a Pokémon</option>
                {pokemonList.map(pokemon => (
                  <option key={pokemon.name} value={pokemon.name}>
                    {pokemon.name}
                  </option>
                ))}
              </select>
            ) : (
              <span>{slot.pokemon ? slot.pokemon.name : "Empty"}</span>
            )}
          </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', position: 'relative', top: '10px' }}>
  <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
    {selectedPokemons
      .map((slot, index) => (
        <img
          key={slot.id || index} 
          src={
            slot.pokemon
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(slot.pokemon.url)}.png`
              : "https://i.imgur.com/qFmcbT0.png" 
          }
          alt={slot.pokemon ? slot.pokemon.name : "Empty Slot"}
          className="pokemon-image"
        />
      ))}
  </div>
</div>


        {}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">No Pokémon Selected</Dialog.Title>
            <Dialog.Description className="dialog-description">
              You must select at least one Pokémon before continuing to the battle arena.
            </Dialog.Description>
            <Dialog.Close className="dialog-close-button">Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </div>
  );
};

function getPokemonIdFromUrl(url) {
  if (!url || typeof url !== 'string') {
    console.error('Invalid URL:', url); 
    return null;
  }
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? match[1] : null;
}

export default PokemonSelection;
