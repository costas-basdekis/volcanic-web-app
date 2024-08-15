import type {Meta, StoryObj} from '@storybook/react';

import {Center, offsetPosition, Position, rotatePosition} from "../../hexGridUtils";
import {RBaseTile} from "../../components";
import _ from 'underscore';
import {Fragment} from "react";
import {svgWrapper} from "../decorators";

const meta: Meta<{ center: Position, clockwise: boolean }> = {
  title: 'Hex Rotation Visualisation',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  render: ({center, clockwise}) => {
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
            <RBaseTile position={rotatePosition(position, count * (clockwise ? 1 : -1), center)} label={`${index + 1} + CW * ${count}`} fill={colour} />
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
    clockwise: true,
  },
};

export const ClockwiseRotationsAroundNegativeEvenRow: Story = {
  args: {
    center: {x: 0, y: -2},
    clockwise: true,
  },
};

export const ClockwiseRotationsAroundPositiveEvenRow: Story = {
  args: {
    center: {x: 0, y: 2},
    clockwise: true,
  },
};

export const ClockwiseRotationsAroundNegativeOddRow: Story = {
  args: {
    center: {x: 0, y: -1},
    clockwise: true,
  },
};

export const ClockwiseRotationsAroundPositiveOddRow: Story = {
  args: {
    center: {x: 0, y: 1},
    clockwise: true,
  },
};

export const CounterClockwiseRotationsAround0EvenRow: Story = {
  args: {
    center: Center,
    clockwise: false,
  },
};

export const CounterClockwiseRotationsAroundNegativeEvenRow: Story = {
  args: {
    center: {x: 0, y: -2},
    clockwise: false,
  },
};

export const CounterClockwiseRotationsAroundPositiveEvenRow: Story = {
  args: {
    center: {x: 0, y: 2},
    clockwise: false,
  },
};

export const CounterClockwiseRotationsAroundNegativeOddRow: Story = {
  args: {
    center: {x: 0, y: -1},
    clockwise: false,
  },
};

export const CounterClockwiseRotationsAroundPositiveOddRow: Story = {
  args: {
    center: {x: 0, y: 1},
    clockwise: false,
  },
};
