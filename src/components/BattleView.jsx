import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BattleView.css";

const BattleView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const savedOpponentTeam = JSON.parse(localStorage.getItem("opponentTeam")) || [];
  const { opponentTeam } = location.state || { opponentTeam: savedOpponentTeam };

  const labeledOpponentTeam = opponentTeam.map((pokemon, index) => ({
    ...pokemon,
    slotID: `enemySlot${index + 1}`,
  }));

  const [playerTeam, setPlayerTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [playerWinCount, setPlayerWinCount] = useState(0);
  const [aiWinCount, setAiWinCount] = useState(0);

  const [playerBattleStatus, setPlayerBattleStatus] = useState(() => {
    const savedStatus = JSON.parse(localStorage.getItem("playerBattleStatus"));
    return savedStatus || {};
  });

  const [opponentBattleStatus, setOpponentBattleStatus] = useState(() => {
    const savedStatus = JSON.parse(localStorage.getItem("opponentBattleStatus"));
    return savedStatus || {};
  });

  const [battleLog, setBattleLog] = useState([]);
  const [faintedSlots, setFaintedSlots] = useState([]);

  useEffect(() => {
    const fetchPlayerTeam = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/team/1`);
        const data = await response.json();
        const labeledTeam = data.team.map((pokemon, index) => ({
          ...pokemon,
          slotID: `myTeamSlot${index + 1}`,
        }));
        setPlayerTeam(labeledTeam);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch player team:", error);
      }
    };
    fetchPlayerTeam();

    const fetchBattleLog = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/battleResults`);
        const data = await response.json();
        setBattleLog(data.temporarybattlelog || []);
      } catch (error) {
        console.error("Failed to fetch battle log:", error);
      }
    };
    fetchBattleLog();

    const fetchFaintedSlots = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/faintslots`);
        const data = await response.json();
        setFaintedSlots(data);
      } catch (error) {
        console.error("Failed to fetch fainted slots:", error);
      }
    };
    fetchFaintedSlots();
  }, []);


  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/faintslots`);
        const data = await response.json();

        if (JSON.stringify(faintedSlots) !== JSON.stringify(data)) {
          setFaintedSlots(data);
        }
      } catch (error) {
        console.error("Error fetching faintslots:", error);
      }
    }, 500); 

    return () => clearInterval(interval); 
  }, [faintedSlots]);

  useEffect(() => {
    if (battleLog.length > 0) {
      const playerWins = battleLog.filter((entry) => entry.winner === "Player").length;
      const aiWins = battleLog.filter((entry) => entry.winner === "AI").length;
      setPlayerWinCount(playerWins);
      setAiWinCount(aiWins);
    }


    const logSlots = (team, battleStatus, teamName) => {
      const availableSlots = team.filter((pokemon) => {
        const status = battleStatus[pokemon?.slotID]?.status;
        const isFainted = faintedSlots.some(faint => faint.faintedSlot === pokemon?.slotID);
        return status !== "fainted" && !isFainted;
      }).length;

      const faintedSlotsCount = team.length - availableSlots;
      console.log(`${teamName} - Available Slots: ${availableSlots}, Fainted Slots: ${faintedSlotsCount}`);
    };

    // Log for player and opponent
    logSlots(playerTeam, playerBattleStatus, "Player");
    logSlots(labeledOpponentTeam, opponentBattleStatus, "AI");

  }, [battleLog, playerBattleStatus, opponentBattleStatus, playerTeam, faintedSlots, labeledOpponentTeam]);

  const handlePokemonClick = (team, index, isPlayer) => {
    const selected = team[index];
    const status = isPlayer
      ? playerBattleStatus[selected.slotID]?.status
      : opponentBattleStatus[selected.slotID]?.status;

    const isFainted = faintedSlots.some(faint => faint.faintedSlot === selected.slotID);
  
    if (status === "fainted" || status === "won" || isFainted) return; 
    if (isPlayer) {
      setSelectedPlayer({ ...selected });
    } else {
      setSelectedOpponent({ ...selected });
    }
  };

  const handleBattleConfirmation = () => {
    localStorage.setItem("battleSelection", JSON.stringify({
      playerPokemon: { ...selectedPlayer, slotID: selectedPlayer.slotID },
      opponentPokemon: { ...selectedOpponent, slotID: selectedOpponent.slotID }
    }));

    navigate("/pokebattle", {
      state: {
        playerPokemon: { ...selectedPlayer, slotID: selectedPlayer.slotID },
        opponentPokemon: { ...selectedOpponent, slotID: selectedOpponent.slotID }
      },
    });
  };

  const cancelSelection = () => {
    setSelectedPlayer(null);
    setSelectedOpponent(null);
    setShowConfirm(false);
  };

  useEffect(() => {
    if (selectedPlayer && selectedOpponent) {
      setShowConfirm(true);
    }
  }, [selectedPlayer, selectedOpponent]);

  return (
    <div className="battle-container">
      <div className="battle-field">
        <div className="pokemon-side opponent-side">
          <h3>AI</h3>
          {[...Array(6)].map((_, index) => {
            const pokemon = labeledOpponentTeam[index];
            const status = opponentBattleStatus[pokemon?.slotID]?.status;
            const isFainted = faintedSlots.some(faint => faint.faintedSlot === pokemon?.slotID);
            const isDisabled = status === "fainted" || status === "won" || isFainted;
            return (
              <div
                key={index}
                className={`pokemon-card ${selectedOpponent?.slotID === pokemon?.slotID ? "selected" : ""} ${!pokemon ? "empty" : ""} ${isFainted ? "fainted" : ""} ${status === "won" ? "won" : ""}`}
                onClick={() => pokemon && handlePokemonClick(labeledOpponentTeam, index, false)}
                style={{ pointerEvents: isDisabled ? "none" : "auto" }}
              >
                {pokemon ? (
                  <>
                    <h4>{pokemon.name}</h4>
                    {isFainted ? <p className="status-text">Fainted</p> : ""}
                  </>
                ) : (
                  <h4>Empty</h4>
                )}
              </div>
            );
          })}
        </div>

        <div className="vs-container">
          <h2>VS</h2>
        </div>

        <div className="pokemon-side player-side">
          <h3>PLAYER</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            [...Array(6)].map((_, index) => {
              const pokemon = playerTeam[index];
              const status = playerBattleStatus[pokemon?.slotID]?.status;
              const isFainted = faintedSlots.some(faint => faint.faintedSlot === pokemon?.slotID);
              const isDisabled = status === "fainted" || status === "won" || isFainted;
              return (
                <div
                  key={index}
                  className={`pokemon-card ${selectedPlayer?.slotID === pokemon?.slotID ? "selected" : ""} ${!pokemon ? "empty" : ""} ${isFainted ? "fainted" : ""} ${status === "won" ? "won" : ""}`}
                  onClick={() => pokemon && handlePokemonClick(playerTeam, index, true)}
                  style={{ pointerEvents: isDisabled ? "none" : "auto" }}
                >
                  {pokemon ? (
                    <>
                      <h4>{pokemon.name}</h4>
                      {isFainted ? <p className="status-text">Fainted</p> : ""}
                    </>
                  ) : (
                    <h4>Empty</h4>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="modal-screen">
          <div className="modal-box">
            <p>
              START BATTLE BETWEEN <strong>{selectedPlayer.name}</strong> AND{" "}
              <strong>{selectedOpponent.name}</strong>?
            </p>
            <div className="button-group">
              <button className="confirm-btn" onClick={handleBattleConfirmation}>
                START
              </button>
              <button className="cancel-btn" onClick={cancelSelection}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="return-text">TAP ON POKEMON TO SELECT</p>
      <p className="return-text">B = Return | A = Reset</p>
    </div>
  );
};

export default BattleView;
