import type { Meta, StoryObj } from '@storybook/react';

import {Level, Piece, Tile} from "../../game";
import {RBaseTile, RLevel} from "../../components";
import {Center, makePositionKey, Position} from "../../hexGridUtils";
import {useCallback, useState} from "react";
import {RPiece} from "../../components/game/RPiece";
import {svgWrapper} from "../decorators";

interface LevelSurroundingVisualisationProps {
  level: Level,
  depth: number,
}

function LevelSurroundingVisualisation(props: LevelSurroundingVisualisationProps) {
  const {level, depth} = props;
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

  const onHover = useCallback((position: Position, hovering: boolean) => {
    setHoveredPosition(hoveredPosition => {
      if (hovering && hoveredPosition === position) {
        return hoveredPosition;
      }
      return (
        hovering ? (
          position
        ) : (
          hoveredPosition === position
            ? null : hoveredPosition
        )
      );
    });
  }, []);

  let surroundingPositions = level.getSurroundingPositions(depth);
  if  (!surroundingPositions.length) {
    surroundingPositions = level.getPlaceablePositionsForPiece(Piece.presets.BlackWhite);
  }
  return <>
    <RLevel level={level}/>
    {surroundingPositions.map(position => (
      <RBaseTile
        key={makePositionKey(position)}
        fill={level.canPlacePieceAt(Piece.presets.BlackWhite, position) ? "green" : "grey"}
        position={position}
        onHover={onHover}
      />
    ))}
    {hoveredPosition ? (
      <RPiece piece={Piece.presets.BlackWhite.moveFirstTileTo(hoveredPosition)} />
    ) : null}
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

export const Empty: Story = {
  args: {
    level: Level.makeEmpty(1),
    depth: 1,
  },
};

export const SingleTile: Story = {
  args: {
    level: Level.makeEmpty(1).placePiece(new Piece({
      tiles: [
        new Tile({position: Center, type: "volcano"})
      ],
    })),
    depth: 2,
  },
};

export const ThreeTiles: Story = {
  args: {
    level: Level.makeEmpty(1).placePiece(Piece.presets.BlackWhite.moveFirstTileTo(Center)),
    depth: 2,
  },
};
