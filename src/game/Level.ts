import {Tile} from "./Tile";
import {Center, getSurroundingPositionsMulti, makePositionKey, Position} from "../hexGridUtils";
import {Piece} from "./Piece";

interface LevelAttributes {
  index: number;
  tiles: Tile[];
  tileMap: Map<string, Tile>;
}

export class Level implements LevelAttributes {
  index: number;
  tiles: Tile[];
  tileMap: Map<string, Tile>;

  static makeEmpty(index: number): Level {
    return this.fromTiles(index, []);
  }

  static fromTiles(index: number, tiles: Tile[]): Level {
    return new Level({
      index,
      tiles,
      tileMap: this.getTileMap(tiles),
    });
  }

  static getTileMap(tiles: Tile[]): Map<string, Tile> {
    return new Map(tiles.map(tile => [tile.key, tile]));
  }

  constructor(attributes: LevelAttributes) {
    this.index = attributes.index;
    this.tiles = attributes.tiles;
    this.tileMap = attributes.tileMap;
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

  putPiece(piece: Piece): Level {
    if (!this.canPlacePiece(piece)) {
      throw new Error("Cannot place this piece");
    }
    return this._change({
      tiles: [...this.tiles, ...piece.tiles],
    });
  }

  getSurroundingPositions(depth: number): Position[] {
    return getSurroundingPositionsMulti(this.tiles.map(tile => tile.position), depth);
  }

  getPlaceablePositionsForPiece(piece: Piece): Position[] {
    if (!this.tiles.length) {
      return [Center];
    }
    return this.getSurroundingPositions(2)
      .filter(position => this.canPlacePieceAt(piece, position));
  }

  canPlacePieceAt(piece: Piece, position: Position): boolean {
    return this.canPlacePiece(piece.moveFirstTileTo(position));
  }

  canPlacePiece(piece: Piece): boolean {
    if (!this.tiles.length) {
      return makePositionKey(piece.tiles[0].position) === makePositionKey(Center);
    }
    return !this.doesPieceOverlap(piece) && this.isPieceInTheBorder(piece);
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
