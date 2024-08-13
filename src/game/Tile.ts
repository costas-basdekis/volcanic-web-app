import {Position} from "../hexGridUtils";

interface TileAttributes {
  position: Position;
  type: "volcano" | "white" | "black";
}

export class Tile implements TileAttributes {
  position: Position;
  type: "volcano" | "white" | "black";

  constructor(attributes: TileAttributes) {
    this.position = attributes.position;
    this.type = attributes.type;
  }
}
