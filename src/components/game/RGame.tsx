import {Game} from "../../game/Game";
import {AutoResizeSvg} from "../AutoResizeSvg";
import {RUnit} from "../RUnit";
import {RBoard} from "./RBoard";
import {RPreview} from "./RPreview";
import {NextPieceDisplay} from "../NextPieceDisplay";
import {ActionSelector, UnitAction} from "../ActionSelector";
import {ReactNode, useCallback, useEffect, useState} from "react";
import {Piece} from "../../game";
import {Position} from "../../hexGridUtils";
import {ActionConfirm} from "../ActionConfirm";

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

  useEffect(() => {
    setPartialGame(game.toPartialMoveGame());
  }, [game]);

  const moveStage =
    game.nextPlayer === partialGame.nextPlayer
      ? (partialGame.stage === "place-piece" ? "move-start" : "move-middle")
      : "move-end";

  const onPlacePiece = useCallback((piece: Piece) => {
    if (!partialGame.canPlacePiece(piece)) {
      return;
    }
    setPartialGame(partialGame => partialGame.placePiece(piece));
  }, [partialGame]);
  const onPlaceUnit = useCallback((action: UnitAction, position: Position) => {
    if (!partialGame.canPlaceUnit(action, position)) {
      return;
    }
    setPartialGame(partialGame => partialGame.placeUnit(action, position));
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
          action={partialGame.stage === "place-piece" ? "place-tile" : action}
          colour={partialGame.nextPlayer}
          onPlacePiece={onPlacePiece}
          onPlaceUnit={onPlaceUnit}
        />
      ) : null}
      <AutoResizeSvg.Tools>
        <NextPieceDisplay onChangePiece={setNextPiece} />
        <ActionSelector allowPlaceTile={false} action={action} onChangeAction={setAction} />
        <ActionConfirm
          moveStage={moveStage}
          onUndo={onUndo}
          onConfirm={onConfirm}
        />
      </AutoResizeSvg.Tools>
      {children}
    </AutoResizeSvg>
  </>;
}
