import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import "./../styles/SelectionMenu.css";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";

const SoloBattle = () => {
  const [opponentTeam, setOpponentTeam] = useState(Array(6).fill(null));
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedOpponentPokemon, setSelectedOpponentPokemon] = useState("");
  const [selectedOpponentPokemonId, setSelectedOpponentPokemonId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFullTeamDialogOpen, setIsFullTeamDialogOpen] = useState(false); 
  const navigate = useNavigate();
  const [openSelectionModal, setOpenSelectionModal] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const saveOpponentTeamToDatabase = async (team) => {
    try {
      const response = await fetch(`${apiUrl}/opponent-team`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to save opponent team: ${errorMessage}`);
      }

      console.log("Opponent team saved to database successfully.");
    } catch (error) {
      console.error("Error saving opponent team to database:", error);
    }
  };

  const removeOpponentTeamFromDatabase = async () => {
    try {
      const response = await fetch(`${apiUrl}/opponent-team`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to remove opponent team: ${errorMessage}`);
      }

      console.log("Opponent team removed from database successfully.");
    } catch (error) {
      console.error("Error removing opponent team from database:", error);
    }
  };

  useEffect(() => {
    const savedOpponentTeam = localStorage.getItem("opponentTeam");
    if (savedOpponentTeam) {
      setOpponentTeam(JSON.parse(savedOpponentTeam));
    }

    const fetchPokemons = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!response.ok) throw new Error("Failed to fetch Pokémon data");
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
      saveOpponentTeamToDatabase(updatedOpponentTeam);
    } else {
      setIsFullTeamDialogOpen(true); // Show full team modal
    }
  };

  const handleRemoveOpponentPokemon = (index) => {
    const updatedOpponentTeam = [...opponentTeam];
    updatedOpponentTeam[index] = null;
    setOpponentTeam(updatedOpponentTeam);
    localStorage.setItem("opponentTeam", JSON.stringify(updatedOpponentTeam));
    saveOpponentTeamToDatabase(updatedOpponentTeam);
  };

  const handleContinue = () => {
    if (opponentTeam.every((pokemon) => pokemon === null)) {
      setIsDialogOpen(true);
      return;
    }

    navigate("/battle", { state: { opponentTeam } });
  };

  const handleClearOpponentTeam = () => {
    setOpponentTeam(Array(6).fill(null));
    localStorage.removeItem("opponentTeam");
    removeOpponentTeamFromDatabase();
  };

  return (
    <div className="menu-screen">
      <div className="menu-content">
        <h2>Manage Opponent Team</h2>

        <div>
          <h3>Opponent's Team:</h3>
          <div className="team-container">
            {opponentTeam.map((pokemon, index) => (
              <div key={index} className="pokemon-slot">
                {pokemon ? (
                  <>
                    <img
                      className="pokemon-image"
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                      alt={pokemon.name}
                    />
                    <div>{pokemon.name}</div>
                  </>
                ) : `Slot ${index + 1}`}
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
        <button className="open-modal-button" onClick={() => setOpenSelectionModal(true)}>
          Select Pokémon
        </button>

        <Dialog.Root open={openSelectionModal} onOpenChange={setOpenSelectionModal}>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="dialog-content pokemon-modal">
              <Dialog.Title className="dialog-title">Choose Your Pokémon</Dialog.Title>
              <div className="pokemon-scroll-container">
                <div className="pokemon-grid">
                  {pokemonList.map((pokemon) => (
                    <div
                      key={pokemon.name}
                      className="pokemon-select-card"
                      onClick={() => {
                        setSelectedOpponentPokemon(pokemon.name);
                        setSelectedOpponentPokemonId(pokemon.url.split('/')[6]);
                        setOpenSelectionModal(false);
                      }}
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`}
                        alt={pokemon.name}
                        className="pokemon-card-image"
                      />
                      <p>{pokemon.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

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


      <Dialog.Root open={isFullTeamDialogOpen} onOpenChange={setIsFullTeamDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay full-team-overlay" />
          <Dialog.Content className="dialog-content full-team-modal">
            <Dialog.Title className="dialog-title full-team-title">Team Full</Dialog.Title>
            <Dialog.Description className="dialog-description full-team-description">
            You cannot add any more Pokémon. Perhaps leave some in the daycare?
            </Dialog.Description>
            <Dialog.Close className="dialog-close-button">Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title">No opponents..</Dialog.Title>
          <Dialog.Description className="dialog-description">
            Select at least one enemy Pokémon.
          </Dialog.Description>
          <Dialog.Close className="dialog-close-button">Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default SoloBattle;
