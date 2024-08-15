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
  /*
    The approach has 4 steps:
    * Normalise count and check if we have actually something to do
    * Offset position so around is Center
      * We will have to do extra work if around is on an odd row
    * Rotate position
      * Decompose position into right and bottom-right coordinates
      * Apply the coordinates to the new directions, based on rotation count
    * Un-apply the original offset

    Decomposing the position:
    We can express any offsetedPosition as going right (or left) and then bottom right (or top left)
    To rotate we go in a different set of directions for each rotation count.
    Bellow C is Center, P is the original position, and 1-5 are the resulting rotations
       4
      /
    3 \ /-5
     \-C-\
    2-/ \ P
        /
       1
  */

  // Normalise count
  count = (count % 6 + 6) % 6;
  // Nothing to do with no count
  if (count === 0) {
    return position;
  }
  // Nothing to do with position on around
  if (makePositionKey(position) === makePositionKey(around)) {
    return position;
  }

  // Offset the position so `around` === `Center`
  let offsetedPosition = position, offsetedAround = around;
  if (!isCenter(around)) {
    // When around is on an odd row, we first offset both so that around is on an even row
    if (isRowOdd(around.y)) {
      // These are equivalent to:
      // offsetedPosition = offsetPosition(offsetedPosition, 0, 0, 1);
      // offsetedAround = offsetPosition(offsetedAround, 0, 0, 1);
      offsetedPosition = {
        x: offsetedPosition.x - (isRowEven(offsetedPosition.y) ? 1 : 0),
        y: offsetedPosition.y + 1,
      };
      offsetedAround = {
        x: offsetedAround.x - (isRowEven(offsetedAround.y) ? 1 : 0),
        y: offsetedAround.y + 1,
      };
    }

    // When around is on an even row, we simply subtract around
    offsetedPosition = {
      x: offsetedPosition.x - offsetedAround.x,
      y: offsetedPosition.y - offsetedAround.y,
    };
  }

  // At this point `around` === `Center`
  let offsetedAndRotated = offsetedPosition;
  // If we're on different rows, find how far off from the bottom right we are
  const xOffset = offsetedPosition.y === 0 ? 0 : offsetPosition(Center, 0, offsetedPosition.y).x;
  // Decompose position
  const originalRight = offsetedPosition.x - xOffset;
  const originalBottomRight = offsetedPosition.y;
  // And then we can use the same values to go in the new directions
  switch (count) {
    case 1:
      // Bottom right and then bottom left
      offsetedAndRotated = offsetPosition(Center, 0, originalRight, originalBottomRight);
      break;
    case 2:
      // Bottom left and then left
      offsetedAndRotated = offsetPosition(Center, -originalBottomRight, 0, originalRight);
      break;
    case 3:
      // Left and then top left
      offsetedAndRotated = offsetPosition(Center, -originalRight, -originalBottomRight);
      break;
    case 4:
      // Top left and then top right
      offsetedAndRotated = offsetPosition(Center, 0, -originalRight, -originalBottomRight);
      break;
    case 5:
      // Top right and then right
      offsetedAndRotated = offsetPosition(Center, originalBottomRight, 0, -originalRight);
      break;
    default:
      // This should never really happen
      throw new Error(`Unexpected count '${count}'`);
  }

  let rotated = offsetedAndRotated;
  // If we applied any offset, un-apply it
  if (!isCenter(around)) {
    // Then add back around
    rotated = {
      x: rotated.x + offsetedAround.x,
      y: rotated.y + offsetedAround.y,
    };

    // And then move the result back if around was on an odd row
    if (isRowOdd(around.y)) {
      // This is equivalent to:
      // rotated = offsetPosition(rotated, 0, 0, -1);
      rotated = {
        x: rotated.x + (isRowOdd(rotated.y) ? 1 : 0),
        y: rotated.y - 1,
      };
    }
  }

  return rotated;
}
