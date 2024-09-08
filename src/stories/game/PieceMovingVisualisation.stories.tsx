import type { Meta, StoryObj } from '@storybook/react';

import {Piece, HexPosition} from "../../game";
import {RPiece} from "../../components/";
import {svgWrapper} from "../decorators";

const meta: Meta<{ piece: Piece, offset: HexPosition }> = {
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
    svgWrapper,
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const OffsetMove: Story = {
  args: {
    piece: Piece.presets.BlackWhite.moveFirstTileTo(HexPosition.Center),
    offset: HexPosition.Center,
  },
};
