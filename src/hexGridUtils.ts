import _ from "underscore";

export interface Position {
  x: number;
  y: number;
}

export const makePositionKey = ({x, y}: Position): string => {
  return `${x},${y}`;
};

export const isRowEven = (y: number): boolean => {
  return ((y % 2) + 2) % 2 === 0;
}

export const isRowOdd = (y: number): boolean => {
  return ((y % 2) + 2) % 2 === 1;
}

export const getTilePosition = (position: Position, size: number): Position => {
  const evenRow = isRowEven(position.y);
  const offsetX = position.x + (evenRow ? 0 : 0.5);
  const offsetY = position.y;
  return {
    x: offsetX * Math.sin(Math.PI / 3) * size * 2,
    y: offsetY * Math.cos(Math.PI / 3) * size * 3,
  };
};

export const offsetPosition = (position: Position, right: number = 0, bottomRight: number = 0, bottomLeft: number = 0): Position => {
  let result = position;
  if (right !== 0) {
    const {x, y}: Position = result;
    result = {x: x + right, y};
  }
  if (bottomRight > 0) {
    const {x, y}: Position = result;
    const count = bottomRight;
    const oddCount = count % 2 === 1;
    const oddFirstRow = isRowOdd(y);
    result = {
      x: x + Math.floor(count / 2) + (oddCount && oddFirstRow ? 1 : 0),
      y: y + count,
    };
  } else if (bottomRight < 0) {
    const {x, y}: Position = result;
    const count = -bottomRight;
    const oddCount = count % 2 === 1;
    const evenFirstRow = isRowEven(y);
    result = {
      x: x - Math.floor(count / 2) - (oddCount && evenFirstRow ? 1 : 0),
      y: y - count,
    };
  }
  if (bottomLeft > 0) {
    const {x, y}: Position = result;
    const count = bottomLeft;
    const oddCount = count % 2 === 1;
    const evenFirstRow = isRowEven(y);
    result = {
      x: x - Math.floor(count / 2) - (oddCount && evenFirstRow ? 1 : 0),
      y: y + count,
    };
  } else if (bottomLeft < 0) {
    const {x, y}: Position = result;
    const count = -bottomLeft;
    const oddCount = count % 2 === 1;
    const oddFirstRow = isRowOdd(y);
    result = {
      x: x + Math.floor(count / 2) + (oddCount && oddFirstRow ? 1 : 0),
      y: y - count,
    };
  }
  return result
};

export const getSurroundingPositions = (position: Position): Position[] => {
  return [
    offsetPosition(position, 1),
    offsetPosition(position, 0, 1),
    offsetPosition(position, 0, 0, 1),
    offsetPosition(position, -1),
    offsetPosition(position, 0, -1),
    offsetPosition(position, 0, 0, -1),
  ];
};

export const getSurroundingPositionsMulti = (startingPositions: Position[], depth: number): Position[] => {
  const surroundingPositions: Position[] = [];
  const prohibitedKeys: Set<string> = new Set(startingPositions.map(position => makePositionKey(position)));
  for (const _iteration of _.range(depth)) {
    const newSurroundingPositions: Position[] = [];
    for (const position of startingPositions) {
      for (const neighbourPosition of getSurroundingPositions(position)) {
        const key: string = makePositionKey(neighbourPosition);
        if (prohibitedKeys.has(key)) {
          continue;
        }
        prohibitedKeys.add(key);
        newSurroundingPositions.push(neighbourPosition);
      }
    }
    startingPositions = newSurroundingPositions;
    surroundingPositions.push(...newSurroundingPositions);
  }
  return surroundingPositions;
};

export const Center: Position = {x: 0, y: 0};
export const CenterKey: string = makePositionKey(Center);
export const isCenter = (position: Position): boolean => {
  return position === Center || makePositionKey(position) === CenterKey;
}

export const rotatePositionCW = (position: Position, count: number, around: Position = Center): Position => {
  // If we're not rotating around the center, then we should offset, rotate, and de-offset
  if (!isCenter(around)) {
    if (isRowEven(around.y)) {
      // When around is on an even row, it's straightforward
      const offsetedPosition = {
        x: position.x - around.x,
        y: position.y - around.y,
      };
      const offsetedAndRotated = rotatePositionCW(offsetedPosition, count);
      return {
        x: offsetedAndRotated.x + around.x,
        y: offsetedAndRotated.y + around.y,
      };
    } else {
      // When around is on an odd row, we first offset both so that around is on an even row
      const offsetedPosition = offsetPosition(position, 0, 0, 1);
      const offsetedAround = offsetPosition(around, 0, 0, 1);
      const offsetedAndRotated = rotatePositionCW(offsetedPosition, count, offsetedAround);
      // And then move back the result
      return offsetPosition(offsetedAndRotated, 0, 0, -1);
    }
  }

  // At this point `around` === `Center`
  // Nothing to do if the position is the center
  if (isCenter(position)) {
    return position;
  }

  // Normalise count
  count = (count - 1) % 6 + 1;
  // Apply `count` rotations
  let result = position;
  for (const _count of _.range(count)) {
    // If we're on different rows, find how far off from the bottom right we are
    const xOffset = offsetPosition(Center, 0, result.y).x;
    result = offsetPosition(Center, 0, result.x - xOffset, result.y);
  }
  return result;
}
