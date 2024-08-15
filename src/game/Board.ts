import {Level} from "./Level";
import {Piece} from "./Piece";
import {Position} from "../hexGridUtils";

interface BoardAttributes {
  levels: Map<number, Level>;
  maxLevel: number;
}

export class Board implements BoardAttributes {
  levels: Map<number, Level>;
  maxLevel: number;

  static makeEmpty(): Board {
    return new Board({
      levels: new Map([[1, Level.makeEmpty(1)]]),
      maxLevel: 1,
    });
  }

  constructor(attributes: BoardAttributes) {
    this.levels = attributes.levels;
    this.maxLevel = attributes.maxLevel;
  }

  _change(someAttributes: Partial<BoardAttributes>): Board {
    return new Board({
      ...this,
      ...someAttributes,
    });
  }

  placePieceAt(piece: Piece, position: Position): Board {
    return this.placePiece(piece.moveFirstTileTo(position));
  }

  placePiece(piece: Piece): Board {
    const entries = Array.from(this.levels.entries()).map(([index, level]) =>
      [index, index === 1 ? level.placePiece(piece) : level] as [number, Level]);
    return this._change({
      levels: new Map(entries),
    });
  }
}
