import {Level} from "./Level";
import {Piece} from "./Piece";
import {sortPositions} from "../testing/utils";
import {Center, getRightPosition, getTopLeftPosition, getTopRightPosition} from "../hexGridUtils";

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
        tile3.getRightPosition(),
        tile3.getBottomRightPosition(),
        tile3.getBottomLeftPosition(),
        tile2.getBottomLeftPosition(),
        tile2.getLeftPosition(),
        getTopLeftPosition(tile2.getLeftPosition()),
        getTopLeftPosition(tile1.getLeftPosition()),
        getTopLeftPosition(tile1.getTopLeftPosition()),
        getTopRightPosition(tile1.getTopLeftPosition()),
        getTopRightPosition(tile1.getTopRightPosition()),
        getRightPosition(tile1.getTopRightPosition()),
        getRightPosition(tile1.getRightPosition()),
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
