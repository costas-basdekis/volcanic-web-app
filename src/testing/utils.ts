import _ from "underscore";
import {HexPosition} from "../HexPosition";
import {makePositionKey, CartesianPosition} from "../CartesianPosition";

export const sortPositions = <PS extends (CartesianPosition[] | HexPosition[])>(positions: PS): PS => {
  if (!positions.length) {
    return positions;
  }
  if ("x" in positions[0]) {
    return _.sortBy(positions as CartesianPosition[], position => makePositionKey(position)) as PS;
  } else {
    return _.sortBy(positions as HexPosition[], position => position.key) as PS;
  }
};

export const uniquePositions = <PS extends (CartesianPosition[] | HexPosition[])>(positions: PS): PS => {
  const seen: Set<string> = new Set();
  return (positions as (CartesianPosition | HexPosition)[]).filter(position => {
    const key = "x" in position ? makePositionKey(position) : position.key;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  }) as PS;
};
