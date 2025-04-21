import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qrIcon from './../assets/icons/qr-code.png';
import joinIcon from './../assets/icons/join.png';
import "./../styles/QRBattle.css";

const QRBattle = () => {
  const navigate = useNavigate();

  const handleHostBattle = () => {
    navigate("/qr-battle/host");
  };

  const handleJoinBattle = () => {
    navigate("/qr-battle/join");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const tag = event.target.tagName.toLowerCase();
      if (event.key === "Backspace" && (tag !== "input" && tag !== "textarea")) {
        event.preventDefault();
      }
    };

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="qr-battle-container">
      <div className="qr-battle-entrance">
          <h2>QR BATTLE</h2>
        </div>

  <div className="qr-battle-buttons">
    <button className="qr-battle-button host" onClick={handleHostBattle}>
      <img src={qrIcon} alt="QR Code" className="qr-icon host-icon" />
      <span>HOST</span>
    </button>

    <button className="qr-battle-button join" onClick={handleJoinBattle}>
      <img src={joinIcon} alt="Join Battle" className="qr-icon join-icon" />
      <span>JOIN/SCAN</span>
    </button>

    <div className="qr-history-button-wrapper">
      <button
        className="qr-history-button"
        onClick={() => navigate("/qr-battle/history")}
      >
        QR Match History
      </button>
    </div>
  </div>
</div>

  );
};

export default QRBattle;
