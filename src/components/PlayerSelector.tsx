import "./PlayerSelector.css";
import {BlackOrWhite, playerNames} from "../game";
import {useCallback, useEffect, useState} from "react";
import {useAutoShortcut} from "../hooks";

interface PlayerSelectorProps {
  onChangeColour: (colour: BlackOrWhite) => void,
}

const coloursAndNames: [BlackOrWhite, string][] = [
  ["white", playerNames.white],
  ["black", playerNames.black],
];
export function  PlayerSelector(props: PlayerSelectorProps) {
  const {onChangeColour} = props;
  const [colourIndex, setColourIndex] = useState(0);

  const rotateColour = useCallback(() => {
    setColourIndex(colourIndex => (colourIndex + 1) % coloursAndNames.length);
  }, []);

  useAutoShortcut(rotateColour, ["w"], "Cycle through players", "Cycle through players");

  const [colour] = coloursAndNames[colourIndex];

  useEffect(() => {
    onChangeColour(colour);
  }, [colour, onChangeColour]);

  return (
    <div className={"player-selector"}>
      Press [W] to cycle through players
      <ul>
        {coloursAndNames.map(([presetColour, name], colourIndex) => (
          <li key={presetColour}>
            <label>
              <input
                type={"radio"}
                name={"player"}
                value={colour}
                checked={colour === presetColour}
                onChange={() => setColourIndex(colourIndex)}
              />
              {" "}{name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
