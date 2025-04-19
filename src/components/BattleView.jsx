import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BattleView.css";

const nameToIdMap = {
  bulbasaur: 1, ivysaur: 2, venusaur: 3, charmander: 4, charmeleon: 5, charizard: 6,
  squirtle: 7, wartortle: 8, blastoise: 9, caterpie: 10, metapod: 11, butterfree: 12,
  weedle: 13, kakuna: 14, beedrill: 15, pidgey: 16, pidgeotto: 17, pidgeot: 18,
  rattata: 19, raticate: 20, spearow: 21, fearow: 22, ekans: 23, arbok: 24,
  pikachu: 25, raichu: 26, sandshrew: 27, sandslash: 28, "nidoran♀": 29, nidorina: 30,
  nidoqueen: 31, "nidoran♂": 32, nidorino: 33, nidoking: 34, clefairy: 35, clefable: 36,
  vulpix: 37, ninetales: 38, jigglypuff: 39, wigglytuff: 40, zubat: 41, golbat: 42,
  oddish: 43, gloom: 44, vileplume: 45, paras: 46, parasect: 47, venonat: 48,
  venomoth: 49, diglett: 50, dugtrio: 51, meowth: 52, persian: 53, psyduck: 54,
  golduck: 55, mankey: 56, primeape: 57, growlithe: 58, arcanine: 59, poliwag: 60,
  poliwhirl: 61, poliwrath: 62, abra: 63, kadabra: 64, alakazam: 65, machop: 66,
  machoke: 67, machamp: 68, bellsprout: 69, weepinbell: 70, victreebel: 71,
  tentacool: 72, tentacruel: 73, geodude: 74, graveler: 75, golem: 76,
  ponyta: 77, rapidash: 78, slowpoke: 79, slowbro: 80, magnemite: 81, magneton: 82,
  "farfetch’d": 83, doduo: 84, dodrio: 85, seel: 86, dewgong: 87, grimer: 88,
  muk: 89, shellder: 90, cloyster: 91, gastly: 92, haunter: 93, gengar: 94,
  onix: 95, drowzee: 96, hypno: 97, krabby: 98, kingler: 99, voltorb: 100,
  electrode: 101, exeggcute: 102, exeggutor: 103, cubone: 104, marowak: 105,
  hitmonlee: 106, hitmonchan: 107, lickitung: 108, koffing: 109, weezing: 110,
  rhyhorn: 111, rhydon: 112, chansey: 113, tangela: 114, kangaskhan: 115,
  horsea: 116, seadra: 117, goldeen: 118, seaking: 119, staryu: 120,
  starmie: 121, "mr.mime": 122, scyther: 123, jynx: 124, electabuzz: 125,
  magmar: 126, pinsir: 127, tauros: 128, magikarp: 129, gyarados: 130,
  lapras: 131, ditto: 132, eevee: 133, vaporeon: 134, jolteon: 135,
  flareon: 136, porygon: 137, omanyte: 138, omastar: 139, kabuto: 140,
  kabutops: 141, aerodactyl: 142, snorlax: 143, articuno: 144, zapdos: 145,
  moltres: 146, dratini: 147, dragonair: 148, dragonite: 149, mewtwo: 150, mew: 151
};


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

  const getSpriteUrl = (name) => {
    if (!name) {
      console.error("Pokemon name is undefined:", name);
      return null;
    }
  
    const id = nameToIdMap[name.toLowerCase()];
    return id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png` : null;
  };
  

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
    }, 2500); 

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
            const spriteUrl = pokemon ? getSpriteUrl(pokemon.name) : null;
  
            return (
              <div
                key={index}
                className={`pokemon-card ${selectedOpponent?.slotID === pokemon?.slotID ? "selected" : ""} ${!pokemon ? "empty" : ""} ${isFainted ? "fainted" : ""} ${status === "won" ? "won" : ""}`}
                onClick={() => pokemon && handlePokemonClick(labeledOpponentTeam, index, false)}
                style={{ pointerEvents: isDisabled ? "none" : "auto" }}
              >
                {pokemon ? (
                  <>
                    {spriteUrl && <img src={spriteUrl} alt={pokemon.name} className="pokemon-image" />}
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
              const spriteUrl = pokemon ? getSpriteUrl(pokemon.name) : null;
  
              return (
                <div
                  key={index}
                  className={`pokemon-card ${selectedPlayer?.slotID === pokemon?.slotID ? "selected" : ""} ${!pokemon ? "empty" : ""} ${isFainted ? "fainted" : ""} ${status === "won" ? "won" : ""}`}
                  onClick={() => pokemon && handlePokemonClick(playerTeam, index, true)}
                  style={{ pointerEvents: isDisabled ? "none" : "auto" }}
                >
                  {pokemon ? (
                    <>
                      {spriteUrl && <img src={spriteUrl} alt={pokemon.name} className="pokemon-image" />}
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