import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Pokebattle.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
import battleTheme from "/battle.mp3";

const Pokebattle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerPokemon, opponentPokemon } = location.state || {};

  const [playerDetails, setPlayerDetails] = useState(null);
  const [opponentDetails, setOpponentDetails] = useState(null);
  const [playerAttacks, setPlayerAttacks] = useState(false);
  const [opponentHit, setOpponentHit] = useState(false);
  const [opponentAttacks, setOpponentAttacks] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [battleWinner, setBattleWinner] = useState(null);
  const [faintedPokemon, setFaintedPokemon] = useState(null);
  const [hasLoggedResult, setHasLoggedResult] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [loadingSprites, setLoadingSprites] = useState(true);
  const [battleStarted, setBattleStarted] = useState(false);
  const hitClassPlayer = playerHit ? "hit" : "";
  const hitClassOpponent = opponentHit ? "hit" : "";
  const attackClassPlayer = playerAttacks ? "player-attack" : "";
  const attackClassOpponent = opponentAttacks ? "opponent-attack" : "";

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      if (playerPokemon) {
        try {
          const response = await fetch(playerPokemon.url);
          const data = await response.json();
          setPlayerDetails(data);
          if (opponentDetails) setLoadingSprites(false);
        } catch (error) {
          console.error("Failed to fetch player Pokémon details:", error);
        }
      }
    };

    const fetchOpponentDetails = async () => {
      if (opponentPokemon) {
        try {
          const response = await fetch(opponentPokemon.url);
          const data = await response.json();
          setOpponentDetails(data);
          if (playerDetails) setLoadingSprites(false); 
        } catch (error) {
          console.error("Failed to fetch opponent Pokémon details:", error);
        }
      }
    };

    fetchPlayerDetails();
    fetchOpponentDetails();
  }, [playerPokemon, opponentPokemon, playerDetails, opponentDetails]);

  useEffect(() => {
    if (playerDetails && opponentDetails && !loadingSprites && !battleStarted) {
      setBattleStarted(true);
    
      setTimeout(() => {
        setPlayerAttacks(true);
        setOpponentHit(true);
        setTimeout(() => {
          setPlayerAttacks(false);
          setOpponentHit(false);
        }, 500);
    
        setTimeout(() => {
          setPlayerAttacks(true);
          setOpponentHit(true);
        }, 1000);
    
        setTimeout(() => {
          setPlayerAttacks(false);
          setOpponentHit(false);
        }, 1500);
    
        setTimeout(() => {
          setPlayerAttacks(true);
          setOpponentHit(true);
        }, 2000);
    
        setTimeout(() => {
          setPlayerAttacks(false);
          setOpponentHit(false);
        }, 2500);
    
        // Opponent attack animations
        setTimeout(() => {
          setOpponentAttacks(true);
          setPlayerHit(true);
        }, 3000);
    
        setTimeout(() => {
          setOpponentAttacks(false);
          setPlayerHit(false);
        }, 3500);
    
        setTimeout(() => {
          setOpponentAttacks(true);
          setPlayerHit(true);
        }, 4000);
    
        setTimeout(() => {
          setOpponentAttacks(false);
          setPlayerHit(false);
        }, 4500);
    
        setTimeout(() => {
          setOpponentAttacks(true);
          setPlayerHit(true);
        }, 5000);
    
        setTimeout(() => {
          setOpponentAttacks(false);
          setPlayerHit(false);
        }, 5500);
    
        // Show result after attack animations
        setTimeout(() => {
          setShowResult(true);
          determineWinner();
        }, 6000);
      }, 2500); // <- 2.5s delay before battle starts
    }
    
}, [playerDetails, opponentDetails, loadingSprites, battleStarted]);


  const compareStats = (stat1, stat2) => {
    if (stat1 > stat2) return 1;
    if (stat1 < stat2) return -1;
    return 0;
  };

  const logToDatabase = async (winner, winnerPokemon, faintedPokemon, winnerSlot, faintedSlot) => {
    if (isLogged) return;
  
    const playerName = localStorage.getItem("playerName"); // Get player name
  
    try {
      let winnerPokemonSave = winner === "Draw" ? `${playerPokemon.name}, ${opponentPokemon.name}` : winnerPokemon;
      let faintedPokemonSave = winner === "Draw" ? `${playerPokemon.name}, ${opponentPokemon.name}` : faintedPokemon;
      let winnerSlotSave = winner === "Draw" ? `${playerPokemon.slotID}, ${opponentPokemon.slotID}` : winnerSlot;
      let faintedSlotSave = winner === "Draw" ? `${playerPokemon.slotID}, ${opponentPokemon.slotID}` : faintedSlot;
  
      await fetch(`${apiUrl}/temporarybattlelog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winner,
          winnerPokemon: winnerPokemonSave,
          faintedPokemon: faintedPokemonSave,
          winnerSlot: winnerSlotSave,
          faintedSlot: faintedSlotSave,
          playerName,  
          timestamp: new Date().toISOString(),
        }),
      });
  
      setIsLogged(true);
    } catch (error) {
      console.error("Failed to log single battle result:", error);
    }
  };
  

  const logFaintSlots = async (winnerSlot, faintedSlot) => {
    if (isLogged) return;
  
    const logEntry = {
      winnerSlot,
      faintedSlot,
      timestamp: new Date().toISOString(),
    };
  
    try {
      await fetch(`${apiUrl}/faintslots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      });
  
      setIsLogged(true);
    } catch (error) {
      console.error("Failed to log faint slots:", error);
    }
  };
  
  const determineWinner = async () => {
    if (hasLoggedResult) return;
  
    const playerStats = playerDetails?.stats?.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});
    const opponentStats = opponentDetails?.stats?.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});
  
    const hpComparison = compareStats(playerStats?.hp, opponentStats?.hp);
    const attackComparison = compareStats(playerStats?.attack, opponentStats?.attack);
    const speedComparison = compareStats(playerStats?.speed, opponentStats?.speed);
  
    const playerWins = [hpComparison, attackComparison, speedComparison].filter((r) => r > 0).length;
    const opponentWins = [hpComparison, attackComparison, speedComparison].filter((r) => r < 0).length;
  
    let winner;
    let faintedName;
    let winnerName;
    let faintedSlot;
    let winnerSlot;
  
    if (playerWins > opponentWins) {
      winner = "Player";
      winnerName = playerPokemon.name;
      winnerSlot = playerPokemon.slotID;
      faintedName = opponentPokemon.name;
      faintedSlot = opponentPokemon.slotID;
    } else if (opponentWins > playerWins) {
      winner = "AI";
      winnerName = opponentPokemon.name;
      winnerSlot = opponentPokemon.slotID;
      faintedName = playerPokemon.name;
      faintedSlot = playerPokemon.slotID;
    } else {
      winner = "Draw";
      winnerName = "None";
      winnerSlot = null;
      faintedName = "Both";
      faintedSlot = "Both";
    }
  
    console.log(
      `Battle Result: Winner - ${winnerName}, Fainted - ${faintedName} (Slot: ${faintedSlot}), Winner Slot: ${winnerSlot}`
    );
  
    localStorage.setItem("battleResult", JSON.stringify({
      winner,
      winnerName,
      winnerSlot,
      faintedName,
      faintedSlot,
    }));
  
    setBattleWinner(winnerName);
    setFaintedPokemon(faintedName);
  
    if (faintedSlot === "Both") {
      await logFaintSlots(playerPokemon.slotID, opponentPokemon.slotID);  
      await logFaintSlots(opponentPokemon.slotID, playerPokemon.slotID);  
    } else {
      await logFaintSlots(winnerSlot, faintedSlot); 
    }

    // Ensure logging to battle logs after determining the winner
    await logToDatabase(winner, winnerName, faintedName, winnerSlot, faintedSlot);
  
    setHasLoggedResult(true);
  
    setTimeout(() => {
      setShowResult(true);
    }, 1500);
  };
  
  useEffect(() => {
    setIsAudioPlaying(true);
    return () => {
      setIsAudioPlaying(false);
    };
  }, []);


  if (loadingSprites) {
    return <div>Loading...</div>;
  }

  return (
    <div className="team-solo-battle-container">
      {isAudioPlaying && (
        <audio autoPlay loop>
          <source src={battleTheme} type="audio/mp3" />
        </audio>
      )}

      <div className="team-solo-pokemon-battle">

        <div
          className={`team-solo-pokemon-side team-solo-player-side animated-slide-in-left ${attackClassPlayer} ${hitClassPlayer} ${showResult ? "no-animation" : ""}`}
        >
          <h3>You</h3>
          <img
            src={playerDetails?.sprites?.front_default}
            alt={playerDetails?.name}
            className={attackClassPlayer || hitClassPlayer}
          />
          <h4>{playerDetails?.name}</h4>
          <p>HP: {playerDetails?.stats?.find((stat) => stat.stat.name === "hp")?.base_stat}</p>
          <p>Attack: {playerDetails?.stats?.find((stat) => stat.stat.name === "attack")?.base_stat}</p>
          <p>Speed: {playerDetails?.stats?.find((stat) => stat.stat.name === "speed")?.base_stat}</p>
        </div>

        <div className="team-solo-vs-container">
          <h2>VS</h2>
        </div>


        <div
          className={`team-solo-pokemon-side team-solo-opponent-side animated-slide-in-right ${attackClassOpponent} ${hitClassOpponent} ${showResult ? "no-animation" : ""}`}
        >
          <h3>AI</h3>
          <img
            src={opponentDetails?.sprites?.front_default}
            alt={opponentDetails?.name}
            className={attackClassOpponent || hitClassOpponent}
          />
          <h4>{opponentDetails?.name}</h4>
          <p>HP: {opponentDetails?.stats?.find((stat) => stat.stat.name === "hp")?.base_stat}</p>
          <p>Attack: {opponentDetails?.stats?.find((stat) => stat.stat.name === "attack")?.base_stat}</p>
          <p>Speed: {opponentDetails?.stats?.find((stat) => stat.stat.name === "speed")?.base_stat}</p>
        </div>
      </div>

      {showResult && (
        <div className="team-solo-battle-result fade-in-result">
          <h3>
            <span  className="wins-text">{battleWinner} WINS</span>
          </h3>
          <p>
            <span className="fainted-text">{faintedPokemon}</span> has fainted!
          </p>
          <p className="press-b-text">
            Press <span className="press-b">(B)</span> to return
          </p>
        </div>
      )}
    </div>
  );
};


export default Pokebattle;
