import {Level} from "../../game";
import {RTile} from "./RTile";

export interface RLevelProps {
  level: Level,
}

export function RLevel(props: RLevelProps) {
  const {level} = props;
  return <>
    {level.tiles.map(tile => (
      <RTile key={tile.key} tile={tile} drawSizeLevel={level.index} />
    ))}
  </>;
}
