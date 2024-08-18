import type { Meta, StoryObj } from '@storybook/react';

import {ComponentProps, Fragment} from "react";
import _ from "underscore";
import {BlackOrWhite, RBaseTile, RUnit} from "../../../components";
import {svgWrapper} from "../../decorators";

type TileExtendedProps = ComponentProps<typeof RBaseTile> & {x?: number, y?: number};

const meta: Meta<TileExtendedProps> = {
  title: 'RBaseTile',
  component: RBaseTile,
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

export const Origin: Story = {};

export const Position2x2: Story = {
  args: {
    position: {x: 2, y: 2},
  },
};

export const Row: Story = {
  parameters: {
    controls: {
      exclude: ["position"],
    },
  },
  args: {
    y: 2,
  },
  render: ({y = 2, ...rest}) => <>
    <RBaseTile {...rest} position={{x: 0, y}} />
    <RBaseTile {...rest} position={{x: 1, y}} />
    <RBaseTile {...rest} position={{x: 2, y}} />
    <RBaseTile {...rest} position={{x: 3, y}} />
  </>,
};

export const Column: Story = {
  parameters: {
    controls: {
      exclude: ["position"],
    },
  },
  args: {
    x: 2,
  },
  render: ({x = 2, ...rest}) => <>
    <RBaseTile {...rest} position={{x, y: 0}} />
    <RBaseTile {...rest} position={{x, y: 1}} />
    <RBaseTile {...rest} position={{x, y: 2}} />
    <RBaseTile {...rest} position={{x, y: 3}} />
  </>,
};

export const Grid4x4: Story = {
  args: {
    fill: "transparent",
  },
  render: (args) => <>
    {_.range(4).map(x => (
      <Fragment key={x}>
        {_.range(4).map(y => (
          <RBaseTile {...args} key={y} position={{x, y}} />
        ))}
      </Fragment>
    ))}
  </>,
};

export const WithContent: Story = {
  args: {
    fill: "white",
  },
  render: (args) => <>
    <RBaseTile {...args} position={{x: 0, y: 0}} label={"Label"} />
    <RBaseTile {...args} position={{x: 1, y: 0}} content={<RUnit.Pawn colour={"white"} />} />
  </>,
};

export const Units: Story = {
  render: (args) => <>
    {_.range(1, 7).map(count => (
      <RBaseTile
        {...args}
        key={count}
        position={{x: -4 + count, y: 0}}
        content={<RUnit.Pawn.Many colour={"white"} count={count} />}
      />
    ))}
    {(["white", "black"] as BlackOrWhite[]).map((colour, colourIndex) => <Fragment key={colour}>
      {[{fill: "white", xOffset: -3}, {fill: "black", xOffset: 0}].map(({fill, xOffset}) => <Fragment key={fill}>
        {[RUnit.Pawn, RUnit.Bishop, RUnit.Rook].map((RUnit, unitIndex) => (
          <RBaseTile {...args} key={RUnit.displayName} fill={fill} position={{x: xOffset + unitIndex, y: 1 + colourIndex}} content={<RUnit colour={colour} />} />
        ))}
      </Fragment>)}
    </Fragment>)}
  </>,
};
