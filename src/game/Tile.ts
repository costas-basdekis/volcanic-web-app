import {
  getBottomLeftPosition,
  getBottomRightPosition,
  getLeftPosition,
  getRightPosition,
  getSurroundingPositions,
  getTopLeftPosition,
  getTopRightPosition,
  makePositionKey,
  Position
} from "../hexGridUtils";

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

  getRightPosition(count: number = 1): Position {
    return getRightPosition(this.position, count);
  }

  getBottomRightPosition(count: number = 1): Position {
    return getBottomRightPosition(this.position, count);
  }

  getBottomLeftPosition(count: number = 1): Position {
    return getBottomLeftPosition(this.position, count);
  }

  getLeftPosition(count: number = 1): Position {
    return getLeftPosition(this.position, count);
  }

  getTopLeftPosition(count: number = 1): Position {
    return getTopLeftPosition(this.position, count);
  }

  getTopRightPosition(count: number = 1): Position {
    return getTopRightPosition(this.position, count);
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
