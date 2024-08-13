import {Level} from "./Level";
import {Tile} from "./Tile";
import {Position} from "../hexGridUtils";
import _ from "underscore";

describe("Level", () => {
  describe("getSurroundingPositions", () => {
    const sortPositions = (positions: Position[]): Position[] => {
      return _.sortBy(positions, position => Tile.makeKey(position));
    };
    const checkLevel = (level: Level, expectedPositions: Position[]) => {
      expect(sortPositions(level.getSurroundingPositions()))
        .toEqual(sortPositions(expectedPositions));
    };
    it("Returns nothing for empty level", () => {
      checkLevel(Level.makeEmpty(1), []);
    });
    it("Returns 6 surrounding tiles for 1 tile", () => {
      const centerTile = new Tile({position: {x: 0, y: 0}, type: "volcano"});
      checkLevel(Level.makeEmpty(1).putPiece([centerTile]), centerTile.getSurroundingPositions());
    });
    it("Returns 9 surrounding tiles for 3 tiles", () => {
      const centerTile = new Tile({position: {x: 0, y: 0}, type: "volcano"});
      const bottomLeftTile = new Tile({position: {x: -1, y: 1}, type: "volcano"});
      const bottomRightTile = new Tile({position: {x: 0, y: 1}, type: "volcano"});
      checkLevel(Level.makeEmpty(1).putPiece([centerTile, bottomLeftTile, bottomRightTile]), [
        centerTile.getLeftPosition(),
        centerTile.getTopLeftPosition(),
        centerTile.getTopRightPosition(),
        centerTile.getRightPosition(),
        bottomRightTile.getRightPosition(),
        bottomRightTile.getBottomRightPosition(),
        bottomRightTile.getBottomLeftPosition(),
        bottomLeftTile.getBottomLeftPosition(),
        bottomLeftTile.getLeftPosition(),
      ]);
    });
  });
});
