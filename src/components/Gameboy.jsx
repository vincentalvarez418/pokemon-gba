import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BattleLogicModal from "./BattleLogicModal";
import "./../styles/Gameboy.css";

const Gameboy = () => {
  const location = useLocation();
  const [tiltEffect, setTiltEffect] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  const handleButtonClick = (direction) => {
    switch (direction) {
      case "left":
        setTiltEffect("tilt-left");
        break;
      case "right":
        setTiltEffect("tilt-right");
        break;
      case "up":
        setTiltEffect("tilt-up");
        break;
      case "down":
        setTiltEffect("tilt-down");
        break;
      case "a":
        setTiltEffect("spin");
        break;
      case "b":
        if (location.pathname === "/battle") {
          navigate("/solo-battle");
        } else if (location.pathname === "/pokebattle") {
          navigate("/battle");
        } else if (location.pathname === "/solo-battle") {
          navigate("/lobby");
        } else if (location.pathname === "/lobby") {
          navigate("/");
        } else if (location.pathname === "/battle-logs") {
          navigate("/lobby");
        } else if (location.pathname === "/qr-battle/host") {
          navigate("/qr-battle");
        } else if (location.pathname === "/qr-battle/join") {
          navigate("/qr-battle");
        } else if (location.pathname === "/qr-battle") {
          navigate("/lobby");
        } else if (location.pathname === "/qr-battle/history") {
          navigate("/qr-battle");
        } else if (
          ["/playername", "/menu", "/pokedex"].includes(location.pathname)
        ) {
          navigate(-1);
        }
        break;
      default:
        setTiltEffect("");
        break;
    }
  
    setTimeout(() => setTiltEffect(""), 500);
  };
  

  const handleGrillLineClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className={`gameboy-shell ${tiltEffect}`}>
      <div className="gameboy-screen">
        <div className="screen-inner">
          {isHome ? <h1>Pokemon Retro Edition</h1> : <Outlet />}
        </div>
      </div>

      <div className="system-buttons">
        {isHome && (
          <Link to="/playername">
            <button className="sys-button" onClick={() => handleButtonClick("a")}>
              Start
            </button>
          </Link>
        )}
      </div>

      <div className="gameboy-label">Pokemon SIM Gen 1</div>
      <div className="speaker-grill">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grill-line"
            onClick={handleGrillLineClick}
          />
        ))}
      </div>

      <div className="gameboy-controls">
        <div className="dpad">
          <div className="dpad-btn up" onClick={() => handleButtonClick("up")}></div>
          <div className="dpad-btn down" onClick={() => handleButtonClick("down")}></div>
          <div className="dpad-btn left" onClick={() => handleButtonClick("left")}></div>
          <div className="dpad-btn right" onClick={() => handleButtonClick("right")}></div>
          <div className="dpad-center"></div>
        </div>

        <div className="bottom-accents">
          <div className="accent red"></div>
          <div className="accent maroon"></div>
          <div className="accent gray"></div>
        </div>

        <div className="ab-buttons">
          <div className="button a" onClick={() => handleButtonClick("a")}>
            A
          </div>
          <div className="button b" onClick={() => handleButtonClick("b")}>
            B
          </div>
        </div>
      </div>

      <BattleLogicModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Gameboy;
