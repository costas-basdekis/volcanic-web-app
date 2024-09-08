import _ from "underscore";
import {CartesianPosition} from "../CartesianPosition";

export class HexPosition {
  readonly r: number;
  readonly dr: number;
  private _key: string | undefined;

  static Center = new HexPosition(0, 0);

  static fromCartesian(cartesian: CartesianPosition): HexPosition {
    return new HexPosition(cartesian.x - Math.floor(cartesian.y / 2), cartesian.y);
  }

  constructor(r: number, dr: number, dl: number = 0) {
    if (Math.floor(r) !== r || Math.floor(dr) !== dr || Math.floor(dl) !== dl) {
      throw new Error(`Cannot have non-integer numbers in Hex: ${r},${dr},${dl}`);
    }
    this.r = r - dl;
    this.dr = dr + dl;
  }

  toCartesian(): CartesianPosition {
    return {
      x: this.r + Math.floor(this.dr / 2),
      y: this.dr,
    };
  }

  toString(): string {
    return this.key;
  }

  get key(): string {
    if (!this._key) {
      this._key = `HEX${this.r},${this.dr}`;
    }
    return this._key;
  }

  isSameAs(other: HexPosition): boolean {
    return this.r === other.r && this.dr === other.dr;
  }

  isCenter(): boolean {
    return this.isSameAs(HexPosition.Center);
  }

  offset(r: number, dr: number, dl: number = 0): HexPosition {
    if (r === 0 && dr === 0 && dl === 0) {
      return this;
    }
    return new HexPosition(this.r + r, this.dr + dr, dl);
  }

  plus(other: HexPosition): HexPosition {
    if (this.isCenter()) {
      return other;
    } else if (other.isCenter()) {
      return this;
    }
    return new HexPosition(this.r + other.r, this.dr + other.dr);
  }

  minus(other: HexPosition): HexPosition {
    if (other.isCenter()) {
      return this;
    }
    return new HexPosition(this.r - other.r, this.dr - other.dr);
  }

  getSurroundingPositions(): HexPosition[] {
    return [
      this.offset(1, 0),
      this.offset(0, 1),
      this.offset(0, 0, 1),
      this.offset(-1, 0),
      this.offset(0, -1),
      this.offset(0, 0, -1),
    ];
  }

  static getSurroundingPositionsMulti(startingPositions: HexPosition[], depth: number): HexPosition[] {
    const surroundingPositions: HexPosition[] = [];
    const prohibitedKeys: Set<string> = new Set(startingPositions.map(position => position.key));
    for (const _iteration of _.range(depth)) {
      const newSurroundingPositions: HexPosition[] = [];
      for (const position of startingPositions) {
        for (const neighbourPosition of position.getSurroundingPositions()) {
          const key: string = neighbourPosition.key;
          if (prohibitedKeys.has(key)) {
            continue;
          }
          prohibitedKeys.add(key);
          newSurroundingPositions.push(neighbourPosition);
        }
      }
      startingPositions = newSurroundingPositions;
      surroundingPositions.push(...newSurroundingPositions);
    }
    return surroundingPositions;
  }

  rotate(count: number, around: HexPosition = HexPosition.Center): HexPosition {
    /*
      The approach has 4 steps:
      * Normalise count and check if we have actually something to do
      * Offset position so around is Center
      * Apply the coordinates to the new directions, based on rotation count

      Rotating:
      To rotate we go in a different set of directions for each rotation count.
      Bellow C is Center, P is the original position, and 1-5 are the resulting rotations
         4
        /
      3 \ /-5
       \-C-\
      2-/ \ P
          /
         1
    */

    // Normalise count
    count = (count % 6 + 6) % 6;
    // Nothing to do with no count
    if (count === 0) {
      return this;
    }
    // Nothing to do with position same as around
    if (this.isSameAs(around)) {
      return this;
    }

    const difference = this.minus(around);

    // Use the values but in a new direction
    switch (count) {
      case 1:
        // Bottom right and then bottom left
        return around.offset(0, difference.r, difference.dr);
      case 2:
        // Bottom left and then left
        return around.offset(-difference.dr, 0, difference.r);
      case 3:
        // Left and then top left
        return around.offset(-difference.r, -difference.dr);
      case 4:
        // Top left and then top right
        return around.offset(0, -difference.r, -difference.dr);
      case 5:
        // Top right and then right
        return around.offset(difference.dr, 0, -difference.r);
      default:
        // This should never really happen
        throw new Error(`Unexpected count '${count}'`);
    }
  }

  getTilePosition(size: number): CartesianPosition {
    return {
      x: (this.r + this.dr / 2) * Math.sin(Math.PI / 3) * size * 2,
      y: this.dr * Math.cos(Math.PI / 3) * size * 3,
    };
  }

  getTileOutline(size: number, drawSize: number): CartesianPosition[] {
    const tilePosition = this.getTilePosition(size);
    return _.range(6)
      .map(index => ({
        x: Math.sin(index * Math.PI / 3) * drawSize + tilePosition.x,
        y: Math.cos(index * Math.PI / 3) * drawSize + tilePosition.y,
      }));
  }
}

export const Hex = (r: number, dr: number, dl: number = 0): HexPosition => {
  return new HexPosition(r, dr, dl);
};
