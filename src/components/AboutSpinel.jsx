import React from "react";
import "./../styles/AboutSpinel.css"; 

const AboutSpinel = () => {
  return (
    <div className="about-spinel">
          <h1>About Pokémon Spinel</h1>
          <hr></hr>
        <p>
          Pokémon Spinel is a fan-made game developed by two WMSU BSIT students as a project. The game uses PokéAPI to simulate Pokémon battles, offering players a unique opportunity to experience classic Pokémon gameplay through modern technology. It’s designed to provide a nostalgic yet fresh take on the Pokémon franchise.
        </p>

        <h2>Inspiration and Design</h2>
        <hr></hr>
        <p>
          The game draws inspiration from the old retro GameBoy systems while incorporating the modern aesthetic of the Nintendo Switch. The visual design pays homage to classic Pokémon games, with a color scheme reminiscent of those early handheld consoles. The interface also integrates a mix of old-school mechanics like the A and B buttons, bringing players back to the simplicity and charm of gaming on the GameBoy.
        </p>

        <h2>Gameplay Features</h2>
        <hr></hr>
        <p>
          Pokémon Spinel offers an engaging battle system where players can select and battle with their Pokémon team. It simulates the turn-based combat system familiar to fans of the original games by using the stat system. The Pokemon with the greater stat wins the Battle. The game uses a single-cartridge save system, just like the classic GameBoy games, allowing players to save their progress one save at a time.
        </p>

    </div>
  );
};

export default AboutSpinel;
