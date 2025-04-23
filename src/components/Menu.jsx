import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import "../styles/SelectionMenu.css";

const Menu = () => {
  const [team, setTeam] = useState(Array(6).fill(null));
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  
  const [openSelectionModal, setOpenSelectionModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openFullTeamModal, setOpenFullTeamModal] = useState(false); // Full Team Modal state

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
    } else {
      setOpenFullTeamModal(true); // Open Full Team Modal if team is full
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
                      key={pokemon.id}
                      className="pokemon-select-card"
                      onClick={() => {
                        setSelectedPokemon(pokemon.name);
                        setOpenSelectionModal(false);
                      }}
                    >
                      <img src={pokemon.sprite} alt={pokemon.name} className="pokemon-card-image" />
                      <p>{pokemon.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="button-group">
          <button className="add-to-team-button" onClick={handleAddPokemonToTeam}>
            RECRUIT
          </button>
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>

      <Dialog.Root open={openFullTeamModal} onOpenChange={setOpenFullTeamModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">Team Full</Dialog.Title>
            <Dialog.Description className="dialog-description">
              You cannot add any more Pokémon. Perhaps leave some in the daycare?
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="dialog-close-button">Close</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={openAlertModal} onOpenChange={setOpenAlertModal}>
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
