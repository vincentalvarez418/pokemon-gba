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
  <h2>QR Battle Screen</h2>
  <p>Here you can start a battle using a QR code!</p>

  <div className="qr-battle-buttons">
    <button className="qr-battle-button host" onClick={handleHostBattle}>
      <img src={qrIcon} alt="QR Code" className="qr-icon host-icon" />
      <span>Host Battle</span>
    </button>

    <button className="qr-battle-button join" onClick={handleJoinBattle}>
      <img src={joinIcon} alt="Join Battle" className="qr-icon join-icon" />
      <span>Join Battle</span>
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
