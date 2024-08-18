import type { Meta, StoryObj } from '@storybook/react';

import {ComponentProps, Fragment} from "react";
import {RPiece, RPieceOutline} from "../../../components";
import {svgWrapper} from "../../decorators";
import {Piece} from "../../../game";
import {getTilePosition, Line, PieceOutliner} from "../../../hexGridUtils";

const meta: Meta<ComponentProps<typeof RPieceOutline>> = {
  title: 'RPieceOutline',
  component: RPieceOutline,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    svgWrapper,
  ],
  render: (props) => {
    return <>
      <RPiece piece={props.piece} />
      <RPieceOutline {...props} />
    </>;
  },
  args: {
    piece: Piece.presets.BlackWhite,
    levelIndex: 1,
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const SinglePiece: Story = {};

export const DebugGetTilesLines: Story = {
  render: (props) => {
    const tilesLines = new PieceOutliner({piece: props.piece, size: 50, drawSize: 50}).getTilesLines();
    return <>
      <RPiece piece={props.piece} />
      <RPieceOutline {...props} />
      {props.piece.tiles.map((tile, tileIndex) => {
        const tilePosition = getTilePosition(tile.position, 50);
        const tileLines: Line[] = tilesLines[tileIndex];
        return tileLines.map((line, lineIndex) => {
          const lineMiddle = {
            x: (line[0].x + line[1].x) / 2,
            y: (line[0].y + line[1].y) / 2,
          }
          return (
            <line
              key={`${tileIndex},${lineIndex}`}
              x1={tilePosition.x} y1={tilePosition.y}
              x2={lineMiddle.x} y2={lineMiddle.y}
              stroke={"black"}
            />
          );
        });
      }).flat()}
    </>;
  },
}

export const DebugGetLinesInOutline: Story = {
  render: (props) => {
    const outliner = new PieceOutliner({piece: props.piece, size: 50, drawSize: 50});
    const tilesLines = outliner.getTilesLines();
    const linesInOutline = outliner.getLinesInOutline(tilesLines);
    return <>
      <RPiece piece={props.piece} />
      <RPieceOutline {...props} />
      {linesInOutline.map((line, lineIndex) => {
        const lineMiddle = {
          x: (line[0].x + line[1].x) / 2,
          y: (line[0].y + line[1].y) / 2,
        }
        return <Fragment key={lineIndex}>
          <text
            x={-200}
            y={-100 + lineIndex * 15}
            dominantBaseline={"middle"}
            textAnchor={"middle"}
          >
            {lineIndex}
          </text>
          <line
            x1={-200 + 10} y1={-100 + lineIndex * 15}
            x2={lineMiddle.x} y2={lineMiddle.y}
            stroke={"black"}
          />
        </Fragment>;
      })}
    </>;
  },
}
