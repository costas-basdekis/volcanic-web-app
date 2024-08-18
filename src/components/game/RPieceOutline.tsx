import {Piece} from "../../game";
import {getPieceOutline} from "../../hexGridUtils";
import {pointsToPathD} from "../../svgUtils";

export interface RPieceOutlineProps {
  piece: Piece,
  levelIndex: number,
  size?: number,
}

export function RPieceOutline(props: RPieceOutlineProps) {
  const {piece, size = 50, levelIndex} = props;
  const pieceOutline = getPieceOutline(piece, size, size - (levelIndex - 1) * 5);
  return (
    <path
      d={pointsToPathD(pieceOutline)}
      stroke={"black"}
      strokeWidth={5}
      fill={"transparent"}
    />
  );
}
