import {Level} from "./Level";
import {Piece} from "./Piece";
import {sortPositions} from "../testing/utils";
import {UnitMap} from "./UnitMap";
import {Board} from "./Board";
import {Unit} from "./Unit";
import {Hex, HexPosition} from "../HexPosition";

describe("Level", () => {
  const level = Level.fromPieces(1, [
    Piece.presets.BlackWhite.moveFirstTileTo(HexPosition.Center),
  ], null, UnitMap.empty());
  const [tile1, tile2, tile3] = level.tiles;
  describe("getPlaceablePositionsForPiece", () => {
    describe("at level 1", () => {
      it("returns center for empty level", () => {
        expect(Level.makeEmpty(1, null).getPlaceablePositionsForPiece(Piece.presets.BlackWhite, UnitMap.empty())).toEqual([
          HexPosition.Center,
        ]);
      });
      it("returns 12 positions around first piece", () => {
        expect(sortPositions(level.getPlaceablePositionsForPiece(Piece.presets.BlackWhite, UnitMap.empty()))).toEqual(sortPositions([
          tile3.offsetPosition(1),
          tile3.offsetPosition(0, 1),
          tile3.offsetPosition(0, 0, 1),
          tile2.offsetPosition(0, 0, 1),
          tile2.offsetPosition(-1),
          tile2.offsetPosition(-1, -1),
          tile1.offsetPosition(-1, -1),
          tile1.offsetPosition(0, -2),
          tile1.offsetPosition(0, -1, -1),
          tile1.offsetPosition(0, 0, -2),
          tile1.offsetPosition(1, 0, -1),
          tile1.offsetPosition(2),
        ]));
      });
    });
    describe("at level 2", () => {
      it("cannot place any piece with empty previous level", () => {
        const level2 = Level.makeEmpty(2, Level.makeEmpty(1, null));
        expect(level2.getPlaceablePositionsForPiece(Piece.presets.BlackWhite, UnitMap.empty())).toEqual([]);
      });
      it("cannot place one piece in same position with previous level with a piece", () => {
        const level2 = Level.makeEmpty(2, level);
        expect(level2.getPlaceablePositionsForPiece(Piece.presets.BlackWhite, UnitMap.empty())).toEqual([]);
      });
      it("can place piece fully on top of tiles with previous level wih a lot of pieces", () => {
        const level1 = level
          .placePieceAt(Piece.presets.BlackWhite.rotate(1), Hex(-1, 0), UnitMap.empty())
          .placePieceAt(Piece.presets.BlackWhite.rotate(1), Hex(2, 0), UnitMap.empty())
          .placePieceAt(Piece.presets.BlackWhite.rotate(1), Hex(0, 1, 1), UnitMap.empty());
        const level2 = Level.makeEmpty(2, level1);
        expect(sortPositions(level2.getPlaceablePositionsForPiece(Piece.presets.BlackWhite, UnitMap.empty()))).toEqual(sortPositions([
          Hex(-1, 0),
        ]));
      });
    });
  });
  describe("canPlacePieceAt", () => {
    it("cannot place piece at same position", () => {
      expect(level.canPlacePieceAt(Piece.presets.BlackWhite, HexPosition.Center, UnitMap.empty())).toBe(false);
    });
    it("cannot place piece 1 position left", () => {
      expect(level.canPlacePieceAt(Piece.presets.BlackWhite, Hex(-1, 0), UnitMap.empty())).toBe(false);
    });
    it("cannot place piece 1 position right", () => {
      expect(level.canPlacePieceAt(Piece.presets.BlackWhite, Hex(1, 0), UnitMap.empty())).toBe(false);
    });
  });
  describe("doesPieceOverlap", () => {
    it("overlaps with piece at same position", () => {
      expect(level.doesPieceOverlap(Piece.presets.BlackWhite.moveFirstTileTo(HexPosition.Center))).toBe(true);
    });
    it("overlaps with piece 1 position left", () => {
      expect(level.doesPieceOverlap(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)))).toBe(true);
    });
    it("overlaps with piece 1 position right", () => {
      expect(level.doesPieceOverlap(Piece.presets.BlackWhite.moveFirstTileTo(Hex(1, 0)))).toBe(true);
    });
  });
  describe("canPieceBePlacedOnTop", () => {
    it("doesn't allow piece on empty level", () => {
      expect(Level.makeEmpty(1, null).canPlacePieceOnTop(Piece.presets.BlackWhite, UnitMap.empty())).toBe(false);
    });
    it("doesn't allow piece on empty space", () => {
      expect(level.canPlacePieceOnTop(Piece.presets.BlackWhite.moveFirstTileTo(Hex(3, 2, 1)), UnitMap.empty())).toBe(false);
    });
    it("doesn't allow piece partially on top of pieces", () => {
      expect(level.canPlacePieceOnTop(Piece.presets.BlackWhite.rotate(1), UnitMap.empty())).toBe(false);
    });
    it("doesn't allow piece fully on top of another piece", () => {
      expect(level.canPlacePieceOnTop(Piece.presets.BlackWhite, UnitMap.empty())).toBe(false);
    });
    it("allows piece fully on top of another piece", () => {
      const level1 = level
        .placePieceAt(Piece.presets.BlackWhite.rotate(1), Hex(-1, 0), UnitMap.empty())
        .placePieceAt(Piece.presets.BlackWhite.rotate(1), Hex(2, 0), UnitMap.empty())
        .placePieceAt(Piece.presets.BlackWhite.rotate(1), Hex(0, 1, 1), UnitMap.empty());
      expect(level1.canPlacePieceOnTop(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)), UnitMap.empty())).toBe(true);
    });
    it("cannot place piece over one-pawn group, but would be able to otherwise", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.BlackWhite)
        .placePiece(Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(-1, 0)));
      expect(board.levels.get(1)!.canPlacePieceOnTop(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)), board.unitMap)).toBe(true);
      const boardWithPawn = board
        .placeUnit(Unit.Pawn("white", 1), Hex(-1, 1));
      expect(boardWithPawn.levels.get(1)!.canPlacePieceOnTop(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)), boardWithPawn.unitMap)).toBe(false);
    });
    it("cannot place piece over entire two-pawn group, but would be able to otherwise", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.WhiteWhite)
        .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo(Hex(-1, 0)));
      expect(board.levels.get(1)!.canPlacePieceOnTop(Piece.presets.WhiteBlack.moveFirstTileTo(Hex(-1, 0)), board.unitMap)).toBe(true);
      const boardWithGroup = board
        .placeUnit(Unit.Pawn("white", 1), Hex(-1, 1))
        .expandGroup(Hex(-2, 1), "white");
      expect(boardWithGroup.levels.get(1)!.canPlacePieceOnTop(Piece.presets.WhiteBlack.moveFirstTileTo(Hex(-1, 0)), boardWithGroup.unitMap)).toBe(false);
    });
    it("can place piece over entire big pawn group", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.BlackWhite)
        .placePiece(Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(-1, 0)))
        .placeUnit(Unit.Pawn("white", 1), Hex(-1, 1))
        .expandGroup(Hex(-2, 1), "white")
        .expandGroup(Hex(-2, 0), "white");
      expect(board.levels.get(1)!.canPlacePieceOnTop(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)), board.unitMap)).toBe(true);
    });
    it("cannot place piece over a bishop, but would be able to otherwise", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.WhiteBlack)
        .placePiece(Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(-1, 0)))
        .placePiece(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-2, -1, -1)))
        .placeUnit(Unit.Pawn("white", 1), Hex(-2, 1))
        .expandGroup(Hex(-2, 0), "white")
        .expandGroup(Hex(-3, 0, -1), "white");
      expect(board.levels.get(1)!.canPlacePieceOnTop(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)), board.unitMap)).toBe(true);
      const boardWithBishop = board
        .placeUnit(Unit.Bishop("white"), Hex(-1, 1));
      expect(boardWithBishop.levels.get(1)!.canPlacePieceOnTop(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)), boardWithBishop.unitMap)).toBe(false);
    });
    it("cannot place piece over a rook, but would be able to otherwise", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.WhiteBlack)
        .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo(Hex(-1, 0)))
        .placePiece(Piece.presets.WhiteBlack.moveFirstTileTo(Hex(-1, 0)))
        .placePiece(Piece.presets.WhiteBlack.rotate(3).moveFirstTileTo(Hex(1, 0)))
        .placePiece(Piece.presets.WhiteBlack.rotate(-1))
        .placePiece(Piece.presets.WhiteBlack)
        .placePiece(Piece.presets.WhiteBlack.moveFirstTileTo(Hex(-3, 0)))
        .placePiece(Piece.presets.WhiteBlack.rotate(-1).moveFirstTileTo(Hex(-3, 0)))
        .placePiece(Piece.presets.WhiteBlack.rotate(1).moveFirstTileTo(Hex(-1, 0)))
        .placeUnit(Unit.Pawn("white", 1), Hex(-4, 1))
        .expandGroup(Hex(-3, 1), "white")
        .expandGroup(Hex(-2, 1), "white");
      expect(board.levels.get(3)!.canPlacePieceOnTop(Piece.presets.WhiteBlack.moveFirstTileTo(Hex(-1, 0)), board.unitMap)).toBe(true);
      const boardWithRook = board
        .placeUnit(Unit.Rook("white"), Hex(-1, 1));
      expect(boardWithRook.levels.get(3)!.canPlacePieceOnTop(Piece.presets.WhiteBlack.moveFirstTileTo(Hex(-1, 0)), boardWithRook.unitMap)).toBe(false);
    });
  });
});
