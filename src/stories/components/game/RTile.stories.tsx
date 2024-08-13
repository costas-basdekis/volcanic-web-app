import type { Meta, StoryObj } from '@storybook/react';

import {ComponentProps, Fragment} from "react";
import _ from "underscore";
import {RTile} from "../../../components";

type TileExtendedProps = ComponentProps<typeof RTile> & {x?: number, y?: number};

const meta: Meta<TileExtendedProps> = {
  title: 'RTile',
  component: RTile,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
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
    <RTile {...rest} position={{x: 0, y}} />
    <RTile {...rest} position={{x: 1, y}} />
    <RTile {...rest} position={{x: 2, y}} />
    <RTile {...rest} position={{x: 3, y}} />
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
    <RTile {...rest} position={{x, y: 0}} />
    <RTile {...rest} position={{x, y: 1}} />
    <RTile {...rest} position={{x, y: 2}} />
    <RTile {...rest} position={{x, y: 3}} />
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
          <RTile {...args} key={y} position={{x, y}} />
        ))}
      </Fragment>
    ))}
  </>,
};
