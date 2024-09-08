import {HexPosition} from "../HexPosition";

interface TileAttributes {
  position: HexPosition;
  type: "volcano" | "white" | "black";
}

export class Tile implements TileAttributes {
  readonly position: HexPosition;
  readonly type: "volcano" | "white" | "black";

  constructor(attributes: TileAttributes) {
    this.position = attributes.position;
    this.type = attributes.type;
  }

  get key(): string {
    return this.position.key;
  }

  _change(someAttributes: Partial<TileAttributes>): Tile {
    return new Tile({
      ...this,
      ...someAttributes,
    });
  }

  isAt(position: HexPosition) {
    return this.position.isSameAs(position);
  }

  getSurroundingPositions(): HexPosition[] {
    return this.position.getSurroundingPositions();
  }

  offsetPosition(right: number = 0, bottomRight: number = 0, bottomLeft: number = 0) {
    return this.position.offset(right, bottomRight, bottomLeft);
  }

  offset(position: HexPosition): Tile {
    return this._change({
      position: this.position.plus(position),
    });
  }

  rotate(count: number, around: HexPosition = HexPosition.Center): Tile {
    return this._change({
      position: this.position.rotate(count, around),
    });
  }
}
