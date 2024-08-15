import _ from "underscore";
import {
  Center,
  getSurroundingPositions,
  getSurroundingPositionsMulti,
  getTilePosition,
  offsetPosition,
  Position
} from "./hexGridUtils";
import {sortPositions} from "./testing/utils";

describe("getTilePosition", () => {
  it("gets tile position for {0, 0}", () => {
    expect(getTilePosition(Center, 100)).toEqualCloseTo(Center)
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

describe("get neighbour positions", () => {
  const leftRightCases: [string, number][] = [
    ["0 even", 0],
    ["positive even", 2],
    ["negative even", -2],
    ["positive odd", 1],
    ["negative odd", -1],
  ];
  describe("getRightPosition", () => {
    for (const [name, y] of leftRightCases) {
      for (const count of _.range(1, 6)) {
        ((name, y, count) => {
          it(`gets the correct one for ${name} row with count: ${count}`, () => {
            expect(offsetPosition({x: 0, y}, count)).toEqual({x: count, y});
          });
        })(name, y, count);
      }
    }
  });

  describe("getLeftPosition", () => {
    for (const [name, y] of leftRightCases) {
      for (const count of _.range(1, 6)) {
        ((name, y, count) => {
          it(`gets the correct one for ${name} row with count: ${count}`, () => {
            expect(offsetPosition({x: 0, y}, -count)).toEqual({x: -count, y});
          });
        })(name, y, count);
      }
    }
  });

  const topBottomRightCases: [string, number, number[]][] = [
    ["0 even", 0, [0, 1, 1, 2, 2]],
    ["positive even", 2, [0, 1, 1, 2, 2]],
    ["negative even", -2, [0, 1, 1, 2, 2]],
    ["positive odd", 1, [1, 1, 2, 2, 3]],
    ["negative odd", -1, [1, 1, 2, 2, 3]],
  ];
  describe("getTopRightPosition", () => {
    for (const [name, yOffset, xValues] of topBottomRightCases) {
      for (const count of _.range(1, 6)) {
        ((name, yOffset, xValues, count) => {
          it(`gets the correct one for ${name} row with count: ${count}`, () => {
            expect(offsetPosition({x: 0, y: yOffset}, 0, 0, -count)).toEqual({x: xValues[count - 1], y: yOffset - count});
          });
        })(name, yOffset, xValues, count);
      }
    }
  });

  describe("getBottomRightPosition", () => {
    for (const [name, yOffset, xValues] of topBottomRightCases) {
      for (const count of _.range(1, 6)) {
        ((name, yOffset, xValues, count) => {
          it(`gets the correct one for ${name} row with count: ${count}`, () => {
            expect(offsetPosition({x: 0, y: yOffset}, 0, count)).toEqual({x: xValues[count - 1], y: yOffset + count});
          });
        })(name, yOffset, xValues, count);
      }
    }
  });

  const topBottomLeftCases: [string, number, number[]][] = [
    ["0 even", 0, [-1, -1, -2, -2, -3]],
    ["positive even", 2, [-1, -1, -2, -2, -3]],
    ["negative even", -2, [-1, -1, -2, -2, -3]],
    ["positive odd", 1, [0, -1, -1, -2, -2]],
    ["negative odd", -1, [0, -1, -1, -2, -2]],
  ];
  describe("getTopLeftPosition", () => {
    for (const [name, yOffset, xValues] of topBottomLeftCases) {
      for (const count of _.range(1, 6)) {
        ((name, yOffset, xValues, count) => {
          it(`gets the correct one for ${name} row with count: ${count}`, () => {
            expect(offsetPosition({x: 0, y: yOffset}, 0, -count)).toEqual({x: xValues[count - 1], y: yOffset - count});
          });
        })(name, yOffset, xValues, count);
      }
    }
  });

  describe("getBottomLeftPosition", () => {
    for (const [name, yOffset, xValues] of topBottomLeftCases) {
      for (const count of _.range(1, 6)) {
        ((name, yOffset, xValues, count) => {
          it(`gets the correct one for ${name} row with count: ${count}`, () => {
            expect(offsetPosition({x: 0, y: yOffset}, 0, 0, count)).toEqual({x: xValues[count - 1], y: yOffset + count});
          });
        })(name, yOffset, xValues, count);
      }
    }
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
          expect(offsetPosition(center, 1)).toEqual(right);
          expect(offsetPosition(right, -1)).toEqual(center);
        });
        it("goes top-left <-> bottom-right", () => {
          expect(offsetPosition(center, 0, 1)).toEqual(bottomRight);
          expect(offsetPosition(bottomRight, 0, -1)).toEqual(center);
        });
        it("goes top-right <-> bottom-left", () => {
          expect(offsetPosition(center, 0, 0, 1)).toEqual(bottomLeft);
          expect(offsetPosition(bottomLeft, 0, 0, -1)).toEqual(center);
        });
      });
    })(item);
  }
});

