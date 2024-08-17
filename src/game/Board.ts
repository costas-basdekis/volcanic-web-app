import {Level, Levels} from "./Level";
import {Piece} from "./Piece";
import {Position} from "../hexGridUtils";

interface BoardAttributes {
  levels: Levels;
  maxLevel: number;
}

export class Board implements BoardAttributes {
  levels: Levels;
  maxLevel: number;

  static makeEmpty(): Board {
    return new Board({
      levels: new Map([[1, Level.makeEmpty(1, null)]]),
      maxLevel: 1,
    });
  }

  constructor(attributes: BoardAttributes) {
    this.levels = attributes.levels;
    this.maxLevel = attributes.maxLevel;
  }

  _change(someAttributes: Partial<BoardAttributes>): Board {
    const newAttributes: BoardAttributes = {
      ...this,
      ...someAttributes,
    };
    if (someAttributes.levels) {
      this._updatePreviousLevelReferences(newAttributes);
      this._addNewMaxLevel(newAttributes);
    }
    return new Board(newAttributes);
  }

  _updatePreviousLevelReferences(attributes: BoardAttributes) {
    let {levels} = attributes;
    if (!Array.from(levels.values()).some(level => level !== level.updatePreviousLevelFrom(levels))) {
      return;
    }
    levels = new Map(levels);
    for (const level of Array.from(levels.values())) {
      levels.set(level.index, level.updatePreviousLevelFrom(levels));
    }
    attributes.levels = levels;
  }

  _addNewMaxLevel(attributes: BoardAttributes) {
    let {levels, maxLevel} = attributes;
    if (!levels.get(maxLevel)!.tiles.length) {
      return;
    }
    attributes.maxLevel += 1;
    attributes.levels = new Map([
      ...levels.entries(),
      [maxLevel + 1, Level.makeEmpty(maxLevel + 1, levels.get(maxLevel)!)],
    ]);
  }

  getPlaceablePositionsForPiece(piece: Piece): Position[] {
    const placeablePositions: Position[] = [];
    for (const level of this.levels.values()) {
      placeablePositions.push(...level.getPlaceablePositionsForPiece(piece));
    }
    return placeablePositions;
  }

  placePieceAt(piece: Piece, position: Position): Board {
    return this.placePiece(piece.moveFirstTileTo(position));
  }

  placePiece(piece: Piece): Board {
    const levelForPiece = Array.from(this.levels.values()).find(level => level.canPlacePiece(piece));
    if (!levelForPiece) {
      throw new Error("Cannot place this piece at any level");
    }
    const entries = Array.from(this.levels.entries()).map(([index, level]) =>
      [index, level === levelForPiece ? level.placePiece(piece) : level] as [number, Level]);
    return this._change({
      levels: new Map(entries),
    });
  }
}
