import {CartesianPosition} from "./CartesianPosition";

export function pointsToPathD(points: CartesianPosition[]): string {
  return [
    ...points.map((point, index) =>
      `${index === 0 ? "M" : "L"}${point.x} ${point.y}`),
    `Z`,
  ].join(" ");
}
