import {useCallback, useState} from 'react';
import './App.css';
import {Board, Piece} from "./game";
import {AutoResizeSvg, Credits, RBoard, NextPieceDisplay, RPreviewPlacePiece} from "./components";
import {Position} from "./hexGridUtils";

export default function App() {
  const [board, setBoard] = useState(() => Board.makeEmpty().placePiece(Piece.presets.WhiteBlack));
  const [nextPiece, setNextPiece] = useState(Piece.presets.BlackWhite);

  const onPlacePiece = useCallback((position: Position) => {
    setBoard(board => board.placePieceAt(nextPiece, position));
  }, [nextPiece]);
  const onChangeNextPiece = useCallback((piece: Piece) => {
    setNextPiece(piece);
  }, []);

  const placeablePositions = board.getPlaceablePositionsForPiece(nextPiece);
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
          <Credits />
        </AutoResizeSvg.Tools>
      </AutoResizeSvg>
    </div>
  );
}

