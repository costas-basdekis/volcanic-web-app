import {Level} from "./Level";
import {Piece} from "./Piece";
import {sortPositions} from "../testing/utils";
import {Center, offsetPosition} from "../hexGridUtils";

describe("Level", () => {
  const level = Level.fromPieces(1, [
    Piece.presets.BlackWhite.moveFirstTileTo(Center),
  ], null);
  const [tile1, tile2, tile3] = level.tiles;
  describe("getPlaceablePositionsForPiece", () => {
    describe("at level 1", () => {
      it("returns center for empty level", () => {
        expect(Level.makeEmpty(1, null).getPlaceablePositionsForPiece(Piece.presets.BlackWhite)).toEqual([Center]);
      });
      it("returns 12 positions around first piece", () => {
        expect(sortPositions(level.getPlaceablePositionsForPiece(Piece.presets.BlackWhite))).toEqual(sortPositions([
          tile3.offsetPosition(1),
          tile3.offsetPosition(0, 1),
          tile3.offsetPosition(0, 0, 1),
          tile2.offsetPosition(0, 0, 1),
          tile2.offsetPosition(-1),
          offsetPosition(tile2.offsetPosition(-1), 0, -1),
          offsetPosition(tile1.offsetPosition(-1), 0, -1),
          offsetPosition(tile1.offsetPosition(0, -1), 0, -1),
          offsetPosition(tile1.offsetPosition(0, -1), 0, 0, -1),
          offsetPosition(tile1.offsetPosition(0, 0, -1), 0, 0, -1),
          offsetPosition(tile1.offsetPosition(0, 0, -1), 1),
          offsetPosition(tile1.offsetPosition(1), 1),
        ]));
      });
    });
    describe("at level 2", () => {
      it("cannot place any piece with empty previous level", () => {
        const level2 = Level.makeEmpty(2, Level.makeEmpty(1, null));
        expect(level2.getPlaceablePositionsForPiece(Piece.presets.BlackWhite)).toEqual([]);
      });
      it("cannot place one piece in same position with previous level with a tile", () => {
        const level2 = Level.makeEmpty(2, level);
        expect(level2.getPlaceablePositionsForPiece(Piece.presets.BlackWhite)).toEqual([]);
      });
      it("can place piece fully on top of tiles with previous level wih a lot of tiles", () => {
        const level1 = level
          .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: -1, y: 0})
          .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: 2, y: 0})
          .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: 0, y: 2});
        const level2 = Level.makeEmpty(2, level1);
        expect(sortPositions(level2.getPlaceablePositionsForPiece(Piece.presets.BlackWhite))).toEqual(sortPositions([
          {x: -1, y: 1},
          {x: -1, y: 0},
          {x: 1, y: 0},
        ]));
      });
    });
  });
  describe("canPlacePieceAt", () => {
    it("cannot place piece at same position", () => {
      expect(level.canPlacePieceAt(Piece.presets.BlackWhite, Center)).toBe(false);
    });
    it("cannot place piece 1 position left", () => {
      expect(level.canPlacePieceAt(Piece.presets.BlackWhite, {x: -1, y: 0})).toBe(false);
    });
    it("cannot place piece 1 position right", () => {
      expect(level.canPlacePieceAt(Piece.presets.BlackWhite, {x: 1, y: 0})).toBe(false);
    });
  });
  describe("doesPieceOverlap", () => {
    it("overlaps with piece at same position", () => {
      expect(level.doesPieceOverlap(Piece.presets.BlackWhite.moveFirstTileTo(Center))).toBe(true);
    });
    it("overlaps with piece 1 position left", () => {
      expect(level.doesPieceOverlap(Piece.presets.BlackWhite.moveFirstTileTo({x: -1, y: 0}))).toBe(true);
    });
    it("overlaps with piece 1 position right", () => {
      expect(level.doesPieceOverlap(Piece.presets.BlackWhite.moveFirstTileTo({x: 1, y: 0}))).toBe(true);
    });
  });
  describe("canPieceBePlacedOnTop", () => {
    it("doesn't allow piece on empty level", () => {
      expect(Level.makeEmpty(1, null).canPlacePieceOnTop(Piece.presets.BlackWhite)).toBe(false);
    });
    it("doesn't allow piece on empty space", () => {
      expect(level.canPlacePieceOnTopAt(Piece.presets.BlackWhite,{x: 3, y: 3})).toBe(false);
    });
    it("doesn't allow piece partially on top of tiles", () => {
      expect(level.canPlacePieceOnTop(Piece.presets.BlackWhite.rotate(1))).toBe(false);
    });
    it("doesn't allow piece fully on top of another tile", () => {
      expect(level.canPlacePieceOnTop(Piece.presets.BlackWhite)).toBe(false);
    });
    it("allows piece fully on top of another tile", () => {
      const level1 = level
        .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: -1, y: 0})
        .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: 2, y: 0})
        .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: 0, y: 2});
      expect(level1.canPlacePieceOnTop(Piece.presets.BlackWhite.moveFirstTileTo({x: -1, y: 0}))).toBe(true);
    });
  });
});
