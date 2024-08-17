import {Piece} from "../game";
import {useCallback} from "react";
import {useAutoShortcut} from "../hooks";
import {RPiece} from "./game";
import "./NextPieceDisplay.css";

interface NextPieceDisplayProps {
  piece: Piece,
  onChangePiece: (piece: Piece) => void,
}

export function NextPieceDisplay(props: NextPieceDisplayProps) {
  const {piece, onChangePiece} = props;

  const onCwClick = useCallback(() => {
    onChangePiece(piece.rotate(1));
  }, [onChangePiece, piece]);
  const onCcwClick = useCallback(() => {
    onChangePiece(piece.rotate(-1));
  }, [onChangePiece, piece]);

  useAutoShortcut(onCwClick, ['r'], 'Rotate next piece CW', 'Rotate the next piece clockwise');
  useAutoShortcut(onCcwClick, ['t'], 'Rotate next piece CCW', 'Rotate the next piece counter-clockwise');

  const middlePoint = piece.getMiddlePosition(25);
  return (
    <div className={"next-piece-preview"}>
      <label>Next piece:</label>
      <br/>
      <svg width={100} height={100}>
        <g transform={`translate(${50 - middlePoint.x}, ${50 - middlePoint.y})`}>
          <RPiece piece={piece} size={25}/>
        </g>
      </svg>
      <br/>
      <button onClick={onCwClick}>CW [R]</button>
      <button onClick={onCcwClick}>CCW [T]</button>
    </div>
  );
}
