import {Level, UnitMap} from "../../game";
import {RTile} from "./RTile";
import {RPieceOutline} from "./RPieceOutline";
import {RUnit} from "./RUnit";

export interface RLevelProps {
  level: Level,
  unitMap?: UnitMap,
}

export function RLevel(props: RLevelProps) {
  const {level, unitMap} = props;
  return <>
    {level.tiles.map(tile => {
      const unit = unitMap?.getUnitForLevel(tile.position, level);
      return (
        <RTile key={tile.key} tile={tile} content={unit ? <RUnit unit={unit}/> : null}/>
      );
    })}
    {Array.from(level.pieceIdPieceMap.values()).map(piece => (
      <RPieceOutline
        key={piece.tiles[0].key}
        piece={piece}
        levelIndex={level.index}
      />
    ))}
  </>;
}
