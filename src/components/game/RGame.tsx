import {Game} from "../../game/Game";
import {AutoResizeSvg} from "../AutoResizeSvg";
import {RUnit} from "../RUnit";
import {RBoard} from "./RBoard";
import {RPreview} from "./RPreview";
import {NextPieceDisplay} from "../NextPieceDisplay";
import {ActionSelector, UnitAction} from "../ActionSelector";
import {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {applyMove, canApplyMove, decodeMove, encodeMove, Piece, PieceMove, PiecePreset, UnitMove} from "../../game";
import {Center, Position} from "../../hexGridUtils";
import {ActionConfirm} from "../ActionConfirm";
import {RemainingPiecesAndUnitsDisplay} from "../RemainingPiecesAndUnitsDisplay";

export type RGameProps  = {
  game: Game,
  onGameChange: (game: Game) => void,
  children: ReactNode,
};

export function RGame(props: RGameProps) {
  const {game, onGameChange, children} = props;
  const [partialGame, setPartialGame] = useState(() => game.toPartialMoveGame());
  const [nextPiece, setNextPiece] = useState(Piece.presets.BlackWhite);
  const [action, setAction] = useState<UnitAction>("place-pawn");
  const [lastPieceMove, setLastPieceMove] = useState<PieceMove | null>(null);
  const [lastUnitMove, setLastUnitMove] = useState<UnitMove | null>(null);

  useEffect(() => {
    setPartialGame(game.toPartialMoveGame());
  }, [game]);

  const moveStage =
    game.nextPlayer === partialGame.nextPlayer
      ? (partialGame.stage === "place-piece" ? "move-start" : "move-middle")
      : "move-end";

  const onChangePiece = useCallback((piece: Piece, piecePreset: PiecePreset, pieceRotation: number) => {
    setNextPiece(piece);
    setLastPieceMove({piecePreset, pieceRotation, piecePosition: Center});
  }, []);
  const onPlacePiece = useCallback((piece: Piece, piecePosition: Position) => {
    if (!partialGame.canPlacePiece(piece)) {
      return;
    }
    setPartialGame(partialGame => partialGame.placePiece(piece));
    setLastPieceMove(pieceMove => pieceMove ? ({...pieceMove, piecePosition}) : null)
  }, [partialGame]);
  const onPlaceUnit = useCallback((action: UnitAction, position: Position) => {
    if (!partialGame.canPlaceUnit(action, position)) {
      return;
    }
    setPartialGame(partialGame => partialGame.placeUnit(action, position));
    setLastUnitMove({unitAction: action, unitPosition: position});
  }, [partialGame]);
  const onUndo = useCallback(() => {
    if (moveStage === "move-start") {
      return;
    }
    setPartialGame(partialGame => partialGame.previousGame ?? partialGame);
  }, [moveStage]);
  const onConfirm = useCallback(() => {
    if (moveStage !== "move-end") {
      return;
    }
    onGameChange(partialGame.toGame(game));
  }, [game, moveStage, onGameChange, partialGame]);
  const onMoveViaCode = useCallback((moveCode: string) => {
    const move = decodeMove(moveCode);
    if (!move) {
      alert("Move code is invalid");
      return;
    }
    if (!canApplyMove(game, move)) {
      alert("Move is not valid for this board");
      return;
    }
    onGameChange(applyMove(game, move));
    setLastPieceMove(move.pieceMove);
    setLastUnitMove(move.unitMove);
  }, [game, onGameChange]);

  const lastMoveCode = useMemo(() => {
    if (!lastPieceMove || !lastUnitMove) {
      return null;
    }
    return encodeMove({pieceMove: lastPieceMove, unitMove: lastUnitMove});
  }, [lastPieceMove, lastUnitMove]);

  return <>
    <AutoResizeSvg>
      <defs>
        {RUnit.Definitions}
      </defs>
      <RBoard board={partialGame.board}/>
      {game.nextPlayer === partialGame.nextPlayer ? (
        <RPreview
          board={partialGame.board}
          nextPiece={nextPiece}
          action={partialGame.stage === "place-piece" ? "place-piece" : action}
          colour={partialGame.nextPlayer}
          onPlacePiece={onPlacePiece}
          onPlaceUnit={onPlaceUnit}
        />
      ) : null}
      <AutoResizeSvg.Tools>
        <NextPieceDisplay onChangePiece={onChangePiece} />
        <ActionSelector allowPlacePiece={false} action={action} onChangeAction={setAction} />
        <RemainingPiecesAndUnitsDisplay
          currentPlayer={game.nextPlayer}
          remainingPieces={game.remainingPieces}
          remainingUnits={game.remainingUnits}
        />
        <ActionConfirm
          moveStage={moveStage}
          lastMoveCode={lastMoveCode}
          onMoveViaCode={onMoveViaCode}
          onUndo={onUndo}
          onConfirm={onConfirm}
        />
      </AutoResizeSvg.Tools>
      {children}
    </AutoResizeSvg>
  </>;
}