describe("getSurroundingPositionsMulti", () => {
  const makeCheckPositions = (depth: number) => {
    return (positions: Position[], expectedPositions: Position[]) => {
      expect(sortPositions(getSurroundingPositionsMulti(positions, depth)))
        .toEqual(sortPositions(expectedPositions));
    };
  }
  describe("depth = 1", () => {
    const checkPositions = makeCheckPositions(1);
    it("Returns nothing for empty", () => {
      checkPositions([], []);
    });
    it("Returns 6 surrounding tiles for 1 tile", () => {
      checkPositions([Center], getSurroundingPositions(Center));
    });
    it("Returns 9 surrounding tiles for 3 tiles", () => {
      const centerTile = Center;
      const bottomLeftTile = {x: -1, y: 1};
      const bottomRightTile = {x: 0, y: 1};
      checkPositions([centerTile, bottomLeftTile, bottomRightTile], [
        offsetPosition(centerTile, -1),
        offsetPosition(centerTile, 0, -1),
        offsetPosition(centerTile, 0, 0, -1),
        offsetPosition(centerTile, 1),
        offsetPosition(bottomRightTile, 1),
        offsetPosition(bottomRightTile, 0, 1),
        offsetPosition(bottomRightTile, 0, 0, 1),
        offsetPosition(bottomLeftTile, 0, 0, 1),
        offsetPosition(bottomLeftTile, -1),
      ]);
    });
  });
  describe("depth = 2", () => {
    const checkPositions = makeCheckPositions(2);
    it("Returns nothing for empty", () => {
      checkPositions([], []);
    });
    it("Returns 18 surrounding tiles for 1 tile", () => {
      const centerTile = Center;
      checkPositions([centerTile], [
        ...getSurroundingPositions(centerTile),
        offsetPosition(centerTile, 1, 0, -1),
        offsetPosition(centerTile, 2),
        offsetPosition(centerTile, 1, 1),
        offsetPosition(centerTile, 0, 2),
        offsetPosition(centerTile, 0, 1, 1),
        offsetPosition(centerTile, 0, 0, 2),
        offsetPosition(centerTile, -1, 0, 1),
        offsetPosition(centerTile, -2),
        offsetPosition(centerTile, -1, -1),
        offsetPosition(centerTile, 0, -2),
        offsetPosition(centerTile, 0, -1, -1),
        offsetPosition(centerTile, 0, 0, -2),
      ]);
    });
    it("Returns 24 surrounding tiles for 3 tiles", () => {
      const centerTile = Center;
      const bottomLeftTile = {x: -1, y: 1};
      const bottomRightTile = {x: 0, y: 1};
      checkPositions([centerTile, bottomLeftTile, bottomRightTile], [
        offsetPosition(centerTile, -1),
        offsetPosition(centerTile, 0, -1),
        offsetPosition(centerTile, 0, 0, -1),
        offsetPosition(centerTile, 1),
        offsetPosition(bottomRightTile, 1),
        offsetPosition(bottomRightTile, 0, 1),
        offsetPosition(bottomRightTile, 0, 0, 1),
        offsetPosition(bottomLeftTile, 0, 0, 1),
        offsetPosition(bottomLeftTile, -1),
        offsetPosition(bottomRightTile, 2),
        offsetPosition(bottomRightTile, 1, 1),
        offsetPosition(bottomRightTile, 0, 2),
        offsetPosition(bottomRightTile, 0, 1, 1),
        offsetPosition(bottomRightTile, 0, 0, 2),
        offsetPosition(bottomLeftTile, 0, 0, 2),
        offsetPosition(bottomLeftTile, -1, 0, 1),
        offsetPosition(bottomLeftTile, -2),
        offsetPosition(bottomLeftTile, -1, -1),
        offsetPosition(bottomLeftTile, 0, -2),
        offsetPosition(centerTile, 0, -2),
        offsetPosition(centerTile, 0, -1, -1),
        offsetPosition(centerTile, 0, 0, -2),
        offsetPosition(centerTile, 1, 0, -1),
        offsetPosition(centerTile, 2),
      ]);
    });
  });
});
