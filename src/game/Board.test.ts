import {Board} from "./Board";
import {Piece} from "./Piece";
import {Hex, HexPosition} from "./HexPosition";

describe("Board", () => {
  describe("getPlaceablePositionsForPiece", () => {
    it("can place piece in center of empty board", () => {
      const board = Board.makeEmpty();
      expect(board.getPlaceablePositionsForPiece(Piece.presets.BlackWhite)).toEqual([
        [HexPosition.Center, board.levels.get(1)!],
      ]);
    });
    it("can place piece next to single piece", () => {
      const board = Board.makeEmpty().placePiece(Piece.presets.BlackWhite);
      expect(board.getPlaceablePositionsForPiece(Piece.presets.BlackWhite.rotate(1)).length).toEqual(12);
    });
    it("can place piece on top of two other pieces", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.BlackWhite)
        .placePiece(Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(-1, 0)));
      const placeablePositions = board.getPlaceablePositionsForPiece(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)));
      expect(placeablePositions.length).toEqual(16);
      // We have to do this because `_key` is not set otherwise and Jest complains
      const expectedPosition = Hex(-1, 0);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expectedPosition.key;
      expect(placeablePositions.find(([position]) => position.isSameAs(expectedPosition)))
        .toEqual([expectedPosition, board.levels.get(2)]);
    });
    it("cannot place piece on top of two other pieces that have a piece on top of them", () => {
      const board = Board.makeEmpty()
        .placePiece(Piece.presets.BlackWhite)
        .placePiece(Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(-1, 0)))
        .placePiece(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)));
      const placeablePositions = board.getPlaceablePositionsForPiece(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)));
      expect(placeablePositions.length).toEqual(15);
      expect(placeablePositions.find(([position]) => position.isSameAs(Hex(-1, 0))))
        .toEqual(undefined);
      expect(() => {
        board.placePiece(Piece.presets.BlackWhite.moveFirstTileTo(Hex(-1, 0)));
      }).toThrow("Cannot place this piece at any level");
    });
  });
});
