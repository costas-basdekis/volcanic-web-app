import {UnitMap} from "./UnitMap";
import {Unit} from "./Unit";
import {Piece} from "./Piece";
import {Level} from "./Level";
import {sortPositions} from "../testing/utils";
import {Board} from "./Board";
import {Hex, HexPosition} from "./HexPosition";

describe("UnitMap", () => {
  describe("fromLevels", () => {
    const board = Board.makeEmpty()
      .placePiece(Piece.presets.WhiteBlack)
      .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo(Hex(-1, 0)))
      .placeUnit(Unit.Pawn("white", 1), Hex(0, 0, 1));
    expect(Array.from(UnitMap.fromLevels(board.levels.values()).map.keys()).sort()).toEqual([
      Hex(-2, 0),
      Hex(-1, 0),
      Hex(0, 0),
      Hex(-2, 1),
      Hex(-1, 1),
      Hex(0, 1),
    ].map(position => position.key).sort());
  });
  describe("canPlaceUnit", () => {
    it("cannot place unit in empty map", () => {
      expect(UnitMap.empty().canPlaceUnit(Unit.Pawn("white", 1), HexPosition.Center)).toBe(false);
    });
    describe("on map with 1 piece", () => {
      const unitMap = UnitMap.fromLevels([
        Level.fromPieces(1, [Piece.presets.BlackWhite], null, UnitMap.empty()),
      ]);
      it("cannot place unit on volcano", () => {
        const because = {reasons: null};
        const canPlaceUnit = unitMap.canPlaceUnit(Unit.Pawn("white", 1), HexPosition.Center, because);
        expect(because.reasons).toBe("There is a volcano there");
        expect(canPlaceUnit).toBe(false);
      });
      it("can place unit on black", () => {
        const because = {reasons: null};
        const canPlaceUnit = unitMap.canPlaceUnit(Unit.Pawn("white", 1), Hex(-1, 1), because);
        expect(because.reasons).toBe(null);
        expect(canPlaceUnit).toBe(true);
      });
      it("can place unit on white", () => {
        const because = {reasons: null};
        const canPlaceUnit = unitMap.canPlaceUnit(Unit.Pawn("white", 1), Hex(0, 1), because);
        expect(because.reasons).toBe(null);
        expect(canPlaceUnit).toBe(true);
      });
      it("cannot place pawn next to same-player's group", () => {
        const board = Board.makeEmpty()
          .placePiece(Piece.presets.WhiteBlack)
          .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo(Hex(-1, 0)))
          .placeUnit(Unit.Pawn("white", 1), Hex(-1, 1));
        expect(board.unitMap.canPlaceUnit(Unit.Pawn("white", 1), Hex(-2, 1))).toBe(false);
      });
      it("can place pawn next to opponent's group", () => {
        const board = Board.makeEmpty()
          .placePiece(Piece.presets.WhiteBlack)
          .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo(Hex(-1, 0)))
          .placeUnit(Unit.Pawn("white", 1), Hex(-1, 1));
        expect(board.unitMap.canPlaceUnit(Unit.Pawn("black", 1), Hex(-2, 1))).toBe(true);
        expect(board.unitMap.canPlaceUnit(Unit.Pawn("black", 1), Hex(0, 1))).toBe(true);
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
        Hex(-1, 1),
        Hex(0, 1),
      ]));
    });
    it("returns 1 positions for map 2 pieces and 1 own group", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.WhiteBlack)
        .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo(Hex(-1, 0)))
        .placeUnit(Unit.Pawn("white", 1), Hex(-1, 1));
      expect(sortPositions(board.unitMap.getUnitPlaceablePositions(Unit.Pawn("white", 1)))).toEqual(sortPositions([
        Hex(-2, 0),
      ]));
    });
    it("returns 3 positions for map 2 pieces and 1 opponent group", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.WhiteBlack)
        .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo(Hex(-1, 0)))
        .placeUnit(Unit.Pawn("white", 1), Hex(-1, 1));
      expect(sortPositions(board.unitMap.getUnitPlaceablePositions(Unit.Pawn("black", 1)))).toEqual(sortPositions([
        Hex(-2, 0),
        Hex(-2, 1),
        Hex(0, 1),
      ]));
    });
  });
});
