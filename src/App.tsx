import {useCallback, useState} from 'react';
import './App.css';
import {Board, Piece, Unit} from "./game";
import {
  Action, ActionSelector,
  AutoResizeSvg,
  Credits,
  NextPieceDisplay,
  RBoard,
  RPreviewPlacePawn,
  RPreviewPlacePiece,
  RUnit
} from "./components";
import {Position} from "./hexGridUtils";

export default function App() {
  const [board, setBoard] = useState(() => Board.makeEmpty().placePiece(Piece.presets.WhiteBlack));
  const [nextPiece, setNextPiece] = useState(Piece.presets.BlackWhite);
  const [action, setAction] = useState<Action>("place-tile");

  const onPlacePiece = useCallback((position: Position) => {
    setBoard(board => board.placePieceAt(nextPiece, position));
  }, [nextPiece]);
  const onChangeNextPiece = useCallback((piece: Piece) => {
    setNextPiece(piece);
  }, []);
  const onChangeAction = useCallback((action: Action) => {
    setAction(action);
  }, []);
  const onPlaceUnit = useCallback((unit: Unit, position: Position) => {
    setBoard(board => board.placeUnit(unit, position));
  }, []);

  return (
    <div className="App">
      <AutoResizeSvg>
        <defs>
          {RUnit.Definitions}
        </defs>
        <RBoard board={board}/>
        {action === "place-tile" ? (
          <RPreviewPlacePiece
            placeablePositionsAndLevels={board.getPlaceablePositionsForPiece(nextPiece)}
            piece={nextPiece}
            onPlacePiece={onPlacePiece}
          />
        ) : action === "place-pawn" ? (
          <RPreviewPlacePawn
            placeablePositions={board.getUnitPlaceablePositions(Unit.Pawn("white", 1))}
            colour={"white"}
            onPlaceUnit={onPlaceUnit}
          />
        ) : null}
        <AutoResizeSvg.Tools>
          <NextPieceDisplay piece={nextPiece} onChangePiece={onChangeNextPiece} />
          <Credits />
          <ActionSelector action={action} onChangeAction={onChangeAction} />
        </AutoResizeSvg.Tools>
      </AutoResizeSvg>
    </div>
  );
}

