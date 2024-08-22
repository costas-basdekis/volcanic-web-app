import {UnitAction} from "../components";
import {Position} from "../hexGridUtils";
import {Piece, PiecePreset} from "./Piece";
import type {Game} from "./Game";

export interface Move {
  pieceMove: PieceMove;
  unitMove: UnitMove;
}

export interface PieceMove {
  piecePreset: PiecePreset;
  pieceRotation: number;
  piecePosition: Position;
}

export interface UnitMove {
  unitAction: UnitAction;
  unitPosition: Position;
}

const piecePresetShorthands: {[key in PiecePreset]: string} = {
  WhiteBlack: "WB",
  BlackWhite: "BW",
  WhiteWhite: "WW",
  BlackBlack: "BB",
};
const reversePiecePresetShorthands: {[key: string]: PiecePreset} = Object.fromEntries(
  Object.entries(piecePresetShorthands)
    .map(([preset, shorthand]) => [shorthand, preset] as [string, PiecePreset])
);

const unitActionShorthands: {[key in UnitAction]: string} = {
  "place-pawn": "P",
  "expand-pawn": "E",
  "place-bishop": "B",
  "place-rook": "R",
};
const reverseUnitActionShorthands: {[key: string]: UnitAction} = Object.fromEntries(
  Object.entries(unitActionShorthands)
    .map(([preset, shorthand]) => [shorthand, preset] as [string, UnitAction])
);

export function encodeMove({pieceMove, unitMove}: Move): string {
  return (
    `P${piecePresetShorthands[pieceMove.piecePreset]}`
    + `${pieceMove.pieceRotation},${pieceMove.piecePosition.x},${pieceMove.piecePosition.y}`
    + `U${unitActionShorthands[unitMove.unitAction]}${unitMove.unitPosition.x},${unitMove.unitPosition.y}`
  );
}

const moveRe = /P([WB][WB])([0-5]),(-?\d+),(-?\d+)U([PEBR])(-?\d+),(-?\d+)/;

export function decodeMove(moveCode: string): Move | null {
  const match = moveCode.toUpperCase().match(moveRe);
  if (!match) {
    return null;
  }
  const [
    ,
    piecePresetShorthand, pieceRotationStr, piecePositionXStr, piecePositionYStr,
    unitActionShorthand, unitPositionXStr, unitPositionYStr,
  ] = match;
  const move = {
    pieceMove: {
      piecePreset: reversePiecePresetShorthands[piecePresetShorthand],
      pieceRotation: parseInt(pieceRotationStr, 10),
      piecePosition: {
        x: parseInt(piecePositionXStr, 10),
        y: parseInt(piecePositionYStr, 10),
      }
    },
    unitMove: {
      unitAction: reverseUnitActionShorthands[unitActionShorthand],
      unitPosition: {
        x: parseInt(unitPositionXStr, 10),
        y: parseInt(unitPositionYStr, 10),
      },
    },
  };
  console.log(moveCode, match, move);
  return move;
}

export function applyMove(game: Game, move: Move): Game {
  return game.makeMove(
    Piece.presets[move.pieceMove.piecePreset]
      .rotate(move.pieceMove.pieceRotation)
      .moveFirstTileTo(move.pieceMove.piecePosition),
    move.unitMove.unitAction,
    move.unitMove.unitPosition,
  );
}

export function canApplyMove(game: Game, move: Move) {
  return game.canMakeMove(
    Piece.presets[move.pieceMove.piecePreset]
      .rotate(move.pieceMove.pieceRotation)
      .moveFirstTileTo(move.pieceMove.piecePosition),
    move.unitMove.unitAction,
    move.unitMove.unitPosition,
  );
}
