import React, { useState, useRef, useEffect } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import { useNavigate } from 'react-router-dom';

const QRJoinBattle = () => {
  const [data, setData] = useState('PLEASE CONTINUE SCANNING');
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const codeReader = new BrowserQRCodeReader();

  useEffect(() => {

    codeReader.decodeFromInputVideoDevice(undefined, videoRef.current)
      .then(async (result) => {
        const scannedBattleId = result.getText();
        console.log('Scanned QR Code:', scannedBattleId);
        setData(scannedBattleId);

        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  
        const response = await fetch(`${apiUrl}/battles?battleId=${scannedBattleId}`);
        const data = await response.json();

        if (data.length > 0) {
          const battle = data[0];

          await fetch(`${apiUrl}/battles/${battle.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "joined" }),
          });

          navigate(`/battleRoom/${scannedBattleId}`, { state: { role: "Challenger" } });
        } else {
          alert("Invalid or expired QR code.");
        }
      })
      .catch(err => {
        console.error("QR scan error:", err);
      });

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      <h3>Join a Battle</h3>
      <video ref={videoRef} style={{ width: '100%' }} />
      <p>Scanned QR Code: {data}</p>
    </div>
  );
};

export default QRJoinBattle;
