import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Lobby.css";

import pokedex from "../assets/lobbyicons/pokedex.png";
import battlelogs from "../assets/lobbyicons/logs.png";
import qr from "../assets/lobbyicons/qr.png";
import setup from "../assets/lobbyicons/setup.png";
import vsai from "../assets/lobbyicons/vsAI.png";
import logout from "../assets/lobbyicons/logout.png";

const Lobby = () => {
  const navigate = useNavigate();

  const handleSoloBattle = () => {
    navigate("/solo-battle");
  };

  const handleQRBattle = () => {
    navigate("/qr-battle");
  };

  const handleSetup = () => {
    navigate("/menu");
  };

  const handlePokedex = () => {
    navigate("/pokedex");
  };

  const handleBattleLogs = () => {
    navigate("/battle-logs");
  };

  const handleLogout = () => {
    localStorage.removeItem("playerName");
    localStorage.removeItem("playerId");
    localStorage.removeItem("playerAvatar");
    navigate("/");
  };

  return (
    <div className="lobby2-gameboy-screen">
      <div className="lobby2-lobby-screen">
        <h1>PokeLobby</h1>
        <div className="lobby2-button-group">
          <button className="lobby2-battle-button" onClick={handleSoloBattle}>
            <img src={vsai} alt="VS AI" className="lobby2-button-icon" />
            V.S. AI
          </button>
          <button className="lobby2-battle-button" onClick={handleQRBattle}>
            <img src={qr} alt="QR Battle" className="lobby2-button-icon" />
            QR
          </button>
          <button className="lobby2-battle-button" onClick={handleSetup}>
            <img src={setup} alt="Setup" className="lobby2-button-icon" />
            Setup
          </button>
          <button className="lobby2-battle-button" onClick={handlePokedex}>
            <img src={pokedex} alt="Pokedex" className="lobby2-button-icon" />
            Pokedex
          </button>
          <button className="lobby2-battle-button" onClick={handleBattleLogs}>
            <img src={battlelogs} alt="Battle Logs" className="lobby2-button-icon" />
            History
          </button>
          <button className="lobby2-battle-button" onClick={handleLogout}>
            <img src={logout} alt="Logout" className="lobby2-button-icon" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
