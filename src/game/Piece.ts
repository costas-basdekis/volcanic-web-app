import {Tile} from "./Tile";
import {Center, getTilePosition, makePositionKey, Position} from "../hexGridUtils";
import _ from "underscore";

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

  getMiddlePosition(size: number): Position {
    if (!this.tiles.length) {
      return Center;
    }
    const middlePosition = {x: 0, y: 0};
    for (const tile of this.tiles) {
      const tilePosition = getTilePosition(tile.position, size);
      middlePosition.x += tilePosition.x;
      middlePosition.y += tilePosition.y;
    }
    return {
      x: middlePosition.x / this.tiles.length,
      y: middlePosition.y / this.tiles.length,
    }
  }

  moveFirstTileTo(position: Position): Piece {
    const firstTile = this.tiles[0];
    if (makePositionKey(position) === firstTile.key) {
      return this;
    }
    const offset: Position = {
      x: position.x - firstTile.position.x,
      y: position.y - firstTile.position.y,
    };
    const evenRowStart = firstTile.position.y % 2 === 0;
    const evenRowEnd = (firstTile.position.y + offset.y) % 2 === 0;
    if (evenRowStart && !evenRowEnd) {
      offset.x += 1;
    }
    return this._change({
      tiles: this.tiles.map(tile => tile.offset(offset))
    });
  }

  rotate(count: number): Piece {
    count = (count % 6 + 6) % 6;
    if (count === 0) {
      return this;
    }
    if (count > 1) {
      let rotated: Piece = this;
      for (const _count of _.range(count)) {
        rotated = rotated.rotate(1);
      }
      return rotated;
    }
    const tile1 = this.tiles[0];
    return new Piece({
      tiles: this.tiles.map((tile, index) => (
        index === 0 ? tile : tile.rotate(1, tile1.position)
      )),
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
