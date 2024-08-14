import {Level} from "./Level";
import {Piece} from "./Piece";
import {sortPositions} from "../testing/utils";
import {getRightPosition, getTopLeftPosition, getTopRightPosition} from "../hexGridUtils";

describe("Level", () => {
  const level = Level.makeEmpty(1)
    .putPiece(Piece.presets.BlackWhite.moveFirstTileTo({x: 4, y: 3}));
  const [tile1, tile2, tile3] = level.tiles;
  describe("getPlaceablePositionsForPiece", () => {
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
      expect(level.canPlacePieceAt(Piece.presets.BlackWhite, {x: 4, y: 3})).toBe(false);
    });
    it("cannot place piece 1 position left", () => {
      expect(level.canPlacePieceAt(Piece.presets.BlackWhite, {x: 3, y: 3})).toBe(false);
    });
    it("cannot place piece 1 position right", () => {
      expect(level.canPlacePieceAt(Piece.presets.BlackWhite, {x: 5, y: 3})).toBe(false);
    });
  });
  describe("doesPieceOverlap", () => {
    it("overlaps with piece at same position", () => {
      expect(level.doesPieceOverlap(Piece.presets.BlackWhite.moveFirstTileTo({x: 4, y: 3}))).toBe(true);
    });
    it("overlaps with piece 1 position left", () => {
      expect(level.doesPieceOverlap(Piece.presets.BlackWhite.moveFirstTileTo({x: 3, y: 3}))).toBe(true);
    });
    it("overlaps with piece 1 position right", () => {
      expect(level.doesPieceOverlap(Piece.presets.BlackWhite.moveFirstTileTo({x: 5, y: 3}))).toBe(true);
    });
  });
});
