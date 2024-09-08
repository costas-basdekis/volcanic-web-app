import {RPreviewPlacePiece} from "./RPreviewPlacePiece";
import {RPreviewPlaceUnit} from "./RPreviewPlaceUnit";
import {BlackOrWhite, Board, Piece, HexPosition, Unit} from "../../game";
import {RPreviewExpandGroup} from "./RPreviewExpandGroup";
import {Action, UnitAction} from "../ActionSelector";
import {useCallback, useMemo} from "react";

export interface RPreviewProps {
  board: Board,
  nextPiece: Piece,
  action: Action,
  colour: BlackOrWhite,
  onBoardChange?: ((board: Board) => void) | null | undefined,
  onPlacePiece?: ((piece: Piece, piecePosition: HexPosition) => void) | null | undefined,
  onPlaceUnit?: ((action: UnitAction, position: HexPosition) => void) | null | undefined,
}

export function RPreview(props: RPreviewProps) {
  const {
    board, nextPiece, action, colour,
    onBoardChange, onPlacePiece: onPlacePieceOuter,
    onPlaceUnit: onPlaceUnitOuter,
  } = props;

  const onPlacePiece = useCallback((position: HexPosition) => {
    onBoardChange?.(board.placePieceAt(nextPiece, position));
    onPlacePieceOuter?.(nextPiece.moveFirstTileTo(position), position);
  }, [board, nextPiece, onBoardChange, onPlacePieceOuter]);
  const onPlaceUnit = useCallback((unit: Unit, position: HexPosition) => {
    onBoardChange?.(board.placeUnit(unit, position));
    onPlaceUnitOuter?.(action as UnitAction, position);
  }, [action, board, onBoardChange, onPlaceUnitOuter]);
  const onExpandGroup = useCallback((position: HexPosition) => {
    onBoardChange?.(board.expandGroup(position, colour));
    onPlaceUnitOuter?.(action as UnitAction, position);
  }, [action, board, colour, onBoardChange, onPlaceUnitOuter]);

  const placeablePawnPositions = useMemo(() => {
    return board.getUnitPlaceablePositions(Unit.Pawn(colour, 1));
  }, [board, colour]);
  const groupExpansionInfos = useMemo(() => {
    return board.getGroupExpansionInfos(colour);
  }, [board, colour]);
  const placeableBishopPositions = useMemo(() => {
    return board.getUnitPlaceablePositions(Unit.Bishop(colour));
  }, [board, colour]);
  const placeableRookPositions = useMemo(() => {
    return board.getUnitPlaceablePositions(Unit.Rook(colour));
  }, [board, colour]);

  return (action === "place-piece" ? (
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
