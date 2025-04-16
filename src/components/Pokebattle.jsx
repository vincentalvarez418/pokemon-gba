import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Pokebattle.css";

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

      setPlayerAttacks(true);
      setOpponentHit(true);

      setTimeout(() => {
        setPlayerAttacks(false);
        setOpponentHit(false);
      }, 800);

      setTimeout(() => {
        setOpponentAttacks(true);
        setPlayerHit(true);
      }, 1000);

      setTimeout(() => {
        setOpponentAttacks(false);
        setPlayerHit(false);
      }, 1800);

      setTimeout(() => {
        setShowResult(true);
        determineWinner();
      }, 2200);
    }
  }, [playerDetails, opponentDetails, loadingSprites, battleStarted]);

  const compareStats = (stat1, stat2) => {
    if (stat1 > stat2) return 1;
    if (stat1 < stat2) return -1;
    return 0;
  };

  const logToDatabase = async (winner, winnerPokemon, faintedPokemon) => {
    if (isLogged) return;

    try {
      await fetch("http://localhost:3000/temporarybattlelog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winner,
          winnerPokemon,
          faintedPokemon,
          timestamp: new Date().toISOString(),
        }),
      });

      setIsLogged(true);
    } catch (error) {
      console.error("Failed to log single battle result:", error);
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

    const playerWins = [hpComparison, attackComparison, speedComparison].filter((result) => result > 0).length;
    const opponentWins = [hpComparison, attackComparison, speedComparison].filter((result) => result < 0).length;

    if (playerWins > opponentWins) {
      setBattleWinner("You Win!");
      setFaintedPokemon(opponentPokemon.name);
      await logToDatabase("Player", playerPokemon.name, opponentPokemon.name);
    } else if (opponentWins > playerWins) {
      setBattleWinner("AI Wins!");
      setFaintedPokemon(playerPokemon.name);
      await logToDatabase("AI", opponentPokemon.name, playerPokemon.name);
    } else {
      setBattleWinner("It's a Draw!");
      setFaintedPokemon(null);
      await logToDatabase("Draw", playerPokemon.name, opponentPokemon.name); // Log the draw result
    }

    setHasLoggedResult(true);
  };

  if (loadingSprites) {
    return <div>Loading...</div>;
  }

  return (
    <div className="team-solo-battle-container">
      <div className="team-solo-pokemon-battle">
        <div
          className={`team-solo-pokemon-side team-solo-player-side animated-slide-in-left ${playerAttacks ? "attack" : ""} ${playerHit ? "hit" : ""} ${showResult ? "no-animation" : ""}`}
        >
          <h3>You</h3>
          <img
            src={playerDetails?.sprites?.front_default}
            alt={playerDetails?.name}
            className={playerAttacks ? "attack" : playerHit ? "hit" : ""}
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
          className={`team-solo-pokemon-side team-solo-opponent-side animated-slide-in-right ${opponentAttacks ? "attack" : ""} ${opponentHit ? "hit" : ""} ${showResult ? "no-animation" : ""}`}
        >
          <h3>AI</h3>
          <img
            src={opponentDetails?.sprites?.front_default}
            alt={opponentDetails?.name}
            className={opponentAttacks ? "attack" : opponentHit ? "hit" : ""}
          />
          <h4>{opponentDetails?.name}</h4>
          <p>HP: {opponentDetails?.stats?.find((stat) => stat.stat.name === "hp")?.base_stat}</p>
          <p>Attack: {opponentDetails?.stats?.find((stat) => stat.stat.name === "attack")?.base_stat}</p>
          <p>Speed: {opponentDetails?.stats?.find((stat) => stat.stat.name === "speed")?.base_stat}</p>
        </div>
      </div>

      {showResult && (
  <div className="team-solo-battle-result fade-in-result">
    <h3>{battleWinner}</h3>
    {faintedPokemon && (
      <>
        <p>{faintedPokemon} has fainted!</p>
        <p className="press-b-text">Press <span className="press-b">(B)</span> to return</p>
      </>
    )}
  </div>
)}

    </div>
  );
};

export default Pokebattle;
