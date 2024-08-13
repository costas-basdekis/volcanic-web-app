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
