import {Piece} from "../../game";
import {RTile} from "./RTile";

export interface RPieceProps {
  piece: Piece,
  size?: number,
  drawSize?: number,
}

export function RPiece(props: RPieceProps) {
  const {piece, size, drawSize} = props;
  return <>
    {piece.tiles.map(tile => (
      <RTile key={tile.key} tile={tile} size={size} drawSize={drawSize} />
    ))}
  </>;
}
