import _ from "underscore";
import {
  Center,
  getSurroundingPositions,
  getSurroundingPositionsMulti,
  getTilePosition,
  makeLineKey,
  makePositionKey,
  offsetPosition,
  PieceOutliner,
  Position,
  rotatePosition,
  truncatePoint
} from "./hexGridUtils";
import {sortPositions, uniquePositions} from "./testing/utils";
import {Piece} from "./game";

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

describe("rotatePosition", () => {
  const getAllRotations = (start: Position, center: Position, clockwise: boolean): Position[] => {
    const multiplier = clockwise ? 1 : -1;
    const rotations = [
      rotatePosition(start, 1 * multiplier, center),
      rotatePosition(start, 2 * multiplier, center),
      rotatePosition(start, 3 * multiplier, center),
      rotatePosition(start, 4 * multiplier, center),
      rotatePosition(start, 5 * multiplier, center),
    ];
    if (!clockwise) {
      rotations.reverse();
    }
    rotations.push(...[
      rotatePosition(rotatePosition(start, 5 * multiplier, center), 1 * multiplier, center),
    ]);
    return rotations;
  };
  const cases: [string, Position][] = [
    ["0 even row", {x: 0, y: 0}],
    ["negative even row", {x: 0, y: -2}],
    ["positive even row", {x: 0, y: 2}],
    ["negative odd row", {x: 0, y: -1}],
    ["positive odd row", {x: 0, y: 1}],
  ];
  for (const clockwise of [true, false]) {
    for (const [name, center] of cases) {
      ((name, center, clockwise) => {
        describe(`${clockwise ? "clockwise" : "counterclockwise"} around ${name}`, () => {
          it("rotates right 1", () => {
            const start = offsetPosition(center, 1);
            expect(getAllRotations(start, center, clockwise)).toEqual([
              offsetPosition(center, 0, 1),
              offsetPosition(center, 0, 0, 1),
              offsetPosition(center, -1),
              offsetPosition(center, 0, -1),
              offsetPosition(center, 0, 0, -1),
              offsetPosition(center, 1),
            ]);
          });
          it("rotates right 2", () => {
            const start = offsetPosition(center, 2);
            expect(getAllRotations(start, center, clockwise)).toEqual([
              offsetPosition(center, 0, 2),
              offsetPosition(center, 0, 0, 2),
              offsetPosition(center, -2),
              offsetPosition(center, 0, -2),
              offsetPosition(center, 0, 0, -2),
              offsetPosition(center, 2),
            ]);
          });
          it("rotates right 3", () => {
            const start = offsetPosition(center, 3);
            expect(getAllRotations(start, center, clockwise)).toEqual([
              offsetPosition(center, 0, 3),
              offsetPosition(center, 0, 0, 3),
              offsetPosition(center, -3),
              offsetPosition(center, 0, -3),
              offsetPosition(center, 0, 0, -3),
              offsetPosition(center, 3),
            ]);
          });
          it("rotates right 1 bottom-right 1", () => {
            const start = offsetPosition(center, 1, 1);
            expect(getAllRotations(start, center, clockwise)).toEqual([
              offsetPosition(center, 0, 1, 1),
              offsetPosition(center, -1, 0, 1),
              offsetPosition(center, -1, -1),
              offsetPosition(center, 0, -1, -1),
              offsetPosition(center, 1, 0, -1),
              offsetPosition(center, 1, 1),
            ]);
          });
          it("rotates right 2 bottom-right 1", () => {
            const start = offsetPosition(center, 2, 1);
            expect(getAllRotations(start, center, clockwise)).toEqual([
              offsetPosition(center, 0, 2, 1),
              offsetPosition(center, -1, 0, 2),
              offsetPosition(center, -2, -1),
              offsetPosition(center, 0, -2, -1),
              offsetPosition(center, 1, 0, -2),
              offsetPosition(center, 2, 1),
            ]);
          });
          it("rotates right 1 bottom-right 2", () => {
            const start = offsetPosition(center, 1, 2);
            expect(getAllRotations(start, center, clockwise)).toEqual([
              offsetPosition(center, 0, 1, 2),
              offsetPosition(center, -2, 0, 1),
              offsetPosition(center, -1, -2),
              offsetPosition(center, 0, -1, -2),
              offsetPosition(center, 2, 0, -1),
              offsetPosition(center, 1, 2),
            ]);
          });
        });
      })(name, center, clockwise);
    }
  }
});

describe("makeLineKey", () => {
  it("makes the same key regardless of order", () => {
    expect(makeLineKey([{x: 1, y: 2}, {x: 3, y: 4}])).toEqual(makeLineKey([{x: 3, y: 4}, {x: 1, y: 2}]));
  });
  it("truncates points", () => {
    expect(makeLineKey([
      {x: 43.30127018922194, y: 25.00000000000003},
      {x: 7.105427357601002e-15, y: 50.00000000000001},
    ])).toEqual("0,50|43.301,25")
  });
});

describe("truncatePoint", () => {
  it("truncates similar points to the same one", () => {
    expect(new Set([
      {x: 7.105427357601002e-15, y: 50.00000000000004},
      {x: 7.105427357601002e-15, y: 50.00000000000001},
      {x: 7.105427357601002e-15, y: 50.00000000000004},
      {x: 7.105427357601002e-15, y: 50.00000000000001},
    ].map(point => makePositionKey(truncatePoint(point))))).toEqual(new Set(["0,50"]));
  });
});

describe("PieceOutliner", () => {
  describe("groupTilesByLine", () => {
    it("creates 15 groups", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesByLine = outliner.groupTilesByLine(outliner.getTilesLines());
      expect(tilesByLine.size).toEqual(15);
    });
  });
  describe("getPieceOutline", () => {
    it("creates a 12 line outline", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      expect(outliner.getPieceOutline().length).toEqual(12);
    });
    it("creates an outline from all the outline lines points", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(sortPositions(outliner.getPieceOutline())).toEqual(uniquePositions(sortPositions(linesInOutline.flat())));
    });
  });
  describe("groupNextPointsByPoint", () => {
    it("groups into 12 points", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(outliner.groupNextPointsByPoint(linesInOutline).size).toEqual(12);
    });
    it("includes every point in the outlines lines as a key", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(new Set(outliner.groupNextPointsByPoint(linesInOutline).keys()))
        .toEqual(new Set(linesInOutline.flat().map(point => makePositionKey(point))));
    });
    it("includes every point in the outlines lines as a value twice", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(sortPositions(Array.from(outliner.groupNextPointsByPoint(linesInOutline).values()).flat()))
        .toEqual(sortPositions(linesInOutline.flat()));
    });
    it("each group has 2 next points", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(new Set(Array.from(outliner.groupNextPointsByPoint(linesInOutline).values()).map(points => points.length))).toEqual(new Set([2]));
    });
  });
});
