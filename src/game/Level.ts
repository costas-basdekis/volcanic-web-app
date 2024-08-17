import {Tile} from "./Tile";
import {Center, getSurroundingPositionsMulti, isCenter, makePositionKey, Position} from "../hexGridUtils";
import {Piece} from "./Piece";

export type Levels = Map<number, Level>;

interface LevelAttributes {
  index: number;
  tiles: Tile[];
  tileMap: Map<string, Tile>;
  previousLevel: Level | null;
}

export class Level implements LevelAttributes {
  index: number;
  tiles: Tile[];
  tileMap: Map<string, Tile>;
  previousLevel: Level | null;

  static makeEmpty(index: number, previousLevel: Level | null): Level {
    return this.fromTiles(index, [], previousLevel);
  }

  static fromTiles(index: number, tiles: Tile[], previousLevel: Level | null): Level {
    return new Level({
      index,
      tiles,
      tileMap: this.getTileMap(tiles),
      previousLevel,
    });
  }

  static getTileMap(tiles: Tile[]): Map<string, Tile> {
    return new Map(tiles.map(tile => [tile.key, tile]));
  }

  constructor(attributes: LevelAttributes) {
    this.index = attributes.index;
    this.tiles = attributes.tiles;
    this.tileMap = attributes.tileMap;
    this.previousLevel = attributes.previousLevel;
  }

  _change(someAttributes: Partial<LevelAttributes>): Level {
    const newAttributes = {
      ...this,
      ...someAttributes,
    };
    if (someAttributes.tiles && !someAttributes.tileMap) {
      newAttributes.tileMap = Level.getTileMap(newAttributes.tiles);
    }
    return new Level(newAttributes);
  }

  updatePreviousLevelFrom(levels: Levels): Level {
    const previousLevel = this.previousLevel ? levels.get(this.previousLevel.index)! : null;
    return this.updatePreviousLevel(previousLevel);
  }

  updatePreviousLevel(previousLevel: Level | null): Level {
    if (this.previousLevel === previousLevel) {
      return this;
    }
    return this._change({previousLevel});
  }

  placePieceAt(piece: Piece, position: Position): Level {
    return this.placePiece(piece.moveFirstTileTo(position));
  }

  placePiece(piece: Piece): Level {
    if (!this.canPlacePiece(piece)) {
      throw new Error("Cannot place this piece");
    }
    return this._change({
      tiles: [...this.tiles, ...piece.tiles],
    });
  }

  getSurroundingPositions(depth: number): Position[] {
    if (this.previousLevel) {
      return this.previousLevel.tiles.map(tile => tile.position);
    }
    return getSurroundingPositionsMulti(this.tiles.map(tile => tile.position), depth);
  }

  getPlaceablePositionsForPiece(piece: Piece): Position[] {
    const surroundingPositions = this.getSurroundingPositions(2);
    if (!this.previousLevel && !surroundingPositions.length) {
      return [Center];
    }
    return surroundingPositions
      .filter(position => this.canPlacePieceAt(piece, position));
  }

  canPlacePieceAt(piece: Piece, position: Position): boolean {
    return this.canPlacePiece(piece.moveFirstTileTo(position));
  }

  canPlacePiece(piece: Piece): boolean {
    if (this.previousLevel) {
      if (!this.previousLevel.canPlacePieceOnTop(piece)) {
        return false;
      }
      if (!this.tiles.length) {
        return true;
      }
    } else {
      if (!this.tiles.length) {
        return isCenter(piece.tiles[0].position);
      }
    }
    return !this.doesPieceOverlap(piece) && this.isPieceInTheBorder(piece);
  }

  canPlacePieceOnTopAt(piece: Piece, position: Position): boolean {
    return this.canPlacePieceOnTop(piece.moveFirstTileTo(position));
  }

  canPlacePieceOnTop(piece: Piece): boolean {
    return piece.tiles.every(tile => this.tileMap.has(tile.key));
  }

  doesPieceOverlap(piece: Piece) {
    return piece.tiles.some(tile => this.tileMap.has(tile.key));
  }

  isPieceInTheBorder(piece: Piece) {
    const surroundingPositions = this.getSurroundingPositions(1);
    const surroundingPositionKeySet =
      new Set(surroundingPositions.map(position => makePositionKey(position)));
    return piece.tiles.some(tile => surroundingPositionKeySet.has(tile.key));
  }
}
