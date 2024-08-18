import {Level} from "../../game";
import {RTile} from "./RTile";
import {RPieceOutline} from "./RPieceOutline";

export interface RLevelProps {
  level: Level,
}

export function RLevel(props: RLevelProps) {
  const {level} = props;
  return <>
    {level.tiles.map(tile => (
      <RTile key={tile.key} tile={tile} drawSizeLevel={level.index} />
    ))}
    {Array.from(level.pieceIdPieceMap.values()).map(piece => (
      <RPieceOutline
        key={piece.tiles[0].key}
        piece={piece}
        levelIndex={level.index}
      />
    ))}
  </>;
}
