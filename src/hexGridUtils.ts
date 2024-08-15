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
  if (!isCenter(around)) {
    if (isRowEven(around.y)) {
      const offsetedPosition = {
        x: position.x - around.x,
        y: position.y - around.y,
      };
      const offsetAndRotated = rotatePositionCW(offsetedPosition, count);
      return {
        x: offsetAndRotated.x + around.x,
        y: offsetAndRotated.y + around.y,
      };
    } else {
      const offsetedPosition = offsetPosition(position, 0, 0, -1);
      const offsetAround = offsetPosition(around, 0, 0, -1);
      const offsetAndRotated = rotatePositionCW(offsetedPosition, count, offsetAround);
      return offsetPosition(offsetAndRotated, 0, 0, 1);
    }
  }
  count = (count - 1) % 6 + 1;
  if (count === 0) {
    return position;
  }
  if (count > 1) {
    let result = position;
    for (const _count of _.range(count)) {
      result = rotatePositionCW(result, 1, around);
    }
    return result;
  }
  if (isCenter(position)) {
    return position;
  }
  if (position.y === 0) {
    const xOffset = position.x;
    if (xOffset > 0) {
      return offsetPosition(position, 0, 0, xOffset);
    } else if (xOffset < 0) {
      return offsetPosition(position, 0, 0, xOffset);
    }
    return position;
  }
  const yOffset = position.y;
  if (yOffset > 0) {
    const bottomRightPosition = offsetPosition(Center, 0, yOffset);
    const xOffset = position.x - bottomRightPosition.x;
    const baseResult = offsetPosition(Center, 0, 0, yOffset);
    if (xOffset > 0) {
      return offsetPosition(baseResult, 0, xOffset);
    } else if (xOffset < 0) {
      return offsetPosition(baseResult, 0, xOffset);
    }
    return baseResult;
  } else {
    const topLeftPosition = offsetPosition(Center, 0, yOffset);
    const xOffset = position.x - topLeftPosition.x;
    const baseResult = offsetPosition(Center, 0, 0, yOffset);
    if (xOffset > 0) {
      return offsetPosition(baseResult, 0, xOffset);
    } else if (xOffset < 0) {
      return offsetPosition(baseResult, 0, xOffset);
    }
    return baseResult;
  }
}
