import {Hex, HexPosition} from "./HexPosition";
import {CartesianPosition} from "../hexGridUtils";
import {sortPositions} from "../testing/utils";

describe("HexPosition", () => {
  const cases: [CartesianPosition, HexPosition][] = [
    [{x: 0, y: 0}, Hex(0, 0)],
    [{x: 1, y: 0}, Hex(1, 0)],
    [{x: 2, y: 0}, Hex(2, 0)],
    [{x: -1, y: 0}, Hex(-1, 0)],
    [{x: -2, y: 0}, Hex(-2, 0)],
    [{x: 0, y: 1}, Hex(0, 1)],
    [{x: -1, y: 1}, Hex(-1, 1)],
    [{x: -2, y: 1}, Hex(-2, 1)],
    [{x: 0, y: 2}, Hex(-1, 2)],
    [{x: -1, y: 2}, Hex(-2, 2)],
    [{x: -2, y: 2}, Hex(-3, 2)],
    [{x: 1, y: 2}, Hex(0, 2)],
    [{x: 2, y: 2}, Hex(1, 2)],
  ];
  describe("fromCartesian", () => {
    for (const [cartesian, hex] of cases) {
      it(`Converts cartesian {${cartesian.x},${cartesian.y}} correctly`, () => {
        expect(HexPosition.fromCartesian(cartesian)).toEqual(hex);
      });
    }
  });
  describe("toCartesian", () => {
    for (const [cartesian, hex] of cases) {
      it(`Converts Hex {${hex.r},${hex.dr}} correctly`, () => {
        expect(hex.toCartesian()).toEqual(cartesian);
      });
    }
  });
  describe("fromCartesian -> toCartesian", () => {
    for (const [cartesian] of cases) {
      it(`Converts cartesian {${cartesian.x},${cartesian.y}} and back correctly`, () => {
        expect(HexPosition.fromCartesian(cartesian).toCartesian()).toEqual(cartesian);
      });
    }
  });
  describe("toCartesian -> fromCartesian", () => {
    for (const [, hex] of cases) {
      it(`Converts Hex {${hex.r},${hex.dr}} and back correctly`, () => {
        expect(HexPosition.fromCartesian(hex.toCartesian())).toEqual(hex);
      });
    }
  });

  describe("isSameAs", () => {
    const cases: [HexPosition, HexPosition][] = [
      [Hex(0, 0), HexPosition.Center],
      [Hex(1, 0), Hex(1, 0)],
      [Hex(0, 1), Hex(0, 1)],
      [Hex(0, 1, 1), Hex(-1, 2)],
      [Hex(0, -1, -1), Hex(1, -2)],
      [Hex(0, -1, 1), Hex(-1, 0)],
      [Hex(0, 1, -1), Hex(1, 0)],
    ];
    for (const [first, second] of cases) {
      it(`Matches {${first.r},${first.dr} to {${second.r},${second.dr}}`, () => {
        expect(first.isSameAs(second)).toBe(true);
        expect(second.isSameAs(first)).toBe(true);
      });
    }
  });

  describe("isCenter", () => {
    it("matches Center", () => {
      expect(HexPosition.Center.isCenter()).toBe(true);
    });
    it("matches 0,0", () => {
      expect(Hex(0, 0).isCenter()).toBe(true);
    });
  });

  describe("offset", () => {
    it("can offset a position", () => {
      expect(Hex(1, 2).offset(3, 4)).toEqual(Hex(4, 6));
    });
    it("returns the same object with no offset", () => {
      const position = Hex(1, 2);
      expect(position.offset(0, 0)).toBe(position);
    });
  });

  describe("plus", () => {
    it("can add 2 positions", () => {
      expect(Hex(1, 2).plus(Hex(3, 4))).toEqual(Hex(4, 6));
    });
    it("returns same object when adding Center", () => {
      const position = Hex(1, 2);
      expect(position.plus(HexPosition.Center)).toBe(position);
      expect(HexPosition.Center.plus(position)).toBe(position);
    });
    it("returns same object when adding 0, 0", () => {
      const position = Hex(1, 2);
      expect(position.plus(Hex(0, 0))).toBe(position);
      expect(Hex(0, 0).plus(position)).toBe(position);
    });
  });

  describe("minus", () => {
    it("can subtract 2 positions", () => {
      expect(Hex(1, 2).minus(Hex(3, 4))).toEqual(Hex(-2, -2));
    });
    it("returns same object when subtracting Center", () => {
      const position = Hex(1, 2);
      expect(position.minus(HexPosition.Center)).toBe(position);
    });
    it("returns correct object when subtracting from Center", () => {
      expect(HexPosition.Center.minus(Hex(1, 2))).toEqual(Hex(-1, -2));
    });
  });

  describe("getSurroundingPositions", () => {
    it("gets correct neighbours", () => {
      expect(sortPositions(Hex(1, 2).getSurroundingPositions())).toEqual(sortPositions([
        Hex(2, 2),
        Hex(0, 2),
        Hex(1, 3),
        Hex(1, 1),
        Hex(1, 2, 1),
        Hex(1, 2, -1),
      ]));
    });
  });

  describe("getSurroundingPositionsMulti", () => {
    const makeCheckPositions = (depth: number) => {
      return (positions: HexPosition[], expectedPositions: HexPosition[]) => {
        expect(sortPositions(HexPosition.getSurroundingPositionsMulti(positions, depth)))
          .toEqual(sortPositions(expectedPositions));
      };
    }
    describe("depth = 1", () => {
      const checkPositions = makeCheckPositions(1);
      it("Returns nothing for empty", () => {
        checkPositions([], []);
      });
      it("Returns 6 surrounding tiles for 1 tile", () => {
        checkPositions([HexPosition.Center], HexPosition.Center.getSurroundingPositions());
      });
      it("Returns 9 surrounding tiles for 3 tiles", () => {
        const centerTile = HexPosition.Center;
        const bottomLeftTile = Hex(0, 0, 1);
        const bottomRightTile = Hex(0, 1);
        checkPositions([centerTile, bottomLeftTile, bottomRightTile], [
          centerTile.offset(-1, 0),
          centerTile.offset(0, -1),
          centerTile.offset(0, 0, -1),
          centerTile.offset(1, 0),
          bottomRightTile.offset(1, 0),
          bottomRightTile.offset(0, 1),
          bottomRightTile.offset(0, 0, 1),
          bottomLeftTile.offset(0, 0, 1),
          bottomLeftTile.offset(-1, 0),
        ]);
      });
    });
    describe("depth = 2", () => {
      const checkPositions = makeCheckPositions(2);
      it("Returns nothing for empty", () => {
        checkPositions([], []);
      });
      it("Returns 18 surrounding tiles for 1 tile", () => {
        const centerTile = HexPosition.Center;
        checkPositions([centerTile], [
          ...centerTile.getSurroundingPositions(),
          centerTile.offset(1, 0, -1),
          centerTile.offset(2, 0),
          centerTile.offset(1, 1),
          centerTile.offset(0, 2),
          centerTile.offset(0, 1, 1),
          centerTile.offset(0, 0, 2),
          centerTile.offset(-1, 0, 1),
          centerTile.offset(-2, 0),
          centerTile.offset(-1, -1),
          centerTile.offset(0, -2),
          centerTile.offset(0, -1, -1),
          centerTile.offset(0, 0, -2),
        ]);
      });
      it("Returns 24 surrounding tiles for 3 tiles", () => {
        const centerTile = HexPosition.Center;
        const bottomLeftTile = Hex(0, 0, 1);
        const bottomRightTile = Hex(0, 1);
        checkPositions([centerTile, bottomLeftTile, bottomRightTile], [
          centerTile.offset(-1, 0),
          centerTile.offset(0, -1),
          centerTile.offset(0, 0, -1),
          centerTile.offset(1, 0),
          bottomRightTile.offset(1, 0),
          bottomRightTile.offset(0, 1),
          bottomRightTile.offset(0, 0, 1),
          bottomLeftTile.offset(0, 0, 1),
          bottomLeftTile.offset(-1, 0),
          bottomRightTile.offset(2, 0),
          bottomRightTile.offset(1, 1),
          bottomRightTile.offset(0, 2),
          bottomRightTile.offset(0, 1, 1),
          bottomRightTile.offset(0, 0, 2),
          bottomLeftTile.offset(0, 0, 2),
          bottomLeftTile.offset(-1, 0, 1),
          bottomLeftTile.offset(-2, 0),
          bottomLeftTile.offset(-1, -1),
          bottomLeftTile.offset(0, -2),
          centerTile.offset(0, -2),
          centerTile.offset(0, -1, -1),
          centerTile.offset(0, 0, -2),
          centerTile.offset(1, 0, -1),
          centerTile.offset(2, 0),
        ]);
      });
    });
  });

  describe("rotate", () => {
    const getAllRotations = (start: HexPosition, center: HexPosition, clockwise: boolean): HexPosition[] => {
      const multiplier = clockwise ? 1 : -1;
      const rotations = [
        start.rotate(1 * multiplier, center),
        start.rotate(2 * multiplier, center),
        start.rotate(3 * multiplier, center),
        start.rotate(4 * multiplier, center),
        start.rotate(5 * multiplier, center),
      ];
      if (!clockwise) {
        rotations.reverse();
      }
      rotations.push(...[
        start.rotate(5 * multiplier, center).rotate(1 * multiplier, center),
      ]);
      return rotations;
    };
    const cases: [string, HexPosition][] = [
      ["0 even row", Hex(0, 0)],
      ["negative even row", Hex(0, -1, -1)],
      ["positive even row", Hex(0, 1, 1)],
      ["negative odd row", Hex(0, 0, -1)],
      ["positive odd row", Hex(0, 1)],
    ];
    for (const clockwise of [true, false]) {
      for (const [name, center] of cases) {
        ((name, center, clockwise) => {
          describe(`${clockwise ? "clockwise" : "counterclockwise"} around ${name}`, () => {
            it("rotates right 1", () => {
              const start = center.offset(1, 0);
              expect(getAllRotations(start, center, clockwise)).toEqual([
                center.offset(0, 1),
                center.offset(0, 0, 1),
                center.offset(-1, 0),
                center.offset(0, -1),
                center.offset(0, 0, -1),
                center.offset(1, 0),
              ]);
            });
            it("rotates right 2", () => {
              const start = center.offset(2, 0);
              expect(getAllRotations(start, center, clockwise)).toEqual([
                center.offset(0, 2),
                center.offset(0, 0, 2),
                center.offset(-2, 0),
                center.offset(0, -2),
                center.offset(0, 0, -2),
                center.offset(2, 0),
              ]);
            });
            it("rotates right 3", () => {
              const start = center.offset(3,0 );
              expect(getAllRotations(start, center, clockwise)).toEqual([
                center.offset(0, 3),
                center.offset(0, 0, 3),
                center.offset(-3, 0),
                center.offset(0, -3),
                center.offset(0, 0, -3),
                center.offset(3, 0),
              ]);
            });
            it("rotates right 1 bottom-right 1", () => {
              const start = center.offset(1, 1);
              expect(getAllRotations(start, center, clockwise)).toEqual([
                center.offset(0, 1, 1),
                center.offset(-1, 0, 1),
                center.offset(-1, -1),
                center.offset(0, -1, -1),
                center.offset(1, 0, -1),
                center.offset(1, 1),
              ]);
            });
            it("rotates right 2 bottom-right 1", () => {
              const start = center.offset(2, 1);
              expect(getAllRotations(start, center, clockwise)).toEqual([
                center.offset(0, 2, 1),
                center.offset(-1, 0, 2),
                center.offset(-2, -1),
                center.offset(0, -2, -1),
                center.offset(1, 0, -2),
                center.offset(2, 1),
              ]);
            });
            it("rotates right 1 bottom-right 2", () => {
              const start = center.offset(1, 2);
              expect(getAllRotations(start, center, clockwise)).toEqual([
                center.offset(0, 1, 2),
                center.offset(-2, 0, 1),
                center.offset(-1, -2),
                center.offset(0, -1, -2),
                center.offset(2, 0, -1),
                center.offset(1, 2),
              ]);
            });
          });
        })(name, center, clockwise);
      }
    }
  });

  describe("getTilePosition", () => {
    it("gets tile position for {0, 0}", () => {
      expect(HexPosition.Center.getTilePosition(100)).toEqualCloseTo({x: 0, y: 0})
    });
    it("gets tile position for {1, 0}", () => {
      expect(HexPosition.fromCartesian({x: 1, y: 0}).getTilePosition(100)).toEqualCloseTo({x: 173.20508075688772, y: 0})
    });
    it("gets tile position for {0, 1}", () => {
      expect(HexPosition.fromCartesian({x: 0, y: 1}).getTilePosition(100)).toEqualCloseTo({x: 86.60254037844386, y: 150})
    });
    it("gets tile position for {1, 1}", () => {
      expect(HexPosition.fromCartesian({x: 1, y: 1}).getTilePosition(100)).toEqualCloseTo({x: 259.8076211353316, y: 150})
    });
    it("gets tile position for {0, 2}", () => {
      expect(HexPosition.fromCartesian({x: 0, y: 2}).getTilePosition(100)).toEqualCloseTo({x: 0, y: 300})
    });
  });

});
