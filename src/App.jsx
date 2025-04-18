import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gameboy from "./components/Gameboy";
import PlayerName from "./components/PlayerName";
import Menu from "./components/Menu";
import Lobby from "./components/Lobby";  
import SoloBattle from './components/SoloBattle';
import BattleView from './components/BattleView';
import Pokedex from './components/Pokedex'; 
import Pokebattle from './components/Pokebattle';
import BattleLogs from "./components/BattleLogs";
import QRHostBattle from './components/QRHostBattle';
import QRJoinBattle from './components/QRJoinBattle';
import QRBattle from './components/QRBattle';
import BattleRoom from './components/BattleRoom';
import QRHistory from "./components/QRHistory";
import PokemonSelection from "./components/PokemonSelection";
import BattleArena from './components/BattleArena';
import HomeAnimations from './components/HomeAnimations';
import RenderPinger from "./components/RenderPinger";

function App() {
  useEffect(() => {
    document.body.style.zoom = "90%";
  }, []); 

  return (
    <>
       <RenderPinger />
      <HomeAnimations />
      <Router>
        <Routes>
          <Route path="/" element={<Gameboy />}>
            <Route path="playername" element={<PlayerName />} />
            <Route path="menu" element={<Menu />} />
            <Route path="lobby" element={<Lobby />} /> 
            <Route path="/solo-battle" element={<SoloBattle />} />
            <Route path="battle" element={<BattleView />} />
            <Route path="pokedex" element={<Pokedex />} /> 
            <Route path="pokebattle" element={<Pokebattle />} />
            <Route path="/battle-logs" element={<BattleLogs />} />
            <Route path="/qr-battle/host" element={<QRHostBattle />} />
            <Route path="/qr-battle" element={<QRBattle />} />
            <Route path="/qr-battle/join" element={<QRJoinBattle />} />
            <Route path="/battleRoom/:battleId" element={<BattleRoom />} />
            <Route path="/battlearena/:battleId" element={<BattleArena />} />
            <Route path="/pokemon-selection/:battleId" element={<PokemonSelection />} />
            <Route path="/qr-battle/history" element={<QRHistory />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
