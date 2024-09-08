import {Tile} from "./Tile";
import {Center, CartesianPosition} from "../hexGridUtils";
import _ from "underscore";
import {Hex, HexPosition} from "./HexPosition";
import {BlackOrWhite} from "./Unit";

interface PieceAttributes {
  tiles: Tile[],
}

export class Piece implements PieceAttributes {
  tiles: Tile[];

  static presets: {[key in "BlackWhite" | "WhiteBlack" | "WhiteWhite" | "BlackBlack"]: Piece};

  constructor(attributes: PieceAttributes) {
    this.tiles = attributes.tiles;
  }

  _change(someAttributes: Partial<PieceAttributes>): Piece {
    return new Piece({
      ...this,
      ...someAttributes,
    });
  }

  includes(tileOrPosition: Tile | HexPosition) {
    if (tileOrPosition instanceof Tile) {
      return this.tiles.includes(tileOrPosition);
    } else {
      return this.tiles.some(tile => tile.position.isSameAs(tileOrPosition));
    }
  }

  getMiddlePosition(size: number): CartesianPosition {
    if (!this.tiles.length) {
      return Center;
    }
    const middlePosition = {x: 0, y: 0};
    for (const tile of this.tiles) {
      const tilePosition = tile.position.getTilePosition(size);
      middlePosition.x += tilePosition.x;
      middlePosition.y += tilePosition.y;
    }
    return {
      x: middlePosition.x / this.tiles.length,
      y: middlePosition.y / this.tiles.length,
    }
  }

  moveFirstTileTo(position: HexPosition): Piece {
    const firstTile = this.tiles[0];
    if (firstTile.isAt(position)) {
      return this;
    }
    const offset = position.minus(firstTile.position);
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

export const piecePresets = ["WhiteBlack", "BlackWhite", "WhiteWhite", "BlackBlack"] as const;
export type PiecePreset = typeof piecePresets[number];

const makePreset = (bottomLeftColour: BlackOrWhite, bottomRightColour: BlackOrWhite): Piece => {
  return new Piece({
    tiles: [
      new Tile({position: Hex(0, 0), type: "volcano"}),
      new Tile({position: Hex(0, 0, 1), type: bottomLeftColour}),
      new Tile({position: Hex(0, 1), type: bottomRightColour}),
    ],
  });
}

Piece.presets = {
  WhiteBlack: makePreset("white", "black"),
  BlackWhite: makePreset("black", "white"),
  WhiteWhite: makePreset("white", "white"),
  BlackBlack: makePreset("black", "black"),
};
