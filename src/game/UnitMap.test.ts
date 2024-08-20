import {UnitMap} from "./UnitMap";
import {Unit} from "./Unit";
import {Center} from "../hexGridUtils";
import {Piece} from "./Piece";
import {Level} from "./Level";
import {sortPositions} from "../testing/utils";

describe("UnitMap", () => {
  describe("canPlaceUnit", () => {
    it("cannot place unit in empty map", () => {
      expect(UnitMap.empty().canPlaceUnit(Unit.Pawn("white", 1), Center)).toBe(false);
    });
    describe("on map with 1 tile", () => {
      const unitMap = UnitMap.fromLevels([
        Level.fromPieces(1, [Piece.presets.BlackWhite], null, UnitMap.empty()),
      ]);
      it("cannot place unit on volcano", () => {
        const because = {reasons: null};
        const canPlaceUnit = unitMap.canPlaceUnit(Unit.Pawn("white", 1), Center, because);
        expect(because.reasons).toBe("There is a volcano there");
        expect(canPlaceUnit).toBe(false);
      });
      it("can place unit on black", () => {
        const because = {reasons: null};
        const canPlaceUnit = unitMap.canPlaceUnit(Unit.Pawn("white", 1), {x: -1, y: 1}, because);
        expect(because.reasons).toBe(null);
        expect(canPlaceUnit).toBe(true);
      });
      it("can place unit on white", () => {
        const because = {reasons: null};
        const canPlaceUnit = unitMap.canPlaceUnit(Unit.Pawn("white", 1), {x: 0, y: 1}, because);
        expect(because.reasons).toBe(null);
        expect(canPlaceUnit).toBe(true);
      });
    });
  });
  describe("getUnitPlaceablePositions", () => {
    it("returns nothing for empty map", () => {
      expect(UnitMap.empty().getUnitPlaceablePositions(Unit.Pawn("white", 1))).toEqual([]);
    });
    it("returns 2 positions for map with 1 tile", () => {
      const unitMap = UnitMap.fromLevels([
        Level.fromPieces(1, [Piece.presets.BlackWhite], null, UnitMap.empty()),
      ]);
      expect(sortPositions(unitMap.getUnitPlaceablePositions(Unit.Pawn("white", 1)))).toEqual(sortPositions([
        {x: -1, y: 1},
        {x: 0, y: 1},
      ]));
    });
  });
});
