import {Position} from "./hexGridUtils";

export function pointsToPathD(points: Position[]): string {
  return [
    ...points.map((point, index) =>
      `${index === 0 ? "M" : "L"}${point.x} ${point.y}`),
    `Z`,
  ].join(" ");
}
