import {Piece} from "./Piece";
import {Tile} from "./Tile";
import {Hex, HexPosition} from "../HexPosition";

describe("Piece", () => {
  describe("moveFirstTileTo", () => {
    it("moving to same position returns same piece", () => {
      const piece = Piece.presets.BlackWhite;
      expect(piece.moveFirstTileTo(piece.tiles[0].position)).toEqual(piece);
    });
    const cases: [string, (tile: Tile) => HexPosition][] = [
      ["right", tile => tile.offsetPosition(1)],
      ["bottom right", tile => tile.offsetPosition(0, 1)],
      ["bottom left", tile => tile.offsetPosition(0, 0, 1)],
      ["left", tile => tile.offsetPosition(-1)],
      ["top left", tile => tile.offsetPosition(0, -1)],
      ["top right", tile => tile.offsetPosition(0, 0, -1)],
    ];
    const startingRows: [string, Piece][] = [
      ["even", new Piece({
        tiles: [
          new Tile({position: Hex(0, 0), type: "volcano"}),
          new Tile({position: Hex(0, 0, 1), type: "white"}),
          new Tile({position: Hex(0, 1), type: "black"}),
        ],
      })],
      ["odd", new Piece({
        tiles: [
          new Tile({position: Hex(0, 0, 1), type: "volcano"}),
          new Tile({position: Hex(0, 0, 2), type: "white"}),
          new Tile({position: Hex(0, 1, 1), type: "black"}),
        ],
      })],
    ];
    for (const [rowName, piece] of startingRows) {
      for (const [caseName, getNewPosition] of cases) {
        ((rowName, piece, caseName, getNewPosition) => {
          it(`moves ${rowName} row ${caseName}`, () => {
            const [tile1] = piece.tiles;
            expect(piece.moveFirstTileTo(getNewPosition(tile1))).toEqual(new Piece({
              tiles: piece.tiles.map(tile => new Tile({...tile, position: getNewPosition(tile)})),
            }));
          });
        })(rowName, piece, caseName, getNewPosition);
      }
    }
  });
});
