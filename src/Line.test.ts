import {makeLineKey} from "./Line";

describe("makeLineKey", () => {
  it("makes the same key regardless of order", () => {
    expect(makeLineKey([{x: 1, y: 2}, {x: 3, y: 4}])).toEqual(makeLineKey([{x: 3, y: 4}, {x: 1, y: 2}]));
  });
  it("truncates points", () => {
    expect(makeLineKey([
      {x: 43.30127018922194, y: 25.00000000000003},
      {x: 7.105427357601002e-15, y: 50.00000000000001},
    ])).toEqual("0,50|43.301,25")
  });
});
