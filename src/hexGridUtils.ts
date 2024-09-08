import _ from "underscore";
import type {Piece, Tile} from "./game";

export interface CartesianPosition {
  x: number;
  y: number;
}

export type Line = [CartesianPosition, CartesianPosition];

export const makePositionKey = ({x, y}: CartesianPosition): string => {
  return `${x},${y}`;
};

export const isSamePosition = (left: CartesianPosition, right: CartesianPosition): boolean => {
  return left === right || makePositionKey(left) === makePositionKey(right);
}

export const makeLineKey = (line: Line): string => {
  return line.map(point => makePositionKey(truncatePoint(point))).sort().join("|");
};

export const truncatePoint = (point: CartesianPosition, digitCount: number = 3): CartesianPosition => {
  return {
    x: parseFloat(point.x.toFixed(digitCount)),
    y: parseFloat(point.y.toFixed(digitCount)),
  };
}

export class PieceOutliner {
  piece: Piece;
  size: number;
  drawSize: number;

  constructor(attributes: {piece: Piece, size: number, drawSize: number}) {
    this.piece = attributes.piece;
    this.size = attributes.size;
    this.drawSize = attributes.drawSize;
  }

  getPieceOutline(): CartesianPosition [] {
    const tilesLines = this.getTilesLines();
    const linesInOutline = this.getLinesInOutline(tilesLines);
    const nextPointsByPoint = this.groupNextPointsByPoint(linesInOutline);
    return this.traverseOutline(linesInOutline, nextPointsByPoint);
  }

  traverseOutline(linesInOutline: Line[], nextPointsByPoint: Map<string, CartesianPosition[]>): CartesianPosition[] {
    const pieceOutline: CartesianPosition[] = [];
    if (!linesInOutline.length) {
      return pieceOutline;
    }
    let [previousPoint, currentPoint] = linesInOutline[0];
    let currentPointKey = makePositionKey(currentPoint);
    pieceOutline.push(currentPoint);
    while (nextPointsByPoint.has(currentPointKey)!) {
      const nextPoints: Map<string, CartesianPosition> = new Map(nextPointsByPoint.get(currentPointKey)!.map(point => [makePositionKey(point), point]));
      nextPointsByPoint.delete(currentPointKey);
      nextPoints.delete(makePositionKey(previousPoint));
      const [nextPoint] = nextPoints.values();
      pieceOutline.push(nextPoint);
      [previousPoint, currentPoint] = [currentPoint, nextPoint];
      currentPointKey = makePositionKey(currentPoint);
    }
    if (isSamePosition(pieceOutline[0], pieceOutline[pieceOutline.length - 1])) {
      pieceOutline.pop();
    }
    return pieceOutline;
  }

  groupNextPointsByPoint(linesInOutline: Line[]): Map<string, CartesianPosition[]> {
    const nextPointsByPoint: Map<string, CartesianPosition[]> = new Map();
    for (const line of linesInOutline) {
      for (const [point, otherPoint] of [line, [...line].reverse()]) {
        const pointKey = makePositionKey(point);
        if (!nextPointsByPoint.has(pointKey)) {
          nextPointsByPoint.set(pointKey, []);
        }
        nextPointsByPoint.get(pointKey)!.push(otherPoint);
      }
    }
    return nextPointsByPoint;
  }

  getLinesInOutline(tilesLines: Line[][]): Line[] {
    const tilesByLine = this.groupTilesByLine(tilesLines);
    const linesByKey = this.groupLines(tilesLines);
    return Array.from(tilesByLine.entries())
      .filter(([, lineTiles]) => lineTiles.length === 1)
      .map(([lineKey]) => linesByKey.get(lineKey)!);
  }

  groupLines(tilesLines: Line[][]): Map<string, Line> {
    return new Map(tilesLines.flat().map(line => [makeLineKey(line), line]));
  }

  groupTilesByLine(tilesLines: Line[][]): Map<string, Tile[]> {
    const tilesByLine: Map<string, Tile[]> = new Map();
    for (const tileIndex of _.range(tilesLines.length)) {
      const tileLines = tilesLines[tileIndex];
      const tile = this.piece.tiles[tileIndex];
      for (const line of tileLines) {
        const lineKey = makeLineKey(line)
        if (!tilesByLine.has(lineKey)) {
          tilesByLine.set(lineKey, []);
        }
        tilesByLine.get(lineKey)!.push(tile);
      }
    }
    return tilesByLine;
  }

  getTilesLines(): Line[][] {
    const {piece, size} = this;
    const tilesOutlines = piece.tiles
      .map(tile => tile.position.getTileOutline(size, size))
      .map(outline => outline.map(point => truncatePoint(point)));
    return tilesOutlines.map(outline =>
      outline.map((point, index) =>
        [point, outline[(index + 1) % outline.length]]));
  }
}

export function getPieceOutline(piece: Piece, size: number, drawSize: number): CartesianPosition[] {
  return new PieceOutliner(({piece, size, drawSize})).getPieceOutline();
}

export const Center: CartesianPosition = {x: 0, y: 0};
