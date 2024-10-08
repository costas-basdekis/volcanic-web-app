import {Level, Levels} from "./Level";
import {Piece} from "./Piece";
import {BlackOrWhite, Unit} from "./Unit";
import {GroupExpansionInfo, UnitMap} from "./UnitMap";
import {HexPosition} from "../HexPosition";

interface BoardAttributes {
  levels: Levels;
  maxLevel: number;
  unitMap: UnitMap;
}

export class Board implements BoardAttributes {
  levels: Levels;
  maxLevel: number;
  unitMap: UnitMap;

  static makeEmpty(): Board {
    return new Board({
      levels: new Map([[1, Level.makeEmpty(1, null)]]),
      maxLevel: 1,
      unitMap: UnitMap.empty(),
    });
  }

  constructor(attributes: BoardAttributes) {
    this.levels = attributes.levels;
    this.maxLevel = attributes.maxLevel;
    this.unitMap = attributes.unitMap;
  }

  _change(someAttributes: Partial<BoardAttributes>): Board {
    const newAttributes: BoardAttributes = {
      ...this,
      ...someAttributes,
    };
    if (someAttributes.levels) {
      this._updatePreviousLevelReferences(newAttributes);
      this._updateUnitMap(newAttributes);
      this._addNewMaxLevel(newAttributes);
    }
    return new Board(newAttributes);
  }

  _updatePreviousLevelReferences(attributes: BoardAttributes) {
    let {levels} = attributes;
    if (!Array.from(levels.values()).some(level => level !== level.updatePreviousLevelFrom(levels))) {
      return;
    }
    levels = new Map(levels);
    for (const level of Array.from(levels.values())) {
      levels.set(level.index, level.updatePreviousLevelFrom(levels));
    }
    attributes.levels = levels;
  }

  _updateUnitMap = (newAttributes: BoardAttributes) => {
    newAttributes.unitMap = UnitMap.fromLevels(newAttributes.levels.values());
  };

  _addNewMaxLevel(attributes: BoardAttributes) {
    let {levels, maxLevel} = attributes;
    if (!levels.get(maxLevel)!.tiles.length) {
      return;
    }
    attributes.maxLevel += 1;
    attributes.levels = new Map([
      ...levels.entries(),
      [maxLevel + 1, Level.makeEmpty(maxLevel + 1, levels.get(maxLevel)!)],
    ]);
  }

  getPlaceablePositionsForPiece(piece: Piece): [HexPosition, Level][] {
    const placeablePositions: [HexPosition, Level][] = [];
    for (const level of this.levels.values()) {
      for (const position of level.getPlaceablePositionsForPiece(piece, this.unitMap)) {
        placeablePositions.push([position, level]);
      }
    }
    return placeablePositions;
  }

  placePieceAt(piece: Piece, position: HexPosition): Board {
    return this.placePiece(piece.moveFirstTileTo(position));
  }

  placePiece(piece: Piece): Board {
    const levelForPiece = Array.from(this.levels.values()).find(level => level.canPlacePiece(piece, this.unitMap));
    if (!levelForPiece) {
      throw new Error("Cannot place this piece at any level");
    }
    const entries = Array.from(this.levels.entries()).map(([index, level]) =>
      [index, level === levelForPiece ? level.placePiece(piece, this.unitMap) : level] as [number, Level]);
    return this._change({
      levels: new Map(entries),
    });
  }

  canPlacePiece(piece: Piece): boolean {
    return Array.from(this.levels.values()).find(level => level.canPlacePiece(piece, this.unitMap)) !== undefined;
  }

  getAffectedPawnsForPlacingPiece(piece: Piece): {white: number, black: number} {
    const level = Array.from(this.levels.values())
      .find(level => level.canPlacePiece(piece, this.unitMap));
    if (!level) {
      throw new Error("Cannot place this piece");
    }
    if (!level.previousLevel) {
      return {white: 0, black: 0};
    }
    return level.previousLevel.getAffectedPawnsForPlacingPieceOnTop(piece);
  }

  getUnitPlaceablePositions(unit: Unit): HexPosition[] {
    return this.unitMap.getUnitPlaceablePositions(unit);
  }

  canPlaceUnit(unit: Unit, position: HexPosition): boolean {
    return this.unitMap.canPlaceUnit(unit, position);
  }

  placeUnit(unit: Unit, position: HexPosition): Board {
    if (!this.canPlaceUnit(unit, position)) {
      throw new Error("Cannot place this unit");
    }
    const info = this.unitMap.get(position)!;
    const {level} = info;
    return this._change({
      levels: new Map([
        ...this.levels.entries(),
        [level?.index, level.placeUnit(unit, position)],
      ]),
    });
  }

  getGroupExpansionInfos(colour: BlackOrWhite): GroupExpansionInfo[] {
    return this.unitMap.getGroupExpansionInfos(colour);
  }

  expandGroup(position: HexPosition, colour: BlackOrWhite): Board {
    const positionsByLevelIndex =
      this.unitMap.getGroupExpansionInfo(position, colour).positionsByLevelIndex;
    return this._change({
      levels: new Map(Array.from(this.levels.values()).map(level => {
        if (!positionsByLevelIndex.has(level.index)) {
          return [level.index, level];
        }
        return [level.index, level.expandGroup(positionsByLevelIndex.get(level.index)!, colour)];
      })),
    });
  }

  canExpandGroup(position: HexPosition, colour: BlackOrWhite): boolean {
    return this.unitMap.canExpandGroup(position, colour);
  }

  getGroupExpansionNeededCount(position: HexPosition, colour: BlackOrWhite): number {
    return this.unitMap.getGroupExpansionNeededCount(position, colour);
  }
}
