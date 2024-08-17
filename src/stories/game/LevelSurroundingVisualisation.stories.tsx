import type { Meta, StoryObj } from '@storybook/react';

import {Level, Piece, Tile} from "../../game";
import {RBaseTile, RLevel, RPreviewPlacePiece} from "../../components";
import {Center, makePositionKey} from "../../hexGridUtils";
import {svgWrapper} from "../decorators";

interface LevelSurroundingVisualisationProps {
  level: Level,
  depth: number,
}

function LevelSurroundingVisualisation(props: LevelSurroundingVisualisationProps) {
  const {level, depth} = props;

  let surroundingPositions = level.getSurroundingPositions(depth);
  const placeablePositions = level.getPlaceablePositionsForPiece(Piece.presets.BlackWhite);
  if  (!surroundingPositions.length) {
    surroundingPositions = placeablePositions;
  }
  return <>
    <RLevel level={level}/>
    {surroundingPositions.map(position => (
      <RBaseTile
        key={makePositionKey(position)}
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
    level: Level.makeEmpty(1, null).placePiece(new Piece({
      tiles: [
        new Tile({position: Center, type: "volcano"})
      ],
    })),
    depth: 2,
  },
};

export const Level1ThreeTiles: Story = {
  args: {
    level: Level.makeEmpty(1, null).placePiece(Piece.presets.BlackWhite.moveFirstTileTo(Center)),
    depth: 2,
  },
};

export const Level1ManyTiles: Story = {
  args: {
    level: Level.makeEmpty(1, null)
      .placePiece(Piece.presets.BlackWhite.moveFirstTileTo(Center))
      .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: -1, y: 0})
      .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: 2, y: 0})
      .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: 0, y: 2}),
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
    level: Level.makeEmpty(2, Level.makeEmpty(1, null).placePiece(new Piece({
      tiles: [
        new Tile({position: Center, type: "volcano"})
      ],
    }))),
    depth: 2,
  },
};

export const Level2EmptyWithLevel1ThreeTiles: Story = {
  args: {
    level: Level.makeEmpty(2, Level.makeEmpty(1, null).placePiece(Piece.presets.BlackWhite.moveFirstTileTo(Center))),
    depth: 2,
  },
};

export const Level2EmptyWithLevel1ManyTiles: Story = {
  args: {
    level: Level.makeEmpty(2, Level.makeEmpty(1, null)
      .placePiece(Piece.presets.BlackWhite.moveFirstTileTo(Center))
      .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: -1, y: 0})
      .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: 2, y: 0})
      .placePieceAt(Piece.presets.BlackWhite.rotate(1), {x: 0, y: 2})
    ),
    depth: 2,
  },
};
