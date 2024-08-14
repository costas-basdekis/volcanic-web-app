import {Level} from "./Level";
import {Tile} from "./Tile";
import {
  getBottomLeftPosition,
  getBottomRightPosition, getLeftPosition,
  getRightPosition, getTopLeftPosition,
  getTopRightPosition,
  Position
} from "../hexGridUtils";
import _ from "underscore";

describe("Level", () => {
  describe("getSurroundingPositions", () => {
    const sortPositions = (positions: Position[]): Position[] => {
      return _.sortBy(positions, position => Tile.makeKey(position));
    };
    const makeCheckLevel = (depth: number) => {
       return (level: Level, expectedPositions: Position[]) => {
        expect(sortPositions(level.getSurroundingPositions(depth)))
          .toEqual(sortPositions(expectedPositions));
      };
    }
    describe("depth = 1", () => {
      const checkLevel = makeCheckLevel(1);
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
    describe("depth = 2", () => {
      const checkLevel = makeCheckLevel(2);
      it("Returns nothing for empty level", () => {
        checkLevel(Level.makeEmpty(1), []);
      });
      it("Returns 18 surrounding tiles for 1 tile", () => {
        const centerTile = new Tile({position: {x: 0, y: 0}, type: "volcano"});
        checkLevel(Level.makeEmpty(1).putPiece([centerTile]), [
          ...centerTile.getSurroundingPositions(),
          getTopRightPosition(centerTile.getRightPosition()),
          getRightPosition(centerTile.getRightPosition()),
          getRightPosition(centerTile.getBottomRightPosition()),
          getBottomRightPosition(centerTile.getBottomRightPosition()),
          getBottomRightPosition(centerTile.getBottomLeftPosition()),
          getBottomLeftPosition(centerTile.getBottomLeftPosition()),
          getBottomLeftPosition(centerTile.getLeftPosition()),
          getLeftPosition(centerTile.getLeftPosition()),
          getLeftPosition(centerTile.getTopLeftPosition()),
          getTopLeftPosition(centerTile.getTopLeftPosition()),
          getTopLeftPosition(centerTile.getTopRightPosition()),
          getTopRightPosition(centerTile.getTopRightPosition()),
        ]);
      });
      it("Returns 24 surrounding tiles for 3 tiles", () => {
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
          getRightPosition(bottomRightTile.getRightPosition()),
          getBottomRightPosition(bottomRightTile.getRightPosition()),
          getBottomRightPosition(bottomRightTile.getBottomRightPosition()),
          getBottomLeftPosition(bottomRightTile.getBottomRightPosition()),
          getBottomLeftPosition(bottomRightTile.getBottomLeftPosition()),
          getBottomLeftPosition(bottomLeftTile.getBottomLeftPosition()),
          getLeftPosition(bottomLeftTile.getBottomLeftPosition()),
          getLeftPosition(bottomLeftTile.getLeftPosition()),
          getTopLeftPosition(bottomLeftTile.getLeftPosition()),
          getTopLeftPosition(bottomLeftTile.getTopLeftPosition()),
          getTopLeftPosition(centerTile.getTopLeftPosition()),
          getTopRightPosition(centerTile.getTopLeftPosition()),
          getTopRightPosition(centerTile.getTopRightPosition()),
          getRightPosition(centerTile.getTopRightPosition()),
          getRightPosition(centerTile.getRightPosition()),
        ]);
      });
    });
  });
});
