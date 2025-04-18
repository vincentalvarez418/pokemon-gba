import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import "./../styles/SelectionMenu.css";

const SoloBattle = () => {
  const [opponentTeam, setOpponentTeam] = useState(Array(6).fill(null));
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedOpponentPokemon, setSelectedOpponentPokemon] = useState("");
  const [selectedOpponentPokemonId, setSelectedOpponentPokemonId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Function to save opponent team to database
  const saveOpponentTeamToDatabase = async (team) => {
    try {
      const response = await fetch(`${apiUrl}/opponent-team`, {
        method: "PUT", // Use PUT to update the existing opponent team
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team }),
      });

      if (!response.ok) {
        throw new Error("Failed to save opponent team to the database");
      }

      console.log("Opponent team saved to database successfully.");
    } catch (error) {
      console.error("Error saving opponent team to database:", error);
    }
  };

  // Function to delete opponent team from the database
  const removeOpponentTeamFromDatabase = async () => {
    try {
      const response = await fetch(`${apiUrl}/opponent-team`, {
        method: "DELETE", // Use DELETE to remove the opponent team
      });

      if (!response.ok) {
        throw new Error("Failed to remove opponent team from the database");
      }

      console.log("Opponent team removed from database successfully.");
    } catch (error) {
      console.error("Error removing opponent team from database:", error);
    }
  };

  useEffect(() => {
    const savedOpponentTeam = JSON.parse(localStorage.getItem("opponentTeam"));
    if (savedOpponentTeam) {
      setOpponentTeam(savedOpponentTeam);
    }

    const fetchPokemons = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();
        setPokemonList(data.results);
        const firstPokemon = data.results[0];
        setSelectedOpponentPokemon(firstPokemon.name);
        setSelectedOpponentPokemonId(firstPokemon.url.split('/')[6]);
      } catch (error) {
        console.error("Failed to fetch Pokémon list:", error);
      }
    };

    fetchPokemons();
  }, []);

  const handleAddOpponentPokemon = () => {
    const pokemon = pokemonList.find((p) => p.name === selectedOpponentPokemon);
    if (!pokemon) return;

    const updatedOpponentTeam = [...opponentTeam];
    const emptySlotIndex = updatedOpponentTeam.findIndex((p) => p === null);

    if (emptySlotIndex !== -1) {
      const uniquePokemon = { ...pokemon, id: selectedOpponentPokemonId };
      updatedOpponentTeam[emptySlotIndex] = uniquePokemon;
      setOpponentTeam(updatedOpponentTeam);
      localStorage.setItem("opponentTeam", JSON.stringify(updatedOpponentTeam));
      saveOpponentTeamToDatabase(updatedOpponentTeam); // Save to database
    } else {
      alert("Opponent's team is already full!");
    }
  };

  const handleRemoveOpponentPokemon = (index) => {
    const updatedOpponentTeam = [...opponentTeam];
    updatedOpponentTeam[index] = null;
    setOpponentTeam(updatedOpponentTeam);
    localStorage.setItem("opponentTeam", JSON.stringify(updatedOpponentTeam));
    saveOpponentTeamToDatabase(updatedOpponentTeam); // Save to database
  };

  const handleContinue = () => {
    if (opponentTeam.every(pokemon => pokemon === null)) {
      setIsDialogOpen(true);
      return;
    }

    navigate("/battle", { state: { opponentTeam } });
  };

  const handleClearOpponentTeam = () => {
    setOpponentTeam(Array(6).fill(null));
    localStorage.removeItem("opponentTeam");
    removeOpponentTeamFromDatabase(); // Remove from database
  };

  return (
    <div className="menu-screen">
      <div className="menu-content">
        <h2>Manage Opponent Team</h2>

        <div>
          <h3>Opponent's Team:</h3>
          <br />
          <div className="team-container">
            {opponentTeam.map((pokemon, index) => (
              <div key={index} className="pokemon-slot">
                {pokemon ? pokemon.name : `Slot ${index + 1}`}
                {pokemon && (
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveOpponentPokemon(index)}
                    title="Remove"
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
          value={selectedOpponentPokemon}
          onChange={(e) => {
            const selectedPokemon = pokemonList.find(p => p.name === e.target.value);
            setSelectedOpponentPokemon(e.target.value);
            setSelectedOpponentPokemonId(selectedPokemon.id);
          }}
        >
          {pokemonList.map((pokemon, index) => (
            <option key={index} value={pokemon.name}>
              {pokemon.name}
            </option>
          ))}
        </select>
        <br />

        <div className="button-group">
          <button className="add-to-team-button" onClick={handleAddOpponentPokemon}>
            RECRUIT
          </button>
          <button className="continue-button" onClick={handleContinue}>
            BATTLE
          </button>
          <button className="clear-team-button" onClick={handleClearOpponentTeam}>
            CLEAR TEAM
          </button>
        </div>
      </div>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title">No opponents..</Dialog.Title>
          <Dialog.Description className="dialog-description">
            Select at least one enemy pokemon.
          </Dialog.Description>
          <Dialog.Close className="dialog-close-button">
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default SoloBattle;
