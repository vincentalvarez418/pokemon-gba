import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/QRBattle.css";

const QRHistory = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [groupedResults, setGroupedResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBattleResults = async () => {
      try {
        const response = await fetch(`${apiUrl}/battleResults`);
        const data = await response.json();

        const grouped = data.reduce((acc, result) => {
          const { battleId, winnerTrainer, attackerTrainer, defenderTrainer } = result;

          if (!acc[battleId]) {
            acc[battleId] = {
              trainers: new Set([attackerTrainer, defenderTrainer]),
              scores: {},
            };
          }

          acc[battleId].scores[winnerTrainer] = (acc[battleId].scores[winnerTrainer] || 0) + 1;

          return acc;
        }, {});

        const formattedResults = Object.entries(grouped).map(([battleId, { trainers, scores }]) => {
          const trainerArray = Array.from(trainers);
          return {
            battleId,
            trainer1: trainerArray[0],
            trainer2: trainerArray[1],
            score1: scores[trainerArray[0]] || 0,
            score2: scores[trainerArray[1]] || 0,
          };
        });

        setGroupedResults(formattedResults);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching battle results:", error);
        setLoading(false);
      }
    };

    fetchBattleResults();
  }, []);

  return (
    <div className="qr-battle-container">
      <h2>QR Match History</h2>
      <hr className="qr-hr" />

      {loading ? (
        <p>Loading history...</p>
      ) : groupedResults.length === 0 ? (
        <p>No match history available.</p>
      ) : (
        <div className="qr-history-list">
          {groupedResults.map(({ battleId, trainer1, trainer2, score1, score2 }) => (
            <div key={battleId} className="qr-history-item">
              <strong>{trainer1}</strong>: {score1} | <strong>{trainer2}</strong>: {score2} <br />
              <small>Battle ID: {battleId}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QRHistory;
