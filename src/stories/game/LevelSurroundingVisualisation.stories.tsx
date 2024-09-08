import type { Meta, StoryObj } from '@storybook/react';

import {Level, Piece, HexPosition, Tile, UnitMap, Hex} from "../../game";
import {RBaseTile, RLevel, RPreviewPlacePiece} from "../../components";
import {svgWrapper} from "../decorators";

interface LevelSurroundingVisualisationProps {
  level: Level,
  depth: number,
}

function LevelSurroundingVisualisation(props: LevelSurroundingVisualisationProps) {
  const {level, depth} = props;

  let surroundingPositions = level.getSurroundingPositions(depth);
  const placeablePositions = level.getPlaceablePositionsForPiece(Piece.presets.BlackWhite, UnitMap.empty());
  if  (!surroundingPositions.length) {
    surroundingPositions = placeablePositions;
  }
  return <>
    <RLevel level={level}/>
    {surroundingPositions.map(position => (
      <RBaseTile
        key={position.key}
        fill={"grey"}
        position={position}
      />
    ))}
    <RPreviewPlacePiece
      placeablePositionsAndLevels={placeablePositions.map(position => [position, level])}
      piece={Piece.presets.BlackWhite}
    />
  </>;
}

const meta: Meta<LevelSurroundingVisualisationProps> = {
  title: 'Level Surrounding Visualisation',
  component: LevelSurroundingVisualisation,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    svgWrapper,
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Level1Empty: Story = {
  args: {
    level: Level.makeEmpty(1, null),
    depth: 1,
  },
};

export const Level1SingleTile: Story = {
  args: {
    level: Level.fromPieces(1, [
      new Piece({
        tiles: [
          new Tile({position: HexPosition.Center, type: "volcano"})
        ],
      }),
    ], null, UnitMap.empty()),
    depth: 2,
  },
};

export const Level1ThreeTiles: Story = {
  args: {
    level: Level.fromPieces(1, [
      Piece.presets.BlackWhite.moveFirstTileTo(HexPosition.Center),
    ], null, UnitMap.empty()),
    depth: 2,
  },
};

export const Level1ManyTiles: Story = {
  args: {
    level: Level.fromPieces(1, [
      Piece.presets.BlackWhite,
      Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(-1, 0)),
      Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(2, 0)),
      Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(0, 1, 1)),
    ], null, UnitMap.empty()),
    depth: 2,
  },
};

export const Level2EmptyWithLevel1Empty: Story = {
  args: {
    level: Level.makeEmpty(2, Level.makeEmpty(1, null)),
    depth: 1,
  },
};

export const Level2EmptyWithLevel1SingleTile: Story = {
  args: {
    level: Level.makeEmpty(2, Level.fromPieces(1, [
      new Piece({
        tiles: [
          new Tile({position: HexPosition.Center, type: "volcano"})
        ],
      }),
    ], null, UnitMap.empty())),
    depth: 2,
  },
};

export const Level2EmptyWithLevel1ThreeTiles: Story = {
  args: {
    level: Level.makeEmpty(2, Level.fromPieces(1, [
      Piece.presets.BlackWhite,
    ], null, UnitMap.empty())),
    depth: 2,
  },
};

export const Level2EmptyWithLevel1ManyTiles: Story = {
  args: {
    level: Level.makeEmpty(2, Level.fromPieces(1, [
      Piece.presets.BlackWhite,
      Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(-1, 0)),
      Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(2, 0)),
      Piece.presets.BlackWhite.rotate(1).moveFirstTileTo(Hex(0, 1, 1)),
    ], null, UnitMap.empty())),
    depth: 2,
  },
};
