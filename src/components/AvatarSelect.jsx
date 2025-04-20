import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AvatarSelect.css";

import Blue from "../components/trainersprites/Blue.png";
import Green from "../components/trainersprites/green.png";
import Hiker from "../components/trainersprites/hiker.png";
import Irida from "../components/trainersprites/irida.png";
import Lusamine from "../components/trainersprites/lusamine.png";
import Red from "../components/trainersprites/red.png";


const avatarImages = {
  Red: Red,
  Blue: Blue,
  Green: Green,
  Hiker: Hiker,
  Irida: Irida,
  Lusamine: Lusamine,
};

const AvatarSelect = () => {
  const [playerName, setPlayerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";


  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    const playerId = localStorage.getItem("playerId");

    if (!storedName || !playerId) {
      navigate("/");
      return;
    }

    setPlayerName(storedName);

 
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`${apiUrl}/players/${playerId}`);
        if (!res.ok) throw new Error("Failed to fetch player");
        const player = await res.json();
        if (player.avatar) {
          setCurrentAvatar(player.avatar);
          setSelectedAvatar(player.avatar);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlayer();
  }, []);

  const handleAvatarChange = (avatarName) => {
    setSelectedAvatar(avatarName);
  };

  const handleSubmit = async () => {
    const playerId = localStorage.getItem("playerId");

    try {
      await fetch(`${apiUrl}/players/${playerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: selectedAvatar }),
      });

      localStorage.setItem("playerAvatar", selectedAvatar);
      navigate("/menu");
    } catch (error) {
      console.error("Failed to save avatar:", error);
    }
  };


  const getAvatarImage = (avatarName) => {
    return avatarImages[avatarName] || null;
  };

  return (
    <div className="avatar-select-screen">
      <h2>Welcome, {playerName}!</h2>
      <p>Select your avatar:</p>

      {}
      {selectedAvatar && (
        <div className="avatar-display-container">
          <img
            src={getAvatarImage(selectedAvatar)}
            alt={selectedAvatar}
            className="avatar-display"
          />
        </div>
      )}

      {}
      <div className="avatar-button-row">
        {Object.keys(avatarImages).map((avatarName) => (
          <button
            key={avatarName}
            className={`avatar-select-button ${
              selectedAvatar === avatarName ? "selected" : ""
            }`}
            onClick={() => handleAvatarChange(avatarName)}
          >
            {avatarName}
          </button>
        ))}
      </div>

      {}
      {selectedAvatar && (
        <button className="avatar-next-button" onClick={handleSubmit}>
          NEXT
        </button>
      )}
    </div>
  );
};

export default AvatarSelect;
