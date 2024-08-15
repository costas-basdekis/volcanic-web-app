import type {Meta, StoryObj} from '@storybook/react';

import {Center, offsetPosition, Position, rotatePositionCW} from "../../hexGridUtils";
import {RBaseTile} from "../../components";
import _ from 'underscore';
import {Fragment} from "react";
import {svgWrapper} from "../decorators";

const meta: Meta<{ center: Position }> = {
  title: 'Hex Rotation Visualisation',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  render: ({center}) => {
    const depthPositions: [Position, string][] = [
      [offsetPosition(center, 1), "red"],
      [offsetPosition(center, 2), "green"],
      [offsetPosition(center, 3), "blue"],
      [offsetPosition(center, 4), "yellow"],
      [offsetPosition(center, 1, 1), "cyan"],
      [offsetPosition(center, 2, 1), "magenta"],
      [offsetPosition(center, 3, 1), "orange"],
      [offsetPosition(center, 1, 2), "purple"],
      [offsetPosition(center, 2, 2), "brown"],
      [offsetPosition(center, 1, 3), "silver"],
    ];
    return (
      <>
        <RBaseTile position={center} fill={"black"} />
        {depthPositions.map(([position, colour], index) => _.range(1, 7).map(count => (
          <Fragment key={`${index},${count}`}>
            <RBaseTile position={rotatePositionCW(position, count, center)} label={`${index + 1} + CW * ${count}`} fill={colour} />
          </Fragment>
        )))}
      </>
    );
  },
  decorators: [
    svgWrapper,
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const ClockwiseRotationsAround0EvenRow: Story = {
  args: {
    center: Center,
  },
};

export const ClockwiseRotationsAroundNegativeEvenRow: Story = {
  args: {
    center: {x: 0, y: -2},
  },
};

export const ClockwiseRotationsAroundPositiveEvenRow: Story = {
  args: {
    center: {x: 0, y: 2},
  },
};

export const ClockwiseRotationsAroundNegativeOddRow: Story = {
  args: {
    center: {x: 0, y: -1},
  },
};

export const ClockwiseRotationsAroundPositiveOddRow: Story = {
  args: {
    center: {x: 0, y: 1},
  },
};
