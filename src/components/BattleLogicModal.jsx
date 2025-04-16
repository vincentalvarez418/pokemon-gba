import React from "react";
import "./../styles/BattleLogicModal.css";

const BattleLogicModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Battle Rules</h2>
        <p>
          1. Pokemon with Higher HP Takes 1 point.
          <br /> <br /> <br />
          2. Pokemon with Higher ATK Takes 1 Point.
          <br /> <br /> <br />
          3. Pokemon with Higher SPD Takes 1 Point.
          <br /> <br /> <br />
          Win 2 out of 3 to be the WINNER.
        </p>
        <br></br>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BattleLogicModal;
