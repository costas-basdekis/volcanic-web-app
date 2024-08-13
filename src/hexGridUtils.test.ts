import {getTilePosition} from "./hexGridUtils";

describe("getTilePosition", () => {
  it("gets tile position for {0, 0}", () => {
    expect(getTilePosition({x: 0, y: 0}, 100)).toEqualCloseTo({x: 0, y: 0})
  });
  it("gets tile position for {1, 0}", () => {
    expect(getTilePosition({x: 1, y: 0}, 100)).toEqualCloseTo({x: 173.20508075688772, y: 0})
  });
  it("gets tile position for {0, 1}", () => {
    expect(getTilePosition({x: 0, y: 1}, 100)).toEqualCloseTo({x: 86.60254037844386, y: 150})
  });
  it("gets tile position for {1, 1}", () => {
    expect(getTilePosition({x: 1, y: 1}, 100)).toEqualCloseTo({x: 259.8076211353316, y: 150})
  });
  it("gets tile position for {0, 2}", () => {
    expect(getTilePosition({x: 0, y: 2}, 100)).toEqualCloseTo({x: 0, y: 300})
  });
});
