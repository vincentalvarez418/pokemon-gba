import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import "./../styles/QRHostBattle.css";

const QRHostBattle = () => {
  const [battleId, setBattleId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const generatedBattleId = `battle-${Math.random().toString(36).substr(2, 9)}`;
    setBattleId(generatedBattleId);
    saveBattleIdToDB(generatedBattleId);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/battles?battleId=${battleId}`);
      const result = await response.json();

      if (result.length > 0 && result[0].status === "joined") {
        clearInterval(interval);
        navigate(`/battleRoom/${battleId}`, { state: { role: "Gym Leader" } });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [battleId, navigate]);

  const saveBattleIdToDB = async (battleId) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const battleData = { battleId, status: "waiting" };

    try {
      await fetch(`${apiUrl}/battles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(battleData),
      });
    } catch (error) {
      console.error("Error saving battle ID:", error);
    }
  };

  return (
    <div className="qr-host-container">
      <h2>HOST BATTLE</h2>
      {battleId && (
        <>
          <QRCode value={battleId} size={200} className="qr-code" fgColor="#000000" bgColor="#FFFFFF" />
          <br></br><br></br><br></br>
          <p>Waiting for an opponent to scan the QR code...</p>
        </>
      )}
    </div>
  );
};

export default QRHostBattle;
