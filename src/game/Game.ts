import {Board} from "./Board";
import {BlackOrWhite, Unit, UnitType} from "./Unit";
import {Piece} from "./Piece";
import {Position} from "../hexGridUtils";
import {Action} from "../components";

export type RemainingUnits = {[key in BlackOrWhite]: PlayerRemainingUnits};
export type PlayerRemainingUnits = {[key in UnitType]: number};
export type RemainingTiles = { [key in BlackOrWhite]: number };

interface GameAttributes {
  board: Board;
  finished: boolean;
  winner: BlackOrWhite | null;
  nextPlayer: BlackOrWhite;
  remainingTiles: RemainingTiles;
  remainingUnits: RemainingUnits;
}

export class Game implements GameAttributes {
  previousGame: Game | null;
  board: Board;
  finished: boolean;
  winner: BlackOrWhite | null;
  nextPlayer: BlackOrWhite;
  remainingTiles: RemainingTiles;
  remainingUnits: RemainingUnits;

  static start(): Game {
    return PartialMoveGame.start().toGame(null);
  }

  constructor(attributes: GameAttributes & {previousGame: Game | null}) {
    this.previousGame = attributes.previousGame;
    this.board = attributes.board;
    this.finished = attributes.finished;
    this.winner = attributes.winner;
    this.nextPlayer = attributes.nextPlayer;
    this.remainingTiles = attributes.remainingTiles;
    this.remainingUnits = attributes.remainingUnits;
  }

  toPartialMoveGame(): PartialMoveGame {
    return PartialMoveGame.fromGame(this);
  }

  makeMove(piece: Piece, action: Action, actionPosition: Position): Game {
    if (!this.canMakeMove(piece, action, actionPosition)) {
      throw new Error("Cannot make this move");
    }
    return this.toPartialMoveGame().placePiece(piece).placeUnit(action, actionPosition).toGame(this);
  }

  canMakeMove(piece: Piece, action: Action, actionPosition: Position) {
    let partialGame = this.toPartialMoveGame();
    if (!partialGame.canPlacePiece(piece)) {
      return false;
    }
    partialGame = partialGame.placePiece(piece);
    return partialGame.canPlaceUnit(action, actionPosition);
  }
}

export type Stage = "place-piece" | "place-unit";

interface PartialMoveGameAttributes extends GameAttributes {
  previousGame: PartialMoveGame | null;
  stage: Stage;
}

export class PartialMoveGame implements PartialMoveGameAttributes {
  previousGame: PartialMoveGame | null;
  stage: Stage;
  board: Board;
  finished: boolean;
  winner: BlackOrWhite | null;
  nextPlayer: BlackOrWhite;
  remainingTiles: RemainingTiles;
  remainingUnits: RemainingUnits;

  static initialPlayerUnits: PlayerRemainingUnits = {
    pawn: 25,
    bishop: 3,
    rook: 3,
  };

  static initialUnits: RemainingUnits = {
    white: this.initialPlayerUnits,
    black: this.initialPlayerUnits,
  }

  static start(): PartialMoveGame {
    return new PartialMoveGame({
      previousGame: null,
      stage: "place-piece",
      board: Board.makeEmpty(),
      finished: false,
      winner: null,
      nextPlayer: "white",
      remainingTiles: {white: 24, black: 24},
      remainingUnits: this.initialUnits,
    });
  }

  static fromGame(game: Game): PartialMoveGame {
    return new PartialMoveGame({
      ...game,
      previousGame: null,
      stage: "place-piece",
    });
  }

  constructor(attributes: PartialMoveGameAttributes) {
    this.previousGame = attributes.previousGame;
    this.stage = attributes.stage;
    this.board = attributes.board;
    this.finished = attributes.finished;
    this.winner = attributes.winner;
    this.nextPlayer = attributes.nextPlayer;
    this.remainingTiles = attributes.remainingTiles;
    this.remainingUnits = attributes.remainingUnits;
  }

  _change(someAttributes: Partial<PartialMoveGameAttributes>): PartialMoveGame {
    const newAttributes = {
      ...this,
      previousGame: this,
      ...someAttributes,
    };
    if (newAttributes.stage === "place-piece") {
      this._updateFinished(newAttributes);
    }
    return new PartialMoveGame(newAttributes);
  }

