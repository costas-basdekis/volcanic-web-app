import type { Meta, StoryObj } from '@storybook/react';

import {ComponentProps, Fragment} from "react";
import _ from "underscore";
import {RBaseTile, RUnit} from "../../../components";
import {svgWrapper} from "../../decorators";
import {BlackOrWhite, Hex, HexPosition, Unit, UnitType} from "../../../game";

type TileExtendedProps = ComponentProps<typeof RBaseTile> & {r?: number, dr?: number};

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
    position: Hex(2, 1, 1),
  },
};

export const Row: Story = {
  parameters: {
    controls: {
      exclude: ["position"],
    },
  },
  args: {
    dr: 2,
  },
  render: ({dr = 2, ...rest}) => <>
    <RBaseTile {...rest} position={Hex(0, dr)} />
    <RBaseTile {...rest} position={Hex(1, dr)} />
    <RBaseTile {...rest} position={Hex(2, dr)} />
    <RBaseTile {...rest} position={Hex(3, dr)} />
  </>,
};

export const Column: Story = {
  parameters: {
    controls: {
      exclude: ["position"],
    },
  },
  args: {
    r: 2,
  },
  render: ({r = 2, ...rest}) => <>
    <RBaseTile {...rest} position={Hex(r, 0)} />
    <RBaseTile {...rest} position={Hex(r, 1)} />
    <RBaseTile {...rest} position={Hex(r, 1, 1)} />
    <RBaseTile {...rest} position={Hex(r, 2, 1)} />
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
          <RBaseTile {...args} key={y} position={HexPosition.fromCartesian({x, y})} />
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
    <RBaseTile {...args} position={Hex(0, 0)} label={"Label"} />
    <RBaseTile {...args} position={Hex(1, 0)} content={<RUnit unit={Unit.Pawn("white", 1)} />} />
  </>,
};

export const Units: Story = {
  render: (args) => <>
    {_.range(1, 7).map(count => (
      <RBaseTile
        {...args}
        key={count}
        position={Hex(-4 + count, 0)}
        content={<RUnit unit={Unit.Pawn("white", count)} />}
      />
    ))}
    {(["white", "black"] as BlackOrWhite[]).map((colour, colourIndex) => <Fragment key={colour}>
      {[{fill: "white", xOffset: -3}, {fill: "black", xOffset: 0}].map(({fill, xOffset}) => <Fragment key={fill}>
        {(["pawn", "bishop", "rook"] as UnitType[]).map((type, unitIndex) => (
          <RBaseTile {...args} key={type} fill={fill} position={HexPosition.fromCartesian({x: xOffset + unitIndex, y: 1 + colourIndex})} content={<RUnit unit={new Unit({type, colour, count: 1})} />} />
        ))}
      </Fragment>)}
    </Fragment>)}
  </>,
};
