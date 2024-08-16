import {useCallback, useState} from 'react';
import './App.css';
import {Board, Piece} from "./game";
import {AutoResizeSvg, RBoard, RPiece, RPreviewPlacePiece} from "./components";
import {Position} from "./hexGridUtils";
import {useAutoShortcut} from "./hooks";

export default function App() {
  const [board, setBoard] = useState(() => Board.makeEmpty().placePiece(Piece.presets.WhiteBlack));
  const [nextPiece, setNextPiece] = useState(Piece.presets.BlackWhite);

  const onPlacePiece = useCallback((position: Position) => {
    setBoard(board => board.placePieceAt(nextPiece, position));
  }, [nextPiece]);
  const onChangeNextPiece = useCallback((piece: Piece) => {
    setNextPiece(piece);
  }, []);

  const placeablePositions = board.levels.get(1)!.getPlaceablePositionsForPiece(nextPiece);
  return (
    <div className="App">
      <AutoResizeSvg>
        <RBoard board={board}/>
        <RPreviewPlacePiece
          placeablePositions={placeablePositions}
          piece={nextPiece}
          onPlacePiece={onPlacePiece}
        />
        <AutoResizeSvg.Tools>
          <NextPieceDisplay piece={nextPiece} onChangePiece={onChangeNextPiece} />
        </AutoResizeSvg.Tools>
      </AutoResizeSvg>
    </div>
  );
}

interface NextPieceDisplayProps {
  piece: Piece,
  onChangePiece: (piece: Piece) => void,
}

function NextPieceDisplay(props: NextPieceDisplayProps) {
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
          <RPiece piece={piece} size={25} />
        </g>
      </svg>
      <br/>
      <button onClick={onCwClick}>CW [R]</button>
      <button onClick={onCcwClick}>CCW [T]</button>
    </div>
  );
}
