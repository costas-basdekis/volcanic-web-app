import type { Meta, StoryObj } from '@storybook/react';

import {Level, Piece, Tile} from "../../game";
import {AutoResizeSvg, RBaseTile, RLevel} from "../../components";
import {makePositionKey, Position} from "../../hexGridUtils";
import {Component} from "react";
import {RPiece} from "../../components/game/RPiece";

interface LevelSurroundingVisualisationProps {
  level: Level,
  depth: number,
}

interface LevelSurroundingVisualisationState {
  hoveredPosition: Position | null,
}

class LevelSurroundingVisualisation extends Component<LevelSurroundingVisualisationProps, LevelSurroundingVisualisationState> {
  state: LevelSurroundingVisualisationState = {
    hoveredPosition: null,
  };

  render() {
    const {level, depth} = this.props;
    const {hoveredPosition} = this.state;
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
          onHover={this.onHover}
        />
      ))}
      {hoveredPosition ? (
        <RPiece piece={Piece.presets.BlackWhite.moveFirstTileTo(hoveredPosition)} />
      ) : null}
    </>;
  }

  onHover = (position: Position, hovering: boolean) => {
    this.setState(({hoveredPosition}) => {
      if (hovering && hoveredPosition === position) {
        return null;
      }
      return {
        hoveredPosition: hovering ? (
          position
        ) : (
          hoveredPosition === position
            ? null : hoveredPosition
        ),
      };
    });
  };
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
    Story => (
      <AutoResizeSvg>
        <Story />
      </AutoResizeSvg>
    ),
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
    level: Level.makeEmpty(1).putPiece(new Piece({
      tiles: [
        new Tile({position: {x: 0, y: 0}, type: "volcano"})
      ],
    })),
    depth: 1,
  },
};

export const ThreeTiles: Story = {
  args: {
    level: Level.makeEmpty(1).putPiece(Piece.presets.BlackWhite.moveFirstTileTo({x: 0, y: 0})),
    depth: 1,
  },
};
