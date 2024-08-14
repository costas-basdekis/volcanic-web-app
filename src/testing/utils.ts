import {makePositionKey, Position} from "../hexGridUtils";
import _ from "underscore";

export const sortPositions = (positions: Position[]): Position[] => {
  return _.sortBy(positions, position => makePositionKey(position));
};
