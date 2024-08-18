import {Level} from "./Level";
import {BlackOrWhite, Unit, UnitType} from "./Unit";
import _ from "underscore";
import {Tile} from "./Tile";
import {getSurroundingPositions, makePositionKey, Position} from "../hexGridUtils";

export class UnitGroup {
  colour: BlackOrWhite;
  positions: Position[];
  counts: {[key in UnitType]: number} & {total: number};

  static fillMap(map: UnitInfoMap) {
    const seen: Set<string> = new Set();
    for (const unitInfo of map.values()) {
      if (seen.has(unitInfo.tile.key)) {
        continue;
      }
      if (!unitInfo.unit) {
        seen.add(unitInfo.tile.key);
        continue;
      }
      this.from(unitInfo).fill(map, unitInfo, seen);
    }
  }

  static from(info: UnitInfo): UnitGroup {
    if (!info.unit) {
      throw new Error("Cannot create group without unit");
    }
    return new UnitGroup(info.unit.colour);
  }

  constructor(colour: BlackOrWhite) {
    this.colour = colour;
    this.positions = [];
    this.counts = {
      pawn: 0,
      bishop: 0,
      rook: 0,
      total: 0,
    };
  }

  canAddItem(info: UnitInfo | undefined): boolean {
    return (
      info !== undefined
      && info.unit !== undefined
      && info.unit?.colour === this.colour
    );
  }

  addItem(info: UnitInfo): UnitGroup {
    if (!this.canAddItem(info)) {
      throw new Error("Cannot add info to group");
    }
    this.positions.push(info.tile.position);
    this.counts[info.unit!.type] += 1;
    this.counts.total += 1;
    return this;
  }

  fill(map: UnitInfoMap, start: UnitInfo, seen: Set<string>): UnitGroup {
    if (!this.canAddItem(start)) {
      throw new Error("Cannot add info to group");
    }
    const queue: UnitInfo[] = [start];
    while (queue.length) {
      const info = queue.shift()!;
      if (seen.has(info.tile.key)) {
        continue;
      }
      seen.add(info.tile.key);
      info.group = this;
      this.addItem(info);
      for (const neighbour of getSurroundingPositions(info.tile.position)) {
        const neighbourInfo = map.get(makePositionKey(neighbour));
        if (!this.canAddItem(neighbourInfo) || seen.has(neighbourInfo!.tile.key)) {
          continue;
        }
        queue.push(neighbourInfo!);
      }
    }
    return this;
  }
}

export interface UnitInfo {
  level: Level;
  tile: Tile;
  unit: Unit | null;
  group: UnitGroup | null;
  neighbourGroups: UnitGroup[];
}

type UnitInfoMap = Map<string, UnitInfo>;

export class UnitMap {
  map: UnitInfoMap;

  static empty() {
    return new UnitMap(new Map());
  }

  static fromLevels(levels: Iterable<Level>) {
    const map: UnitInfoMap = new Map();
    const sortedLevels = _.sortBy(Array.from(levels), level => level.index).reverse();
    for (const level of sortedLevels) {
      for (const tile of level.tiles) {
        if (map.has(tile.key)) {
          continue;
        }
        map.set(tile.key, {
          level,
          tile,
          unit: level.unitMap.get(tile.key) ?? null,
          group: null,
          neighbourGroups: [],
        });
      }
    }
    UnitGroup.fillMap(map);
    this.fillNeighbourGroups(map);
    return new UnitMap(map);
  }

  static fillNeighbourGroups(map: UnitInfoMap) {
    for (const info of map.values()) {
      const surroundingPositions = getSurroundingPositions(info.tile.position);
      const groups = surroundingPositions
        .map(position => map.get(makePositionKey(position))?.group)
        .filter(group => !!group) as UnitGroup[];
      info.neighbourGroups.push(...new Set(groups));
    }
  }

  constructor(map: UnitInfoMap) {
    this.map = map;
  }

  get(position: Position): UnitInfo | undefined {
    return this.map.get(makePositionKey(position));
  }

  getUnitForLevel(position: Position, level: Level): Unit | null {
    const info = this.get(position);
    if (!info) {
      return null;
    }
    if (info.level !== level) {
      return null;
    }
    return info.unit;
  }

  canPlaceUnit(unit: Unit, position: Position, because?: {reasons: string | null}): boolean {
    const info = this.get(position);
    if (!info) {
      if (because) because.reasons = "There is no position there";
      return false;
    }
    if (info.unit) {
      if (because) because.reasons = "There is a unit there";
      return false;
    }
    if (info.tile.type === "volcano") {
      if (because) because.reasons = "There is a volcano there";
      return false;
    }
    const {level, neighbourGroups} = info;
    switch (unit.type) {
      case "pawn":
        if (level.index > 1) {
          if (because) because.reasons = "It is not on ground level";
          return false;
        }
        if (neighbourGroups.some(group => group.colour === unit.colour)) {
          if (because) because.reasons = "There are other groups nearby";
          return false;
        }
        break;
      case "bishop":
        if (neighbourGroups.some(group => group.colour === unit.colour && group.counts.bishop > 0)) {
          if (because) because.reasons = "There are other groups with a bishop nearby";
          return false;
        }
        const totalCount = neighbourGroups
          .filter(group => group.colour === unit.colour)
          .map(group => group.counts.total)
          .reduce((total, current) => total + current);
        if (totalCount < 3) {
          if (because) because.reasons = `The total size of nearby groups is too small (${totalCount} < 3)`;
          return false;
        }
        break;
      case "rook":
        if (level.index < 3) {
          if (because) because.reasons = "It is not at least on level 3";
          return false;
        }
        if (neighbourGroups.some(group => group.colour === unit.colour && group.counts.rook > 0)) {
          if (because) because.reasons = "There are other groups with a rook nearby";
          return false;
        }
        break;
      default:
        throw new Error(`Unknown unit type: "${unit.type}"`);
    }
    return true;
  }

  getUnitPlaceablePositions(unit: Unit): Position[] {
    return Array.from(this.map.values())
      .filter(info => this.canPlaceUnit(unit, info.tile.position))
      .map(info => info.tile.position);
  }
}
