import {
  makeLineKey,
  makePositionKey,
  PieceOutliner,
  truncatePoint
} from "./hexGridUtils";
import {sortPositions, uniquePositions} from "./testing/utils";
import {Piece} from "./game";

describe("makeLineKey", () => {
  it("makes the same key regardless of order", () => {
    expect(makeLineKey([{x: 1, y: 2}, {x: 3, y: 4}])).toEqual(makeLineKey([{x: 3, y: 4}, {x: 1, y: 2}]));
  });
  it("truncates points", () => {
    expect(makeLineKey([
      {x: 43.30127018922194, y: 25.00000000000003},
      {x: 7.105427357601002e-15, y: 50.00000000000001},
    ])).toEqual("0,50|43.301,25")
  });
});

describe("truncatePoint", () => {
  it("truncates similar points to the same one", () => {
    expect(new Set([
      {x: 7.105427357601002e-15, y: 50.00000000000004},
      {x: 7.105427357601002e-15, y: 50.00000000000001},
      {x: 7.105427357601002e-15, y: 50.00000000000004},
      {x: 7.105427357601002e-15, y: 50.00000000000001},
    ].map(point => makePositionKey(truncatePoint(point))))).toEqual(new Set(["0,50"]));
  });
});

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
