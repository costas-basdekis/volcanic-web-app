import {
  makePositionKey,
  truncatePoint
} from "./CartesianPosition";

describe("truncatePoint", () => {
  it("truncates similar points to the same one", () => {
    expect(new Set([
      {x: 7.105427357601002e-15, y: 50.00000000000004},
      {x: 7.105427357601002e-15, y: 50.00000000000001},
      {x: 7.105427357601002e-15, y: 50.00000000000004},
      {x: 7.105427357601002e-15, y: 50.00000000000001},
    ].map(point => makePositionKey(truncatePoint(point))))).toEqual(new Set(["0,50"]));
  });
});
