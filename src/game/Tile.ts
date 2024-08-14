import {
  getBottomLeftPosition,
  getBottomRightPosition, getLeftPosition,
  getRightPosition,
  getSurroundingPositions, getTopLeftPosition, getTopRightPosition, makePositionKey,
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

  getSurroundingPositions(): Position[] {
    return getSurroundingPositions(this.position);
  }

  getRightPosition(): Position {
    return getRightPosition(this.position);
  }

  getBottomRightPosition(): Position {
    return getBottomRightPosition(this.position);
  }

  getBottomLeftPosition(): Position {
    return getBottomLeftPosition(this.position);
  }

  getLeftPosition(): Position {
    return getLeftPosition(this.position);
  }

  getTopLeftPosition(): Position {
    return getTopLeftPosition(this.position);
  }

  getTopRightPosition(): Position {
    return getTopRightPosition(this.position);
  }
}
