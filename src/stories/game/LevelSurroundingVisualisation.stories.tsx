import type { Meta, StoryObj } from '@storybook/react';

import {Level, Tile} from "../../game";
import {RBaseTile, RLevel} from "../../components";

const meta: Meta<{ level: Level }> = {
  title: 'Level Surrounding Visualisation',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  render: ({level}) => {
    const surroundingPositions = level.getSurroundingPositions();
    return (
      <>
        <RLevel level={level}/>
        {surroundingPositions.map(position => (
          <RBaseTile key={Tile.makeKey(position)} fill={"grey"} position={position} />
        ))}
      </>
    );
  },
  decorators: [
    Story => (
      <svg width={"100%"} height={1000}>
        <Story />
      </svg>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    level: Level.makeEmpty(1),
  },
};

export const SingleTile: Story = {
  args: {
    level: Level.makeEmpty(1).putPiece([
      new Tile({position: {x: 2, y: 2}, type: "volcano"}),
    ]),
  },
};

export const ThreeTiles: Story = {
  args: {
    level: Level.makeEmpty(1).putPiece([
    new Tile({position: {x: 2, y: 2}, type: "volcano"}),
    new Tile({position: {x: 1, y: 3}, type: "volcano"}),
    new Tile({position: {x: 2, y: 3}, type: "volcano"}),
    ]),
  },
};
