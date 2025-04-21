import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Lobby.css"; 

const Lobby = () => {
  const navigate = useNavigate();

  const handleSoloBattle = () => {
    navigate("/solo-battle");
  };

  const handleQRBattle = () => {
    navigate("/qr-battle");
  };

  const handleSetup = () => {
    navigate("/playername"); 
  };

  const handlePokedex = () => {
    navigate("/pokedex");
  };

  const handleBattleLogs = () => {
    navigate("/battle-logs");
  };

  return (
    <div className="lobby2-gameboy-screen">
      <div className="lobby2-lobby-screen">
        <h1>PokeLobby</h1>
        <div className="lobby2-button-group">
          <button className="lobby2-battle-button" onClick={handleSoloBattle}>
            V.S. AI
          </button>
          <button className="lobby2-battle-button" onClick={handleQRBattle}>
            QR Battle
          </button>
          <button className="lobby2-battle-button" onClick={handleSetup}>
            Setup
          </button>
          <button className="lobby2-battle-button" onClick={handlePokedex}>
            Pokedex
          </button>
          <button className="lobby2-battle-button" onClick={handleBattleLogs}>
            Battle Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
