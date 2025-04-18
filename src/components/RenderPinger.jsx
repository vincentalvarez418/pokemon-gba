import { useEffect } from "react";

const RenderPinger = () => {
  useEffect(() => {
    const pingRender = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

        await fetch(`${apiUrl}/pings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ time: new Date().toISOString() }),
        });
      } catch (error) {
        console.warn("Render ping failed:", error);
      }
    };

    pingRender();
  }, []);

  return null; 
};

export default RenderPinger;
