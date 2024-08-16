import {Piece} from "../../game";
import {RTile} from "./RTile";

export interface RPieceProps {
  piece: Piece,
  size?: number,
}

export function RPiece(props: RPieceProps) {
  const {piece, size} = props;
  return <>
    {piece.tiles.map(tile => (
      <RTile key={tile.key} tile={tile} size={size} />
    ))}
  </>;
}
