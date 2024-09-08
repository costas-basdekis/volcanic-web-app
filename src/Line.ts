import {CartesianPosition, makePositionKey, truncatePoint} from "./CartesianPosition";

export type Line = [CartesianPosition, CartesianPosition];

export const makeLineKey = (line: Line): string => {
  return line.map(point => makePositionKey(truncatePoint(point))).sort().join("|");
};
