import {UnitMap} from "./UnitMap";
import {Unit} from "./Unit";
import {Center, makePositionKey} from "../hexGridUtils";
import {Piece} from "./Piece";
import {Level} from "./Level";
import {sortPositions} from "../testing/utils";
import {Board} from "./Board";

describe("UnitMap", () => {
  describe("fromLevels", () => {
    const board = Board.makeEmpty()
      .placePiece(Piece.presets.WhiteBlack)
      .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo({x: -1, y: 0}))
      .placeUnit(Unit.Pawn("white", 1), {x: -1, y: 1});
    expect(Array.from(UnitMap.fromLevels(board.levels.values()).map.keys()).sort()).toEqual([
      {x: -2, y: 0},
      {x: -1, y: 0},
      {x: 0, y: 0},
      {x: -2, y: 1},
      {x: -1, y: 1},
      {x: 0, y: 1},
    ].map(position => makePositionKey(position)).sort());
  });
  describe("canPlaceUnit", () => {
    it("cannot place unit in empty map", () => {
      expect(UnitMap.empty().canPlaceUnit(Unit.Pawn("white", 1), Center)).toBe(false);
    });
    describe("on map with 1 piece", () => {
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
      it("cannot place pawn next to same-player's group", () => {
        const board = Board.makeEmpty()
          .placePiece(Piece.presets.WhiteBlack)
          .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo({x: -1, y: 0}))
          .placeUnit(Unit.Pawn("white", 1), {x: -1, y: 1});
        expect(board.unitMap.canPlaceUnit(Unit.Pawn("white", 1), {x: -2, y: 1})).toBe(false);
      });
      it("can place pawn next to opponent's group", () => {
        const board = Board.makeEmpty()
          .placePiece(Piece.presets.WhiteBlack)
          .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo({x: -1, y: 0}))
          .placeUnit(Unit.Pawn("white", 1), {x: -1, y: 1});
        expect(board.unitMap.canPlaceUnit(Unit.Pawn("black", 1), {x: -2, y: 1})).toBe(true);
        expect(board.unitMap.canPlaceUnit(Unit.Pawn("black", 1), {x: 0, y: 1})).toBe(true);
      });
    });
  });
  describe("getUnitPlaceablePositions", () => {
    it("returns nothing for empty map", () => {
      expect(UnitMap.empty().getUnitPlaceablePositions(Unit.Pawn("white", 1))).toEqual([]);
    });
    it("returns 2 positions for map with 1 piece", () => {
      const unitMap = UnitMap.fromLevels([
        Level.fromPieces(1, [Piece.presets.BlackWhite], null, UnitMap.empty()),
      ]);
      expect(sortPositions(unitMap.getUnitPlaceablePositions(Unit.Pawn("white", 1)))).toEqual(sortPositions([
        {x: -1, y: 1},
        {x: 0, y: 1},
      ]));
    });
    it("returns 1 positions for map 2 pieces and 1 own group", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.WhiteBlack)
        .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo({x: -1, y: 0}))
        .placeUnit(Unit.Pawn("white", 1), {x: -1, y: 1});
      expect(sortPositions(board.unitMap.getUnitPlaceablePositions(Unit.Pawn("white", 1)))).toEqual(sortPositions([
        {x: -2, y: 0},
      ]));
    });
    it("returns 3 positions for map 2 pieces and 1 opponent group", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.WhiteBlack)
        .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo({x: -1, y: 0}))
        .placeUnit(Unit.Pawn("white", 1), {x: -1, y: 1});
      expect(sortPositions(board.unitMap.getUnitPlaceablePositions(Unit.Pawn("black", 1)))).toEqual(sortPositions([
        {x: -2, y: 0},
        {x: -2, y: 1},
        {x: 0, y: 1},
      ]));
    });
  });
});
