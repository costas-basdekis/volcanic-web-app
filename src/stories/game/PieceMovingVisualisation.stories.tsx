import type { Meta, StoryObj } from '@storybook/react';

import {Center, Position} from "../../hexGridUtils";
import {Piece} from "../../game/Piece";
import {RPiece} from "../../components/game/RPiece";
import {AutoResizeSvg} from "../../components";

const meta: Meta<{ piece: Piece, offset: Position }> = {
  title: 'Piece Moving Visualisation',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  render: ({piece, offset}) => {
    return (
      <>
        <RPiece piece={piece.moveFirstTileTo(offset)} />
      </>
    );
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

export const OffsetMove: Story = {
  args: {
    piece: Piece.presets.BlackWhite.moveFirstTileTo(Center),
    offset: Center,
  },
};
