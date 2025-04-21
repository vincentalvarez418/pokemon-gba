import React, { useEffect, useState } from "react";
import "../styles/RenderPinger.css";

import dancingGif from "../pingersprites/dancing.gif"; 

const RenderPinger = ({ children }) => {
  const [serverUp, setServerUp] = useState(false);
  const [dots, setDots] = useState("");
  const [statusMessage, setStatusMessage] = useState("CONNECTING TO SERVER");
  const [displayOverlay, setDisplayOverlay] = useState(true);

  const isCacheValid = () => {
    const lastConnected = localStorage.getItem("lastConnected");
    if (!lastConnected) return false;

    const timeElapsed = Date.now() - parseInt(lastConnected);
    return timeElapsed < 15 * 60 * 1000; 
  };

  const pingServer = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/pings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time: new Date().toISOString() }),
      });

      if (res.ok) {
        if (!serverUp) {
          setServerUp(true);
          setStatusMessage("WELCOME TRAINER!");
          setDots("");
          localStorage.setItem("lastConnected", Date.now().toString());
          setTimeout(() => {
            setDisplayOverlay(false);
          }, 2000);
        }
      } else {
        setServerUp(false);
        setStatusMessage("FAILED TO CONNECT, RETRYING . . .");
      }
    } catch (err) {
      setServerUp(false);
      setStatusMessage("CONNECTION ERROR, RETRYING . . .");
    }
  };

  useEffect(() => {
    if (!isCacheValid()) {
      const interval = setInterval(() => {
        pingServer();
      }, 5000);

      const dotInterval = setInterval(() => {
        if (!serverUp) {
          setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }
      }, 500);

      return () => {
        clearInterval(interval);
        clearInterval(dotInterval);
      };
    } else {
      setServerUp(true);
      setTimeout(() => {
        setDisplayOverlay(false);
      }, 2000);
    }
  }, [serverUp]);

  if (!isCacheValid() && displayOverlay) {
    return (
      <div className="pinger-overlay">
        <div className="pinger-container">
          <p className="pinger-text">
            {statusMessage}{dots}
          </p>
          <div className="pinger-sprites-container">
            <img src={dancingGif} alt="Dancing Pokémon" className="pinger-sprite" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RenderPinger;
