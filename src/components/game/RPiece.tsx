import {Piece} from "../../game";
import {RTile} from "./RTile";
import {RPieceOutline} from "./RPieceOutline";

export interface RPieceProps {
  piece: Piece,
  size?: number,
  drawSize?: number,
  drawSizeLevel?: number,
}

export function RPiece(props: RPieceProps) {
  const {piece, size, drawSize, drawSizeLevel} = props;
  return <>
    {piece.tiles.map(tile => (
      <RTile key={tile.key} tile={tile} size={size} drawSize={drawSize} />
    ))}
    <RPieceOutline piece={piece} size={size} levelIndex={drawSizeLevel ?? 1} />
  </>;
}
