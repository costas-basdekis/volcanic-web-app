import {
  getBottomLeftPosition,
  getBottomRightPosition,
  getLeftPosition,
  getRightPosition,
  getSurroundingPositions,
  getTilePosition, getTopLeftPosition, getTopRightPosition, Position
} from "./hexGridUtils";

describe("getTilePosition", () => {
  it("gets tile position for {0, 0}", () => {
    expect(getTilePosition({x: 0, y: 0}, 100)).toEqualCloseTo({x: 0, y: 0})
  });
  it("gets tile position for {1, 0}", () => {
    expect(getTilePosition({x: 1, y: 0}, 100)).toEqualCloseTo({x: 173.20508075688772, y: 0})
  });
  it("gets tile position for {0, 1}", () => {
    expect(getTilePosition({x: 0, y: 1}, 100)).toEqualCloseTo({x: 86.60254037844386, y: 150})
  });
  it("gets tile position for {1, 1}", () => {
    expect(getTilePosition({x: 1, y: 1}, 100)).toEqualCloseTo({x: 259.8076211353316, y: 150})
  });
  it("gets tile position for {0, 2}", () => {
    expect(getTilePosition({x: 0, y: 2}, 100)).toEqualCloseTo({x: 0, y: 300})
  });
});

describe("getSurroundingPositions", () => {
  interface NamedPositions {
    center: Position,
    right: Position,
    bottomRight: Position,
    bottomLeft: Position,
    left: Position,
    topLeft: Position,
    topRight: Position,
  }
  const evenPositions: NamedPositions = {
    center: {x: 0, y: 0},
    right: {x: 1, y: 0},
    bottomRight: {x: 0, y: 1},
    bottomLeft: {x: -1, y: 1},
    left: {x: -1, y: 0},
    topLeft: {x: -1, y: -1},
    topRight: {x: 0, y: -1},
  }
  const oddPositions: NamedPositions = {
    center: {x: 0, y: 1},
    right: {x: 1, y: 1},
    bottomRight: {x: 1, y: 2},
    bottomLeft: {x: 0, y: 2},
    left: {x: -1, y: 1},
    topLeft: {x: 0, y: 0},
    topRight: {x: 1, y: 0},
  }
  for (const item of [["even", evenPositions], ["odd", oddPositions]] as [string, NamedPositions][]) {
    (([name, positions]) => {
      describe(`on ${name} rows`, () => {
        const {center, right, bottomRight, bottomLeft, left, topLeft, topRight} = positions;
        it("gets surrounding positions", () => {
          expect(getSurroundingPositions(center)).toEqual([
            right,
            bottomRight,
            bottomLeft,
            left,
            topLeft,
            topRight,
          ]);
        });
        it("goes left <-> right", () => {
          expect(getRightPosition(center)).toEqual(right);
          expect(getLeftPosition(right)).toEqual(center);
        });
        it("goes top-left <-> bottom-right", () => {
          expect(getBottomRightPosition(center)).toEqual(bottomRight);
          expect(getTopLeftPosition(bottomRight)).toEqual(center);
        });
        it("goes top-right <-> bottom-left", () => {
          expect(getBottomLeftPosition(center)).toEqual(bottomLeft);
          expect(getTopRightPosition(bottomLeft)).toEqual(center);
        });
      });
    })(item);
  }
});
