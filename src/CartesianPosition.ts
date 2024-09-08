export interface CartesianPosition {
  x: number;
  y: number;
}

export const makePositionKey = ({x, y}: CartesianPosition): string => {
  return `${x},${y}`;
};

export const isSamePosition = (left: CartesianPosition, right: CartesianPosition): boolean => {
  return left === right || makePositionKey(left) === makePositionKey(right);
}

export const truncatePoint = (point: CartesianPosition, digitCount: number = 3): CartesianPosition => {
  return {
    x: parseFloat(point.x.toFixed(digitCount)),
    y: parseFloat(point.y.toFixed(digitCount)),
  };
}

export const Center: CartesianPosition = {x: 0, y: 0};
