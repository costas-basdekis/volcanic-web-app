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

export const getRightPosition = ({x, y}: Position, count: number = 1): Position => {
  return {x: x + count, y};
};

export const getLeftPosition = ({x, y}: Position, count: number = 1): Position => {
  return {x: x - count, y};
};

export const getTopRightPosition = ({x, y}: Position, count: number = 1): Position => {
  const oddCount = count % 2 === 1;
  const oddFirstRow = isRowOdd(y);
  return {
    x: x + Math.floor(count / 2) + (oddCount && oddFirstRow ? 1 : 0),
    y: y - count,
  };
};

export const getTopLeftPosition = ({x, y}: Position, count = 1): Position => {
  const oddCount = count % 2 === 1;
  const evenFirstRow = isRowEven(y);
  return {
    x: x - Math.floor(count / 2) - (oddCount && evenFirstRow ? 1 : 0),
    y: y - count,
  };
};

export const getBottomRightPosition = (position: Position, count: number = 1): Position => {
  return {
    x: getTopRightPosition(position, count).x,
    y: position.y + count,
  };
};

export const getBottomLeftPosition = (position: Position, count: number = 1): Position => {
  return {
    x: getTopLeftPosition(position, count).x,
    y: position.y + count,
  };
};

export const getSurroundingPositions = (position: Position): Position[] => {
  return [
    getRightPosition(position),
    getBottomRightPosition(position),
    getBottomLeftPosition(position),
    getLeftPosition(position),
    getTopLeftPosition(position),
    getTopRightPosition(position),
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
