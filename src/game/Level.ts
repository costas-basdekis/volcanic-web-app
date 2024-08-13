import {Tile} from "./Tile";
import {Position} from "../hexGridUtils";

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

  putPiece(tiles: Tile[]): Level {
    return this._change({
      tiles: [...this.tiles, ...tiles],
    });
  }

  getSurroundingPositions(): Position[] {
    const surroundingPositions: Position[] = [];
    const prohibitedKeys: Set<string> = new Set(this.tileMap.keys());
    for (const tile of this.tiles) {
      for (const neighbourPosition of tile.getSurroundingPositions()) {
        const key: string = Tile.makeKey(neighbourPosition);
        if (prohibitedKeys.has(key)) {
          continue;
        }
        prohibitedKeys.add(key);
        surroundingPositions.push(neighbourPosition);
      }
    }
    return surroundingPositions;
  }
}
