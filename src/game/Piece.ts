import {Tile} from "./Tile";
import {Position} from "../hexGridUtils";

interface PieceAttributes {
  tiles: Tile[],
}

export class Piece implements PieceAttributes {
  tiles: Tile[];

  static presets: {[key in "BlackWhite" | "WhiteBlack"]: Piece};

  constructor(attributes: PieceAttributes) {
    this.tiles = attributes.tiles;
  }

  _change(someAttributes: Partial<PieceAttributes>): Piece {
    return new Piece({
      ...this,
      ...someAttributes,
    });
  }

  moveFirstTileTo(position: Position): Piece {
    const firstTile = this.tiles[0];
    const offset: Position = {
      x: position.x - firstTile.position.x,
      y: position.y - firstTile.position.y,
    };
    return this._change({
      tiles: this.tiles.map(tile => tile.offset(offset))
    });
  }
}

Piece.presets = {
  BlackWhite: new Piece({
    tiles: [
      new Tile({position: {x: 0, y: 0}, type: "volcano"}),
      new Tile({position: {x: -1, y: 1}, type: "white"}),
      new Tile({position: {x: 0, y: 1}, type: "black"}),
    ],
  }),
  WhiteBlack: new Piece({
    tiles: [
      new Tile({position: {x: 0, y: 0}, type: "volcano"}),
      new Tile({position: {x: -1, y: 1}, type: "black"}),
      new Tile({position: {x: 0, y: 1}, type: "white"}),
    ],
  }),
};
