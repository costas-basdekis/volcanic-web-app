import type {Meta, StoryObj} from '@storybook/react';

import {RBaseTile} from "../../components";
import _ from 'underscore';
import {Fragment} from "react";
import {svgWrapper} from "../decorators";
import {Hex, HexPosition} from "../../HexPosition";

const meta: Meta<{ center: HexPosition, clockwise: boolean }> = {
  title: 'Hex Rotation Visualisation',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  render: ({center, clockwise}) => {
    const depthPositions: [HexPosition, string][] = [
      [center.offset(1, 0), "red"],
      [center.offset(2, 0), "green"],
      [center.offset(3, 0), "blue"],
      [center.offset(4, 0), "yellow"],
      [center.offset(1, 1), "cyan"],
      [center.offset(2, 1), "magenta"],
      [center.offset(3, 1), "orange"],
      [center.offset(1, 2), "purple"],
      [center.offset(2, 2), "brown"],
      [center.offset(1, 3), "silver"],
    ];
    return (
      <>
        <RBaseTile position={center} fill={"black"} />
        {depthPositions.map(([position, colour], index) => _.range(1, 7).map(count => (
          <Fragment key={`${index},${count}`}>
            <RBaseTile position={position.rotate(count * (clockwise ? 1 : -1), center)} label={`${index + 1} + CW * ${count}`} fill={colour} />
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
    center: HexPosition.Center,
    clockwise: true,
  },
};

export const ClockwiseRotationsAroundNegativeEvenRow: Story = {
  args: {
    center: Hex(0, -1, -1),
    clockwise: true,
  },
};

export const ClockwiseRotationsAroundPositiveEvenRow: Story = {
  args: {
    center: Hex(0, 1, 1),
    clockwise: true,
  },
};

export const ClockwiseRotationsAroundNegativeOddRow: Story = {
  args: {
    center: Hex(0, 0, -1),
    clockwise: true,
  },
};

export const ClockwiseRotationsAroundPositiveOddRow: Story = {
  args: {
    center: Hex(0, 1),
    clockwise: true,
  },
};

export const CounterClockwiseRotationsAround0EvenRow: Story = {
  args: {
    center: HexPosition.Center,
    clockwise: false,
  },
};

export const CounterClockwiseRotationsAroundNegativeEvenRow: Story = {
  args: {
    center: Hex(0, -1, -1),
    clockwise: false,
  },
};

export const CounterClockwiseRotationsAroundPositiveEvenRow: Story = {
  args: {
    center: Hex(0, 1, 1),
    clockwise: false,
  },
};

export const CounterClockwiseRotationsAroundNegativeOddRow: Story = {
  args: {
    center: Hex(0, -1),
    clockwise: false,
  },
};

export const CounterClockwiseRotationsAroundPositiveOddRow: Story = {
  args: {
    center: Hex(0, 1),
    clockwise: false,
  },
};
