import {Level} from "./Level";
import {BlackOrWhite, Unit, UnitType} from "./Unit";
import _ from "underscore";
import {Tile} from "./Tile";
import {getSurroundingPositions, getSurroundingPositionsMulti, makePositionKey, Position} from "../hexGridUtils";

export class UnitGroup {
  colour: BlackOrWhite;
  positions: Position[];
  counts: {[key in UnitType]: number} & {total: number};

  static fillMap(map: InnerUnitMap) {
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

  fill(map: InnerUnitMap, start: UnitInfo, seen: Set<string>): UnitGroup {
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

type InnerUnitMap = Map<string, UnitInfo>;

interface GroupExpansionInfoAttributes {
  position: Position;
  levelIndex: number;
  colour: BlackOrWhite;
  positions: Position[];
  positionsByLevelIndex: Map<number, Position[]>;
}

export class GroupExpansionInfo {
  position: Position;
  levelIndex: number;
  colour: BlackOrWhite;
  positions: Position[];
  positionsByLevelIndex: Map<number, Position[]>;

  static getAllForColour(colour: BlackOrWhite, unitMap: UnitMap): GroupExpansionInfo[] {
    const result: GroupExpansionInfo[] = Array.from(unitMap.map.values())
      .filter(info => unitMap.canExpandGroup(info.tile.position, colour))
      .map(info => GroupExpansionInfo.build(info.tile.position, colour, unitMap));
    return this.normaliseInfos(result);
  }

  static normaliseInfos(infos: GroupExpansionInfo[]): GroupExpansionInfo[] {
    const positionByKey: Map<string, Position> =
      new Map(infos.map(info => [makePositionKey(info.position), info.position]));
    const positionsByKey: Map<string, Position[]> = new Map();
    for (const info of infos) {
      info.prepareToNormalise(positionByKey, positionsByKey);
    }
    return infos.map(info => info.normalise(positionByKey, positionsByKey));
  }

  static build(position: Position, colour: BlackOrWhite, unitMap: UnitMap): GroupExpansionInfo {
    const info = new GroupExpansionInfo({
      position,
      levelIndex: unitMap.get(position)!.level.index,
      colour,
      positions: [],
      positionsByLevelIndex: new Map(),
    });
    info.positions = info.getPositions(unitMap);
    info.positionsByLevelIndex = info.getPositionsByLevelIndex(unitMap);
    return info;
  }

  constructor(attributes: GroupExpansionInfoAttributes) {
    this.position = attributes.position;
    this.levelIndex = attributes.levelIndex;
    this.colour = attributes.colour;
    this.positions = attributes.positions;
    this.positionsByLevelIndex = attributes.positionsByLevelIndex;
  }

  getPositions(unitMap: UnitMap): Position[] {
    if (!unitMap.canExpandGroup(this.position, this.colour)) {
      throw new Error("Cannot expand group here");
    }
    const {neighbourGroups, tile} = unitMap.get(this.position)!;
    const groups = neighbourGroups.filter(group => group.colour === this.colour);
    const tileType = tile.type;
    return getSurroundingPositionsMulti(groups.map(group => group.positions).flat(), 1)
      .flat()
      .filter(position => {
        const info = unitMap.get(position);
        return !info?.unit && info?.tile?.type === tileType;
      });
  }

  getPositionsByLevelIndex(unitMap: UnitMap): Map<number, Position[]> {
    const positions = this.getPositions(unitMap);
    const positionsByLevelIndex: Map<number, Position[]> = new Map();
    for (const position of positions) {
      const levelIndex = unitMap.get(position)!.level.index;
      if (!positionsByLevelIndex.has(levelIndex)) {
        positionsByLevelIndex.set(levelIndex, []);
      }
      positionsByLevelIndex.get(levelIndex)!.push(position);
    }
    return positionsByLevelIndex;
  }

  prepareToNormalise(positionByKey: Map<string, Position>, positionsByKey: Map<string, Position[]>) {
    const key = makePositionKey(this.position);
    if (positionsByKey.has(key)) {
      return;
    }
    const normalisedPositions = this.positions
      .map(other => positionByKey.get(makePositionKey(other))!);
    for (const other of normalisedPositions) {
      positionsByKey.set(makePositionKey(other), normalisedPositions);
    }
  }

  normalise(positionByKey: Map<string, Position>, positionsByKey: Map<string, Position[]>): GroupExpansionInfo {
    const key = makePositionKey(this.position);
    return new GroupExpansionInfo({
      position: positionByKey.get(key)!,
      levelIndex: this.levelIndex,
      colour: this.colour,
      positions: positionsByKey.get(key)!,
      positionsByLevelIndex: new Map(Array.from(this.positionsByLevelIndex.entries()).map(
        ([levelIndex, positions]) =>
          [levelIndex, positions.map(position => positionByKey.get(makePositionKey(position))!)])),
    });
  }
}

export class UnitMap {
  map: InnerUnitMap;

  static empty() {
    return new UnitMap(new Map());
  }

  static fromLevels(levels: Iterable<Level>) {
    const map: InnerUnitMap = new Map();
    const sortedLevels = _.sortBy(Array.from(levels), level => level.index).reverse();
    for (const level of sortedLevels) {
      for (const tile of level.tiles) {
        if (map.has(tile.key)) {
          continue;
        }
        map.set(tile.key, {
          level,
          tile,
          unit: level.levelUnitMap.get(tile.key) ?? null,
          group: null,
          neighbourGroups: [],
        });
      }
    }
    UnitGroup.fillMap(map);
    this.fillNeighbourGroups(map);
    return new UnitMap(map);
  }

  static fillNeighbourGroups(map: InnerUnitMap) {
    for (const info of map.values()) {
      const surroundingPositions = getSurroundingPositions(info.tile.position);
      const groups = surroundingPositions
        .map(position => map.get(makePositionKey(position))?.group)
        .filter(group => !!group) as UnitGroup[];
      info.neighbourGroups.push(...new Set(groups));
    }
  }

  constructor(map: InnerUnitMap) {
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

  canPlaceAnything(position: Position, because?: {reasons: string | null}): boolean {
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
    return true;
  }

  canPlaceUnit(unit: Unit, position: Position, because?: {reasons: string | null}): boolean {
    if (!this.canPlaceAnything(position, because)) {
      return false;
    }
    const {level, neighbourGroups} = this.get(position)!;
    const nearbyFriendlyGroups = neighbourGroups
      .filter(group => group.colour === unit.colour);
    switch (unit.type) {
      case "pawn":
        if (level.index > 1) {
          if (because) because.reasons = "It is not on ground level";
          return false;
        }
        if (nearbyFriendlyGroups.length) {
          if (because) because.reasons = "There are other groups nearby";
          return false;
        }
        break;
      case "bishop":
        if (!nearbyFriendlyGroups.length) {
          if (because) because.reasons = "There are no groups nearby";
          return false;
        }
        if (nearbyFriendlyGroups.some(group => group.counts.bishop > 0)) {
          if (because) because.reasons = "There are other groups with a bishop nearby";
          return false;
        }
        const maxCount = nearbyFriendlyGroups
          .map(group => group.counts.total)
          .reduce((total, current) => Math.max(total, current), 0);
        if (maxCount < 3) {
          if (because) because.reasons = `The max size of nearby groups is too small (${maxCount} < 3)`;
          return false;
        }
        break;
      case "rook":
        if (level.index < 3) {
          if (because) because.reasons = "It is not at least on level 3";
          return false;
        }
        if (!nearbyFriendlyGroups.length) {
          if (because) because.reasons = "There are no groups nearby";
          return false;
        }
        if (nearbyFriendlyGroups.some(group => group.counts.rook > 0)) {
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

  canExpandGroup(position: Position, colour: BlackOrWhite, because?: {reasons: string | null}): boolean {
    if (!this.canPlaceAnything(position, because)) {
      return false;
    }
    const {neighbourGroups} = this.get(position)!;
    if (!neighbourGroups.some(group => group.colour === colour)) {
      if (because) because.reasons = "There are no other groups nearby";
      return false;
    }
    return true;
  }

  getGroupExpansionInfo(position: Position, colour: BlackOrWhite): GroupExpansionInfo {
    return GroupExpansionInfo.build(position, colour, this);
  }

  getGroupExpansionInfos(colour: BlackOrWhite): GroupExpansionInfo[] {
    return GroupExpansionInfo.getAllForColour(colour, this);
  }

  getGroupExpansionNeededCount(position: Position, colour: BlackOrWhite) {
    const info = this.getGroupExpansionInfo(position, colour);
    return info.positions
      .map(position => this.get(position)!.level.index)
      .reduce((total, current) => total + current);
  }
}
