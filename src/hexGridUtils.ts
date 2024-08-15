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

export const rotatePosition = (position: Position, count: number, around: Position = Center): Position => {
  // If we're not rotating around the center, then we should offset, rotate, and de-offset
  if (!isCenter(around)) {
    let offsetedPosition = position, offsetedAround = around;

    // When around is on an odd row, we first offset both so that around is on an even row
    if (isRowOdd(around.y)) {
      offsetedPosition = offsetPosition(offsetedPosition, 0, 0, 1);
      offsetedAround = offsetPosition(offsetedAround, 0, 0, 1);
    }

    // When around is on an even row, we simply subtract around
    offsetedPosition = {
      x: offsetedPosition.x - offsetedAround.x,
      y: offsetedPosition.y - offsetedAround.y,
    };

    const offsetedAndRotated = rotatePosition(offsetedPosition, count);

    // Then add back around
    let rotated = {
      x: offsetedAndRotated.x + offsetedAround.x,
      y: offsetedAndRotated.y + offsetedAround.y,
    };

    // And then move back the result if around was on an odd row
    if (isRowOdd(around.y)) {
      rotated = offsetPosition(rotated, 0, 0, -1);
    }

    return rotated;
  }

  // At this point `around` === `Center`
  // Nothing to do if the position is the center
  if (isCenter(position)) {
    return position;
  }

  // Normalise count
  count = (count % 6 + 6) % 6;
  // If we're on different rows, find how far off from the bottom right we are
  const xOffset = position.y === 0 ? 0 : offsetPosition(Center, 0, position.y).x;
  // We can express any position as going right (or left) and then bottom right (or top left)
  // To rotate we go in a different set of directions for each rotation count
  /*
       4
      /
    3 \ /-5
     \-C-\
    2-/ \ 0
        /
       1
   */
  const originalRight = position.x - xOffset;
  const originalBottomRight = position.y;
  // And then we can use the same values to go in the new directions
  switch (count) {
    case 0:
      // Same as original
      // return offsetPosition(Center, originalRight, originalBottomRight);
      return position;
    case 1:
      // Bottom right and then bottom left
      return offsetPosition(Center, 0, originalRight, originalBottomRight);
    case 2:
      // Bottom left and then left
      return offsetPosition(Center, -originalBottomRight, 0, originalRight);
    case 3:
      // Left and then top left
      return offsetPosition(Center, -originalRight, -originalBottomRight);
    case 4:
      // Top left and then top right
      return offsetPosition(Center, 0, -originalRight, -originalBottomRight);
    case 5:
      // Top right and then right
      return offsetPosition(Center, originalBottomRight, 0, -originalRight);
    default:
      // This should never really happen
      throw new Error(`Unexpected count '${count}'`);
  }
}
