import {getSurroundingPositions, makePositionKey, offsetPosition, Position} from "../hexGridUtils";

interface TileAttributes {
  position: Position;
  type: "volcano" | "white" | "black";
}

export class Tile implements TileAttributes {
  position: Position;
  type: "volcano" | "white" | "black";
  key: string;

  constructor(attributes: TileAttributes) {
    this.position = attributes.position;
    this.type = attributes.type;
    this.key = makePositionKey(this.position);
  }

  _change(someAttributes: Partial<TileAttributes>): Tile {
    return new Tile({
      ...this,
      ...someAttributes,
    });
  }

  getSurroundingPositions(): Position[] {
    return getSurroundingPositions(this.position);
  }

  offsetPosition(right: number = 0, bottomRight: number = 0, bottomLeft: number = 0) {
    return offsetPosition(this.position, right, bottomRight, bottomLeft);
  }

  offset(offset: Position): Tile {
    const evenRowStart = this.position.y % 2 === 0;
    const evenRowEnd = (this.position.y + offset.y) % 2 === 0;
    let xOffset;
    if (evenRowStart && !evenRowEnd) {
      xOffset = -1;
    } else {
      xOffset = 0;
    }
    return this._change({
      position: {
        x: this.position.x + offset.x + xOffset,
        y: this.position.y + offset.y,
      },
    });
  }
}
