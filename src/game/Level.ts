import {Tile} from "./Tile";
import {Piece} from "./Piece";
import {BlackOrWhite, Unit} from "./Unit";
import {UnitGroup, UnitMap} from "./UnitMap";
import {HexPosition} from "../HexPosition";

export type Levels = Map<number, Level>;

interface LevelAttributes {
  index: number;
  tiles: Tile[];
  tileMap: Map<string, Tile>;
  pieceIdMap: Map<string, number>;
  pieceIdPieceMap: Map<number, Piece>;
  nextPieceId: number;
  levelUnitMap: Map<string, Unit>;
  previousLevel: Level | null;
}

export class Level implements LevelAttributes {
  index: number;
  tiles: Tile[];
  tileMap: Map<string, Tile>;
  pieceIdMap: Map<string, number>;
  pieceIdPieceMap: Map<number, Piece>;
  nextPieceId: number;
  levelUnitMap: Map<string, Unit>;
  previousLevel: Level | null;

  static makeEmpty(index: number, previousLevel: Level | null): Level {
    return this.fromPieces(index, [], previousLevel, UnitMap.empty());
  }

  static fromPieces(index: number, pieces: Piece[], previousLevel: Level | null, unitMap: UnitMap): Level {
    return new Level({
      index,
      tiles: [],
      tileMap: new Map(),
      pieceIdMap: new Map(),
      pieceIdPieceMap: new Map(),
      nextPieceId: 1,
      levelUnitMap: new Map(),
      previousLevel,
    }).placePieces(pieces, unitMap);
  }

  static getTileMap(tiles: Tile[]): Map<string, Tile> {
    return new Map(tiles.map(tile => [tile.key, tile]));
  }

  constructor(attributes: LevelAttributes) {
    this.index = attributes.index;
    this.tiles = attributes.tiles;
    this.tileMap = attributes.tileMap;
    this.pieceIdMap = attributes.pieceIdMap;
    this.pieceIdPieceMap = attributes.pieceIdPieceMap;
    this.nextPieceId = attributes.nextPieceId;
    this.levelUnitMap = attributes.levelUnitMap;
    this.previousLevel = attributes.previousLevel;
  }

  _change(someAttributes: Partial<LevelAttributes>): Level {
    const newAttributes = {
      ...this,
      ...someAttributes,
    };
    if (someAttributes.tiles && !someAttributes.tileMap) {
      newAttributes.tileMap = Level.getTileMap(newAttributes.tiles);
    }
    return new Level(newAttributes);
  }

  updatePreviousLevelFrom(levels: Levels): Level {
    const previousLevel = this.previousLevel ? levels.get(this.previousLevel.index)! : null;
    return this.updatePreviousLevel(previousLevel);
  }

  updatePreviousLevel(previousLevel: Level | null): Level {
    if (this.previousLevel === previousLevel) {
      return this;
    }
    return this._change({previousLevel});
  }

  hasTileAt(position: HexPosition): boolean {
    return this.tileMap.has(position.key);
  }

  placePieces(pieces: Piece[], unitMap: UnitMap): Level {
    if (!pieces.length) {
      return this;
    }
    let level: Level = this;
    for (const piece of pieces) {
      level = level.placePiece(piece, unitMap);
    }
    return level;
  }

  placePieceAt(piece: Piece, position: HexPosition, unitMap: UnitMap): Level {
    return this.placePiece(piece.moveFirstTileTo(position), unitMap);
  }

  placePiece(piece: Piece, unitMap: UnitMap): Level {
    if (!this.canPlacePiece(piece, unitMap)) {
      throw new Error("Cannot place this piece");
    }
    return this._change({
      tiles: [...this.tiles, ...piece.tiles],
      pieceIdMap: new Map([
        ...this.pieceIdMap.entries(),
        ...piece.tiles.map(tile => [tile.key, this.nextPieceId] as [string, number]),
      ]),
      pieceIdPieceMap: new Map([
        ...this.pieceIdPieceMap.entries(),
        [this.nextPieceId, piece],
      ]),
      nextPieceId: this.nextPieceId + 1,
    });
  }

  getSurroundingPositions(depth: number): HexPosition[] {
    if (this.previousLevel) {
      return this.previousLevel.tiles.map(tile => tile.position);
    }
    return HexPosition.getSurroundingPositionsMulti(this.tiles.map(tile => tile.position), depth);
  }

