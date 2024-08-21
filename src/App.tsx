import {useCallback, useMemo, useState} from 'react';
import './App.css';
import {BlackOrWhite, Board, Piece, Unit} from "./game";
import {
  Action, ActionSelector,
  AutoResizeSvg,
  Credits,
  NextPieceDisplay,
  RBoard, RPreviewExpandGroup,
  RPreviewPlaceUnit,
  RPreviewPlacePiece,
  RUnit, PlayerSelector
} from "./components";
import {Position} from "./hexGridUtils";

export default function App() {
  const [board, setBoard] = useState(() => Board.makeEmpty().placePiece(Piece.presets.WhiteBlack));
  const [nextPiece, setNextPiece] = useState(Piece.presets.BlackWhite);
  const [action, setAction] = useState<Action>("place-tile");
  const [colour, setColour] = useState<BlackOrWhite>("white");

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
  const onExpandGroup = useCallback((position: Position) => {
    setBoard(board => board.expandGroup(position, "white"));
  }, []);

  const placeablePawnPositions = useMemo(() => {
    return board.getUnitPlaceablePositions(Unit.Pawn("white", 1));
  }, [board]);
  const groupExpansionInfos = useMemo(() => {
    return board.getGroupExpansionInfos("white");
  }, [board]);
  const placeableBishopPositions = useMemo(() => {
    return board.getUnitPlaceablePositions(Unit.Bishop("white"));
  }, [board]);
  const placeableRookPositions = useMemo(() => {
    return board.getUnitPlaceablePositions(Unit.Rook("white"));
  }, [board]);

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
          <RPreviewPlaceUnit
            placeablePositions={placeablePawnPositions}
            unit={Unit.Pawn(colour, 1)}
            onPlaceUnit={onPlaceUnit}
          />
        ) : action === "expand-pawn" ? (
          <RPreviewExpandGroup
            groupExpansionInfos={groupExpansionInfos}
            onExpandGroup={onExpandGroup}
          />
        ) : action === "place-bishop" ? (
          <RPreviewPlaceUnit
            placeablePositions={placeableBishopPositions}
            unit={Unit.Bishop(colour)}
            onPlaceUnit={onPlaceUnit}
          />
        ) : action === "place-rook" ? (
          <RPreviewPlaceUnit
            placeablePositions={placeableRookPositions}
            unit={Unit.Rook(colour)}
            onPlaceUnit={onPlaceUnit}
          />
        ) : null}
        <AutoResizeSvg.Tools>
          <NextPieceDisplay onChangePiece={onChangeNextPiece} />
          <ActionSelector action={action} onChangeAction={onChangeAction} />
          <PlayerSelector onSetColour={setColour} />
          <Credits />
        </AutoResizeSvg.Tools>
      </AutoResizeSvg>
    </div>
  );
}

