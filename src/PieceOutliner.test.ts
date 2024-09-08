import {PieceOutliner} from "./PieceOutliner";
import {Piece} from "./game";
import {sortPositions, uniquePositions} from "./testing/utils";
import {makePositionKey} from "./CartesianPosition";

describe("PieceOutliner", () => {
  describe("groupTilesByLine", () => {
    it("creates 15 groups", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesByLine = outliner.groupTilesByLine(outliner.getTilesLines());
      expect(tilesByLine.size).toEqual(15);
    });
  });
  describe("getPieceOutline", () => {
    it("creates a 12 line outline", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      expect(outliner.getPieceOutline().length).toEqual(12);
    });
    it("creates an outline from all the outline lines points", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(sortPositions(outliner.getPieceOutline())).toEqual(uniquePositions(sortPositions(linesInOutline.flat())));
    });
  });
  describe("groupNextPointsByPoint", () => {
    it("groups into 12 points", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(outliner.groupNextPointsByPoint(linesInOutline).size).toEqual(12);
    });
    it("includes every point in the outlines lines as a key", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(new Set(outliner.groupNextPointsByPoint(linesInOutline).keys()))
        .toEqual(new Set(linesInOutline.flat().map(point => makePositionKey(point))));
    });
    it("includes every point in the outlines lines as a value twice", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(sortPositions(Array.from(outliner.groupNextPointsByPoint(linesInOutline).values()).flat()))
        .toEqual(sortPositions(linesInOutline.flat()));
    });
    it("each group has 2 next points", () => {
      const outliner = new PieceOutliner({piece: Piece.presets.BlackWhite, size: 50, drawSize: 50});
      const tilesLines = outliner.getTilesLines();
      const linesInOutline = outliner.getLinesInOutline(tilesLines);
      expect(new Set(Array.from(outliner.groupNextPointsByPoint(linesInOutline).values()).map(points => points.length))).toEqual(new Set([2]));
    });
  });
});
