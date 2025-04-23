import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/AboutSpinel.css";

const AboutSpinel = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (windowWidth <= 1000) {
      navigate("/");
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth, navigate]);

  return (
    <div className="about-spinel">
      <h1>About Pokémon Spinel</h1>
      <hr />
      <p>
        Pokémon Spinel is a fan-made rom-hack like crafted by two BSIT students from WMSU as part of an academic entertainment project. The game is built using PokéAPI and React, delivering a unique browser-based Pokémon experience with dynamic battles and authentic retro vibes. It reimagines the nostalgic mechanics of early Pokémon games and presents them in a fresh, web-powered form tailored for new-age fans and old-school trainers alike. Pokémon Spinel aims to bridge generations through gameplay that feels both familiar and surprisingly modern.
      </p>

      <h2>Inspiration and Visual Design</h2>
      <hr />
      <p>
        The visual concept of Spinel draws heavily from the original GameBoy's minimalist style, enhanced by UI elements inspired by the Nintendo Switch. The result is a sleek fusion of past and present: pixelated nostalgia meets polished modern design. Core design elements include A and B button mechanics, a cartridge-style save system, and sprite-styled Pokémon, giving the game an unmistakable retro charm while keeping it intuitive and accessible for today's gamers.
      </p>

      <h2>Gameplay Mechanics and Features</h2>
      <hr />
      <p>
        The gameplay in Pokémon Spinel is simple yet strategically rich. Players select a team of Pokémon, each with unique base stats. Battles are resolved through a stats-based turn system that emphasizes choosing wisely rather than grinding endlessly. Unlike traditional catch-’em-all formats, Spinel focuses on streamlined encounters, stat comparison, and decision-making. The game supports only one save state at a time—mirroring the GameBoy cartridge era—and is playable entirely within a web browser, ensuring accessibility without downloads or installations. It’s nostalgia, no emulator required.
      </p>
    </div>
  );
};

export default AboutSpinel;
