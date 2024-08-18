import {makePositionKey, Position} from "../hexGridUtils";
import _ from "underscore";

export const sortPositions = (positions: Position[]): Position[] => {
  return _.sortBy(positions, position => makePositionKey(position));
};

export const uniquePositions = (positions: Position[]): Position[] => {
  const seen: Set<string> = new Set();
  return positions.filter(position => {
    const key = makePositionKey(position);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
