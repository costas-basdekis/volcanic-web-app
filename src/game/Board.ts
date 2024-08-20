import {Level, Levels} from "./Level";
import {Piece} from "./Piece";
import {Position} from "../hexGridUtils";
import {BlackOrWhite, Unit} from "./Unit";
import {GroupExpansionInfo, UnitMap} from "./UnitMap";

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

  getPlaceablePositionsForPiece(piece: Piece): [Position, Level][] {
    const placeablePositions: [Position, Level][] = [];
    for (const level of this.levels.values()) {
      for (const position of level.getPlaceablePositionsForPiece(piece, this.unitMap)) {
        placeablePositions.push([position, level]);
      }
    }
    return placeablePositions;
  }

  placePieceAt(piece: Piece, position: Position): Board {
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

  getUnitPlaceablePositions(unit: Unit): Position[] {
    return this.unitMap.getUnitPlaceablePositions(unit);
  }

  canPlaceUnit(unit: Unit, position: Position): boolean {
    return this.unitMap.canPlaceUnit(unit, position);
  }

  placeUnit(unit: Unit, position: Position): Board {
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

  expandGroup(position: Position, colour: BlackOrWhite): Board {
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
}
