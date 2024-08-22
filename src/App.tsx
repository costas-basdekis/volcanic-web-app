import {useState} from 'react';
import './App.css';
import {
  AutoResizeSvg,
  Credits,
} from "./components";
import {RGame} from "./components/game/RGame";
import {Game} from "./game/Game";

export default function App() {
  const [game, setGame] = useState(Game.start);

  return (
    <div className="App">
      <RGame game={game} onGameChange={setGame}>
        <AutoResizeSvg.Tools>
          <Credits />
        </AutoResizeSvg.Tools>
      </RGame>
    </div>
  );
}
