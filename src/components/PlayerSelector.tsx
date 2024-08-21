import "./PlayerSelector.css";
import {BlackOrWhite} from "../game";
import {useCallback, useEffect, useState} from "react";
import {useAutoShortcut} from "../hooks";

interface PlayerSelectorProps {
  onSetColour: (colour: BlackOrWhite) => void,
}

const coloursAndNames: [BlackOrWhite, string][] = [
  ["white", "White"],
  ["black", "Black"],
];
export function  PlayerSelector(props: PlayerSelectorProps) {
  const {onSetColour} = props;
  const [colourIndex, setColourIndex] = useState(0);

  const rotateColour = useCallback(() => {
    setColourIndex(colourIndex => (colourIndex + 1) % coloursAndNames.length);
  }, []);

  useAutoShortcut(rotateColour, ["w"], "Cycle through players", "Cycle through players");

  const [colour] = coloursAndNames[colourIndex];

  useEffect(() => {
    onSetColour(colour);
  }, [colour, onSetColour]);

  return (
    <div className={"player-selector"}>
      Press [W] to cycle through actions
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
