import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import "../styles/SelectionMenu.css";

const Menu = () => {
  const [team, setTeam] = useState(Array(6).fill(null));
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();

        const pokemonWithDetails = await Promise.all(data.results.map(async (pokemon) => {
          const pokemonDetails = await fetch(pokemon.url);
          const pokemonData = await pokemonDetails.json();
          return {
            name: pokemon.name,
            id: pokemonData.id,
            sprite: pokemonData.sprites.front_default,
            url: pokemon.url, 
          };
        }));

        setPokemonList(pokemonWithDetails);
        setSelectedPokemon(pokemonWithDetails[0].name);
      } catch (error) {
        console.error("Failed to fetch Pokémon list:", error);
      }
    };

    fetchPokemons();
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/team/1`);
        if (!response.ok) throw new Error("Failed to fetch team");
        const data = await response.json();
        const paddedTeam = [...data.team];
        while (paddedTeam.length < 6) paddedTeam.push(null);
        setTeam(paddedTeam);
      } catch (error) {
        console.error("Error loading team:", error);
      }
    };

    fetchTeam();
  }, []);

  const handleAddPokemonToTeam = () => {
    const pokemon = pokemonList.find((p) => p.name === selectedPokemon);
    if (!pokemon) return;
  
    const updatedTeam = [...team];
    const emptySlotIndex = updatedTeam.findIndex((p) => p === null);
  
    if (emptySlotIndex !== -1) {
      updatedTeam[emptySlotIndex] = {
        name: pokemon.name,
        id: pokemon.id,
        sprite: pokemon.sprite,
        url: pokemon.url, 
      };
      setTeam(updatedTeam);
    }
  };

  const handleRemovePokemonFromTeam = async (index) => {
    const updatedTeam = [...team];
    updatedTeam[index] = null;
    setTeam(updatedTeam);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await fetch(`${apiUrl}/team/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 1, team: updatedTeam }),
      });
    } catch (error) {
      console.error("Error saving updated team:", error);
    }
  };

  const saveTeamToServer = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await fetch(`${apiUrl}/team/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 1, team }),
      });
    } catch (error) {
      console.error("Error saving team:", error);
    }
  };

  const handleContinue = async () => {
    const hasPokemon = team.some((p) => p !== null);

    if (!hasPokemon) {
      setOpenDialog(true);
      return;
    }

    await saveTeamToServer();
    navigate("/lobby");
  };

  return (
    <div className="menu-screen">
      <div className="menu-content">
        <h2>Manage Team</h2>

        <div>
          <h3>Your Team:</h3> <br></br> <br></br>
          <div className="team-container">
            {team.map((pokemon, index) => (
              <div key={index} className="pokemon-slot">
                {pokemon ? (
                  <>
                    <img
                      className="pokemon-image"
                      src={pokemon.sprite}
                      alt={pokemon.name}
                    />
                    <span>{pokemon.name}</span> 
                  </>
                ) : (
                  `Slot ${index + 1}`
                )}
                {pokemon && (
                  <button
                    className="remove-button"
                    onClick={() => handleRemovePokemonFromTeam(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <h3>Select Pokémon:</h3>
        <select
          className="pokemon-dropdown"
          value={selectedPokemon}
          onChange={(e) => setSelectedPokemon(e.target.value)}
        >
          {pokemonList.map((pokemon, index) => (
            <option key={index} value={pokemon.name}>
              {pokemon.name}
            </option>
          ))}
        </select>

        <div className="button-group">
          <button className="add-to-team-button" onClick={handleAddPokemonToTeam}>
            RECRUIT
          </button>
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>

      <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">Team Alert</Dialog.Title>
            <Dialog.Description className="dialog-description">
              You must recruit at least one Pokémon before continuing!
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="dialog-close-button">OK</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Menu;
