export interface Position {
  x: number;
  y: number;
}

export const getTilePosition = (position: Position, size: number): Position => {
  const evenRow = position.y % 2 === 0;
  const offsetX = position.x + (evenRow ? 0 : 0.5);
  const offsetY = position.y;
  return {
    x: offsetX * Math.sin(Math.PI / 3) * size * 2,
    y: offsetY * Math.cos(Math.PI / 3) * size * 3,
  };
};

export const getRightPosition = ({x, y}: Position): Position => {
  return {x: x + 1, y};
};

export const getLeftPosition = ({x, y}: Position): Position => {
  return {x: x - 1, y};
};

export const getTopRightPosition = ({x, y}: Position): Position => {
  const evenRow = y % 2 === 0;
  return {x: x + (evenRow ? 0 : 1), y: y - 1};
};

export const getTopLeftPosition = ({x, y}: Position): Position => {
  const evenRow = y % 2 === 0;
  return {x: x - (evenRow ? 1 : 0), y: y - 1};
};

export const getBottomRightPosition = ({x, y}: Position): Position => {
  const evenRow = y % 2 === 0;
  return {x: x + (evenRow ? 0 : 1), y: y + 1};
};

export const getBottomLeftPosition = ({x, y}: Position): Position => {
  const evenRow = y % 2 === 0;
  return {x: x - (evenRow ? 1 : 0), y: y + 1};
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
