import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BattleLogicModal from "./BattleLogicModal";
import "./../styles/Gameboy.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Gameboy = () => {
  const location = useLocation();
  const [tiltEffect, setTiltEffect] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReturnTextVisible, setIsReturnTextVisible] = useState(false);
  const [canPressB, setCanPressB] = useState(true);
  const [refreshBattleView, setRefreshBattleView] = useState(false); // Add state to trigger refresh
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  useEffect(() => {
    if (location.pathname === "/pokebattle") {
      setIsReturnTextVisible(true);
      const timer = setTimeout(() => {
        setCanPressB(true);
      }, 9000);

      setCanPressB(false);
      return () => clearTimeout(timer);
    } else {
      setIsReturnTextVisible(false);
      setCanPressB(true);
    }
  }, [location.pathname]);

  const handleButtonClick = async (direction) => {
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
        if (location.pathname === "/battle") {
          try {
            const response = await fetch(`${apiUrl}/faintslots`);
            const faintslots = await response.json();

            const deletePromises = faintslots.map((slot) =>
              fetch(`${apiUrl}/faintslots/${slot.id}`, {
                method: "DELETE",
              })
            );

            await Promise.all(deletePromises);
            console.log("Faint slots wiped successfully!");

            // Trigger refresh in BattleView component after 1 second
            setTimeout(() => {
              setRefreshBattleView((prev) => !prev); // Toggle the state to trigger refresh
              setTiltEffect(""); // Reset tilt effect (remove spin)
            }, 1000); // Wait 1 second before triggering the refresh
          } catch (error) {
            console.error("Error wiping faint slots:", error);
          }
        }
        break;

      case "b":
        if (canPressB) {
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
        {isHome ? (
          <div className="retro-title-container">
            <h1 className="retro-title">Pokemon Retro Edition</h1> <br></br> <br></br>
            <p className="press-start">Press Start</p>
          </div>
        ) : (
          <Outlet />
        )}
          {location.pathname === "/pokebattle" && isReturnTextVisible && (
            <div className="return-text"></div>
          )}
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
          <div key={i} className="grill-line" onClick={handleGrillLineClick} />
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
          <div
            className="button b"
            onClick={() => handleButtonClick("b")}
            style={{ pointerEvents: canPressB ? "auto" : "none" }}
          >
            B
          </div>
        </div>
      </div>

      <BattleLogicModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Gameboy;