  getPlaceablePositionsForPiece(piece: Piece, unitMap: UnitMap): HexPosition[] {
    const surroundingPositions = this.getSurroundingPositions(2);
    if (!this.previousLevel && !surroundingPositions.length) {
      return [HexPosition.Center];
    }
    return surroundingPositions
      .filter(position => this.canPlacePieceAt(piece, position, unitMap));
  }

  canPlacePieceAt(piece: Piece, position: HexPosition, unitMap: UnitMap): boolean {
    return this.canPlacePiece(piece.moveFirstTileTo(position), unitMap);
  }

  canPlacePiece(piece: Piece, unitMap: UnitMap): boolean {
    if (this.previousLevel) {
      if (!this.previousLevel.canPlacePieceOnTop(piece, unitMap)) {
        return false;
      }
      if (!this.tiles.length) {
        return true;
      }
    } else {
      if (!this.tiles.length) {
        return piece.tiles[0].position.isCenter();
      }
    }
    return !this.doesPieceOverlap(piece) && this.isPieceInTheBorder(piece);
  }

  canPlacePieceOnTop(piece: Piece, unitMap: UnitMap): boolean {
    return (
      this.tileMap.get(piece.tiles[0].position.key)?.type === "volcano"
      && this.isPieceFullyOnTopOfMultiplePieces(piece)
      && this.isPieceNotOnTopOfIndestructibleUnits(piece)
      && this.isPieceNotOverWholeGroups(piece, unitMap)
    );
  }

  getAffectedPawnsForPlacingPieceOnTop(piece: Piece): {white: number, black: number} {
    const units = piece.tiles
      .map(tile => this.levelUnitMap.get(tile.key))
      .filter(unit => unit) as Unit[];
    const affectedPawns = {white: 0, black: 0};
    for (const unit of units) {
      if (unit.type === "pawn") {
        affectedPawns[unit.colour] += unit.count;
      }
    }
    return affectedPawns;
  }

  isPieceFullyOnTopOfMultiplePieces(piece: Piece): boolean {
    const pieceIds = new Set(piece.tiles.map(tile => this.pieceIdMap.get(tile.key)));
    return (
      pieceIds.size > 1
      && !pieceIds.has(undefined)
    );
  }

  isPieceNotOnTopOfIndestructibleUnits(piece: Piece): boolean {
    const indestructibleUnitTypes = ["bishop", "rook"];
    return !piece.tiles.some(tile => indestructibleUnitTypes.includes(this.levelUnitMap.get(tile.key)?.type!));
  }

  isPieceNotOverWholeGroups(piece: Piece, unitMap: UnitMap): boolean {
    const groups = Array.from(new Set(piece.tiles
      .map(tile => unitMap.get(tile.position)?.group)
      .filter(group => group) as UnitGroup[]));
    const eradicatedGroups = groups
      .filter(group => group.positions.every(position => piece.includes(position)));
    return !eradicatedGroups.length;
  }

  doesPieceOverlap(piece: Piece) {
    return piece.tiles.some(tile => this.tileMap.has(tile.key));
  }

  isPieceInTheBorder(piece: Piece) {
    const surroundingPositions = this.getSurroundingPositions(1);
    const surroundingPositionKeySet =
      new Set(surroundingPositions.map(position => position.key));
    return piece.tiles.some(tile => surroundingPositionKeySet.has(tile.key));
  }

  hasUnitAt(position: HexPosition): boolean {
    return this.getUnitAt(position) !== undefined;
  }

  getUnitAt(position: HexPosition): Unit | undefined {
    return this.levelUnitMap.get(position.key);
  }

  placeUnit(unit: Unit, position: HexPosition): Level {
    if (!this.canPlaceUnitAt(position)) {
      throw new Error("Cannot place unit there");
    }
    return this._change({
      levelUnitMap: new Map([
        ...this.levelUnitMap.entries(),
        [position.key, unit],
      ]),
    });
  }

  canPlaceUnitAt(position: HexPosition): boolean {
    return (
      this.hasTileAt(position)
      && !this.hasUnitAt(position)
    );
  }

  expandGroup(positions: HexPosition[], colour: BlackOrWhite): Level {
    if (!this.canExpandGroup(positions)) {
      throw new Error("Cannot expand group here");
    }
    return this._change({
      levelUnitMap: new Map([
        ...this.levelUnitMap.entries(),
        ...positions.map(position => [position.key, Unit.Pawn(colour, this.index)] as const),
      ]),
    });
  }

  canExpandGroup(positions: HexPosition[]): boolean {
    return positions.every(position => this.canPlaceUnitAt(position));
  }
}
