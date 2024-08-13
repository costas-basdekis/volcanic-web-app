import {Position} from "../hexGridUtils";

interface TileAttributes {
  position: Position;
  type: "volcano" | "white" | "black";
}

export class Tile implements TileAttributes {
  position: Position;
  type: "volcano" | "white" | "black";
  key: string;

  static makeKey({x, y}: Position): string {
    return `${x},${y}`;
  }

  constructor(attributes: TileAttributes) {
    this.position = attributes.position;
    this.type = attributes.type;
    this.key = Tile.makeKey(this.position);
  }
}
