import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const BattleRoom = () => {
  const { battleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readyStatus, setReadyStatus] = useState({ leader: false, challenger: false });

  const role = location.state?.role || "Guest";

  const isLeader = role === "Gym Leader";
  const isChallenger = role === "Challenger";

  const handleReady = async () => {
    const updatedReadyStatus = {
      leader: isLeader ? true : readyStatus.leader,
      challenger: isChallenger ? true : readyStatus.challenger,
    };

    setReadyStatus(updatedReadyStatus);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/battles?battleId=${battleId}`);
    const data = await response.json();

    if (data.length > 0) {
      const battle = data[0];

      const updatedBattle = {
        ...battle,
        ready: updatedReadyStatus,
        matchready: battle.matchready || { leader: false, challenger: false },
        leaderPokemons: battle.leaderPokemons || [null, null, null, null, null, null],
        challengerPokemons: battle.challengerPokemons || [null, null, null, null, null, null],
      };

      await fetch(`${apiUrl}/battles/${battle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBattle),
      });
    }
  };

  // Check if both players are ready and redirect
  useEffect(() => {
    if (readyStatus.leader && readyStatus.challenger) {
      navigate(`/pokemon-selection/${battleId}`, { state: { role } });
    }
  }, [readyStatus, navigate, battleId, role]);

  useEffect(() => {
    const fetchBattleData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      try {
        const response = await fetch(`${apiUrl}/battles?battleId=${battleId}`);
        const data = await response.json();

        if (data.length > 0) {
          setPlayers(data[0].players || []);
          setReadyStatus(data[0].ready || { leader: false, challenger: false });
        }
      } catch (error) {
        console.error("Error fetching battle data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBattleData();
    const interval = setInterval(fetchBattleData, 2000);
    return () => clearInterval(interval);
  }, [battleId]);

  return (
    <div>
      <h2>Battle Room</h2>
      <p>Battle ID: <strong>{battleId}</strong></p>
      <p>You are the <strong>{role}</strong>!</p>

      {loading ? (
        <p>Loading players...</p>
      ) : (
        <div>
          <h3>Current Players:</h3>
          <ul>
            <li>
              Gym Leader: {players[0] || <em>Waiting...</em>} - {readyStatus.leader ? "Ready" : "Waiting"}
            </li>
            <li>
              Challenger: {players[1] || <em>Waiting...</em>} - {readyStatus.challenger ? "Ready" : "Waiting"}
            </li>
          </ul>
          {(isLeader || isChallenger) && (
            <button
              onClick={handleReady}
              disabled={isLeader ? readyStatus.leader : readyStatus.challenger}
            >
              Ready
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BattleRoom;
