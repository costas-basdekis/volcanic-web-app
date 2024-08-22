import {RPreviewPlacePiece} from "./RPreviewPlacePiece";
import {RPreviewPlaceUnit} from "./RPreviewPlaceUnit";
import {BlackOrWhite, Board, Piece, Unit} from "../../game";
import {RPreviewExpandGroup} from "./RPreviewExpandGroup";
import {Action, UnitAction} from "../ActionSelector";
import {useCallback, useMemo} from "react";
import {Position} from "../../hexGridUtils";

export interface RPreviewProps {
  board: Board,
  nextPiece: Piece,
  action: Action,
  colour: BlackOrWhite,
  onBoardChange?: ((board: Board) => void) | null | undefined,
  onPlacePiece?: ((piece: Piece) => void) | null | undefined,
  onPlaceUnit?: ((action: UnitAction, position: Position) => void) | null | undefined,
}

export function RPreview(props: RPreviewProps) {
  const {
    board, nextPiece, action, colour,
    onBoardChange, onPlacePiece: onPlacePieceOuter,
    onPlaceUnit: onPlaceUnitOuter,
  } = props;

  const onPlacePiece = useCallback((position: Position) => {
    onBoardChange?.(board.placePieceAt(nextPiece, position));
    onPlacePieceOuter?.(nextPiece.moveFirstTileTo(position));
  }, [board, nextPiece, onBoardChange, onPlacePieceOuter]);
  const onPlaceUnit = useCallback((unit: Unit, position: Position) => {
    onBoardChange?.(board.placeUnit(unit, position));
    onPlaceUnitOuter?.(action as UnitAction, position);
  }, [action, board, onBoardChange, onPlaceUnitOuter]);
  const onExpandGroup = useCallback((position: Position) => {
    onBoardChange?.(board.expandGroup(position, "white"));
  }, [board, onBoardChange]);

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

  return (action === "place-tile" ? (
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
  ) : null);
}
