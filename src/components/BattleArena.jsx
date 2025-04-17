import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { nanoid } from 'nanoid';
import '../styles/BattleArena.css';

const BattleArena = () => {
  const { battleId } = useParams();
  const location = useLocation();
  const role = location.state?.role;
  const navigate = useNavigate();

  const [playerPokemons, setPlayerPokemons] = useState([]);
  const [opponentPokemons, setOpponentPokemons] = useState([]);
  const [isFighting, setIsFighting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerNickname, setPlayerNickname] = useState("");
  const [opponentNickname, setOpponentNickname] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [battleComplete, setBattleComplete] = useState(false);  

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  

  const fetchPokemonStats = async (pokemonID) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
    const data = await response.json();
    return {
      hp: data.stats.find(stat => stat.stat.name === "hp").base_stat,
      attack: data.stats.find(stat => stat.stat.name === "attack").base_stat,
      speed: data.stats.find(stat => stat.stat.name === "speed").base_stat,
    };
  };
  
  
  useEffect(() => {
    const fetchReadinessData = async () => {
      try {
        const response = await fetch(`${apiUrl}/readiness?battleId=${battleId}`);
        const readinessData = await response.json();

        const player = readinessData.find(p => p.role === role);
        if (player) {
          setPlayerPokemons(player.selectedPokemons);
        }

        const opponentRole = role === "Challenger" ? "Gym Leader" : "Challenger";
        const opponent = readinessData.find(p => p.role === opponentRole);
        if (opponent) {
          setOpponentPokemons(opponent.selectedPokemons);
        }
      } catch (error) {
        console.error("Error fetching readiness data:", error);
      }
    };

    fetchReadinessData();

    const interval = setInterval(() => {
      fetchReadinessData();
    }, 5000); 

    return () => clearInterval(interval);
  }, [battleId, role]);

  const simulateBattle = async (attacker, defender) => {
    const attackerStats = await fetchPokemonStats(attacker.pokemonID);
    const defenderStats = await fetchPokemonStats(defender.pokemonID);
  
    if (!attackerStats || !defenderStats) {
      return { winner: null, loser: null }; 
    }
  
    if (attackerStats.hp !== defenderStats.hp) {
      return attackerStats.hp > defenderStats.hp
        ? { winner: attacker, loser: defender }
        : { winner: defender, loser: attacker };
    }
  
    if (attackerStats.attack !== defenderStats.attack) {
      return attackerStats.attack > defenderStats.attack
        ? { winner: attacker, loser: defender }
        : { winner: defender, loser: attacker };
    }
  
    if (attackerStats.speed !== defenderStats.speed) {
      return attackerStats.speed > defenderStats.speed
        ? { winner: attacker, loser: defender }
        : { winner: defender, loser: attacker };
    }
  
    return { winner: null, loser: null }; 
  };
  
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("battleState"));
    if (savedState) {
      setPlayerNickname(savedState.playerNickname || "");
      setOpponentNickname(savedState.opponentNickname || "");
      setIsFighting(savedState.isFighting || false);
      setBattleComplete(savedState.battleComplete || false);
    }
  }, []);
  
  
  

  const handleFight = async () => {
    if (playerPokemons.length === 0 || opponentPokemons.length === 0) {
      toast.error("Both teams must be ready!");
      return;
    }

    setIsModalOpen(true);
  };

  const handleStartBattle = async () => {
    if (!playerNickname || !opponentNickname) {
      toast.error("Please enter both nicknames.");
      return;
    }
  
    // Save to localStorage
    localStorage.setItem(
      "battleState",
      JSON.stringify({
        playerNickname,
        opponentNickname,
        isFighting: true,
        battleComplete: false,
      })
    );
  
    setIsFighting(true);
    setIsModalOpen(false);
  
    const battleLogs = [];
    let playerIndex = 0;
    let opponentIndex = 0;
  
    while (playerIndex < playerPokemons.length && opponentIndex < opponentPokemons.length) {
      const playerPoke = playerPokemons[playerIndex];
      const opponentPoke = opponentPokemons[opponentIndex];
  
      const result = await simulateBattle(playerPoke, opponentPoke);
  
      battleLogs.push({
        battleId,
        attacker: playerPoke.name,
        defender: opponentPoke.name,
        attackerTrainer: playerNickname,
        defenderTrainer: opponentNickname,
        winnerPokemon: result.winner ? result.winner.name : "None",
        winnerTrainer: result.winner
          ? result.winner === playerPoke
            ? playerNickname
            : opponentNickname
          : "None",
        timestamp: new Date().toISOString(),
      });
  
      if (result.winner === playerPoke) {
        setPlayerScore((prev) => prev + 1);
        opponentIndex++;
      } else if (result.winner === opponentPoke) {
        setOpponentScore((prev) => prev + 1);
        playerIndex++;
      } else {
        playerIndex++;
        opponentIndex++;
      }
    }
  
    try {
      for (const log of battleLogs) {
        await fetch(`${apiUrl}/battleResults`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        });
      }
      toast.success("SIMULATION OVER", {
        className: "toast-custom",
      });
  
      // Update localStorage for battle completion
      localStorage.setItem(
        "battleState",
        JSON.stringify({
          playerNickname,
          opponentNickname,
          isFighting: false,
          battleComplete: true,
        })
      );
  
      setBattleComplete(true);
    } catch (error) {
      console.error("Error posting battle results:", error);
    } finally {
      setIsFighting(false);
    }
  };
  

  const handleReturn = () => {
    localStorage.removeItem("battleState")
    localStorage.removeItem("battleData");  
    sessionStorage.removeItem("battleData");  

    setPlayerPokemons([]);
    setOpponentPokemons([]);
    setIsFighting(false);
    setIsModalOpen(false);
    setPlayerNickname("");
    setOpponentNickname("");
    setPlayerScore(0);
    setOpponentScore(0);
    setBattleComplete(false);

    navigate("/qr-battle");
  };

  return (
    <div className="battle-container">
      <div className="score-container">
        <div className="score">
          YOU: {playerScore} POINTS | OPPONENT {opponentScore} POINTS
        </div>
      </div>

      <div className="battle-field">
        <div className="pokemon-side">
          <h4>TEAM:</h4>
          {playerPokemons.length === 0 ? (
            <p>No Pokémon selected yet.</p>
          ) : (
            playerPokemons.map((pokemon, index) => (
              <div key={index} className="pokemon-card">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonID}.png`}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <h4>{pokemon.name}</h4>
              </div>
            ))
          )}
        </div>

        <div className="vs-container">
          <h2>VS</h2>
        </div>

        <div className="pokemon-side">
          <h4>OPPONENT:</h4>
          {opponentPokemons.length === 0 ? (
            <p>Opponent has not selected Pokémon yet.</p>
          ) : (
            opponentPokemons.map((pokemon, index) => (
              <div key={index} className="pokemon-card">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonID}.png`}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <h4>{pokemon.name}</h4>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter Nicknames</h3>
            <label>
              Your Nickname:
              <input
                type="text"
                value={playerNickname}
                onChange={(e) => setPlayerNickname(e.target.value)}
              />
            </label>
            <label>
              Opponent's Nickname:
              <input
                type="text"
                value={opponentNickname}
                onChange={(e) => setOpponentNickname(e.target.value)}
              />
            </label>
            <button onClick={handleStartBattle}>Start Battle</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {!isModalOpen && !battleComplete && (
        <div className="return-button-container">
          <button className="return-button" onClick={handleFight} disabled={isFighting}>
            {isFighting ? <div className="spinner"></div> : "Fight"}
          </button>
        </div>
      )}

      {battleComplete && (
        <div className="return-button-container">
          <button className="return-button" onClick={handleReturn}>
            EXIT
          </button>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar
        newestOnTop
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        icon={false}
      />
    </div>
  );
};

export default BattleArena;
