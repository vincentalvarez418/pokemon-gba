import * as Dialog from "@radix-ui/react-dialog";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Gameboy.css";
import { v4 as uuidv4 } from 'uuid';

const PlayerName = () => {
  const [name, setName] = useState("");
  const [playerId, setPlayerId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);  
  const navigate = useNavigate();

  useEffect(() => {
    const savedPlayerId = localStorage.getItem("playerId");
    if (!savedPlayerId) {
      const newPlayerId = uuidv4();
      localStorage.setItem("playerId", newPlayerId);
      setPlayerId(newPlayerId);
    } else {
      setPlayerId(savedPlayerId);
    }
  }, []);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/players`);
        if (!response.ok) throw new Error("Failed to fetch players");
        const players = await response.json();
        const existingPlayer = players.find(player => player.id === playerId);

        if (existingPlayer) {
          setName(existingPlayer.name); 
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    if (playerId) {
      fetchPlayerData();
    }
  }, [playerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.trim()) {
      localStorage.setItem("playerName", name);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/players`);
        if (!response.ok) throw new Error("Failed to fetch players");

        const players = await response.json();
        const existingPlayer = players.find(player => player.name === name);

        if (existingPlayer) {
          setOpenDialog(true);
          return;
        }

        const createResponse = await fetch(`${apiUrl}/players`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: playerId, name }),
        });

        if (!createResponse.ok) {
          throw new Error("Failed to save player name in the database");
        }

        navigate("/menu");
      } catch (error) {
        console.error("Error saving player entry:", error);
      }
    }
  };

  return (
    <div className="player-name-screen">
      <h2>TRAINER NAME</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="playername-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <button className="playername-continue" type="submit">
          START
        </button>
      </form>

      <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title">Name Taken</Dialog.Title>
          <Dialog.Description className="dialog-description">
            This name is already taken. Please choose another name.
          </Dialog.Description>
          <Dialog.Close className="dialog-close-button">OK</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default PlayerName;