  _updateFinished(attributes: GameAttributes) {
    let winner: BlackOrWhite | null = null;
    if (this._userFinishedTheirUnits(attributes.remainingUnits.white)) {
      winner = "white";
    } else if (this._userFinishedTheirUnits(attributes.remainingUnits.black)) {
      winner = "black";
    }
    if (!attributes.remainingUnits.white) {
      winner = "black";
    } else if (!attributes.remainingUnits.black) {
      winner = "white";
    }
    attributes.finished = winner !== null;
    attributes.winner = winner;
  }

  _userFinishedTheirUnits(playerRemainingUnits: PlayerRemainingUnits): boolean {
    return (
      (playerRemainingUnits.pawn === 0 ? 1 : 0)
      + (playerRemainingUnits.bishop === 0 ? 1 : 0)
      + (playerRemainingUnits.rook === 0 ? 1 : 0)
    ) >= 2;
  }

  toGame(previousGame: Game | null): Game {
    if (this.stage !== "place-piece") {
      throw new Error("Cannot convert partially moved game to game");
    }
    return new Game({
      ...this,
      previousGame,
    });
  }

  placePiece(piece: Piece): PartialMoveGame {
    if (this.stage !== "place-piece") {
      throw new Error("Cannot place piece at this stage");
    }
    if (!this.canPlacePiece(piece)) {
      throw new Error("Cannot place this piece");
    }
    return this._change({
      stage: "place-unit",
      board: this.board.placePiece(piece),
    });
  }

  canPlacePiece(piece: Piece): boolean {
    if (this.finished) {
      return false;
    }
    if (this.stage !== "place-piece") {
      return false;
    }
    return this.board.canPlacePiece(piece);
  }

  placeUnit(action: Action, actionPosition: Position): PartialMoveGame {
    if (this.stage !== "place-unit") {
      throw new Error("Cannot place a unit at this stage");
    }
    if (!this.canPlaceUnit(action, actionPosition)) {
      throw new Error("Cannot place this unit");
    }
    let board: Board = this.board;
    const remainingUnits = {...this.remainingUnits};
    remainingUnits[this.nextPlayer] = {...remainingUnits[this.nextPlayer]};
    switch (action) {
      case "place-pawn":
        remainingUnits[this.nextPlayer].pawn -= 1;
        board = board.placeUnit(Unit.Pawn(this.nextPlayer, 1), actionPosition);
        break;
      case "expand-pawn":
        remainingUnits[this.nextPlayer].pawn -= board.getGroupExpansionNeededCount(actionPosition, this.nextPlayer);
        board = board.expandGroup(actionPosition, this.nextPlayer);
        break;
      case "place-bishop":
        remainingUnits[this.nextPlayer].bishop -= 1;
        board = board.placeUnit(Unit.Bishop(this.nextPlayer), actionPosition);
        break;
      case "place-rook":
        remainingUnits[this.nextPlayer].rook -= 1;
        board = board.placeUnit(Unit.Rook(this.nextPlayer), actionPosition);
        break;
      default:
        throw new Error(`Unknown action: '${action}'`);
    }
    return this._change({
      stage: "place-piece",
      board,
      nextPlayer: this.nextPlayer === "white" ? "black" : "white",
      remainingTiles: {
        ...this.remainingTiles,
        [this.nextPlayer]: this.remainingTiles[this.nextPlayer] - 1,
      },
      remainingUnits,
    });
  }

  canPlaceUnit(action: Action, actionPosition: Position): boolean {
    if (this.stage !== "place-unit") {
      return false;
    }
    const remainingUnits = this.remainingUnits[this.nextPlayer];
    switch (action) {
      case "place-pawn":
        return (
          remainingUnits.pawn >= 1
          && this.board.canPlaceUnit(Unit.Pawn(this.nextPlayer, 1), actionPosition)
        );
      case "expand-pawn":
        return (
          this.board.canExpandGroup(actionPosition, this.nextPlayer)
          && remainingUnits.pawn >= this.board.getGroupExpansionNeededCount(actionPosition, this.nextPlayer)
        );
      case "place-bishop":
        return (
          remainingUnits.bishop >= 1
          && this.board.canPlaceUnit(Unit.Bishop(this.nextPlayer), actionPosition)
        );
      case "place-rook":
        return (
          remainingUnits.rook >= 1
          && this.board.canPlaceUnit(Unit.Rook(this.nextPlayer), actionPosition)
        );
      default:
        return false;
    }
  }
}
