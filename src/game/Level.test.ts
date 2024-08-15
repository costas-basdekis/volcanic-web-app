import {Level} from "./Level";
import {Piece} from "./Piece";
import {sortPositions} from "../testing/utils";
import {Center, offsetPosition} from "../hexGridUtils";

describe("Level", () => {
  const level = Level.makeEmpty(1)
    .putPiece(Piece.presets.BlackWhite.moveFirstTileTo(Center));
  const [tile1, tile2, tile3] = level.tiles;
  describe("getPlaceablePositionsForPiece", () => {
    it("returns center for empty level", () => {
      expect(Level.makeEmpty(1).getPlaceablePositionsForPiece(Piece.presets.BlackWhite)).toEqual([Center]);
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
});
