import _ from "underscore";
import {Level} from "./Level";
import {Tile} from "./Tile";

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
    })
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

  putPiece(tiles: Tile[]): Board {
    const entries = _.map(this.levels.entries(), ([index, level]: [number, Level]) =>
      [index, index === 1 ? level.putPiece(tiles) : level] as [number, Level])
    return this._change({
      levels: new Map(entries)
    });
  }
}
