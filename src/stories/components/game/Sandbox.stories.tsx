import type { Meta, StoryObj } from '@storybook/react';

import {ReactNode, useCallback, useEffect, useState} from "react";
import {
  Action,
  ActionSelector, AutoGrabFocus,
  NextPieceDisplay,
  PlayerSelector,
  RBoard,
  RPreview,
} from "../../../components";
import {svgWrapper} from "../../decorators";
import {BlackOrWhite, Board, Piece} from "../../../game";

const meta: Meta<{initialBoard?: Board}> = {
  title: 'Sandbox',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    svgWrapper,
  ],
  render: ({initialBoard = Board.makeEmpty()}, context) => {
    const [board, setBoard] = useState(initialBoard);
    const [nextPiece, setNextPiece] = useState(Piece.presets.BlackWhite);
    const [action, setAction] = useState<Action>("place-tile");
    const [colour, setColour] = useState<BlackOrWhite>("white");

    const onChangeNextPiece = useCallback((piece: Piece) => {
      setNextPiece(piece);
    }, []);
    const onChangeAction = useCallback((action: Action) => {
      setAction(action);
    }, []);

    const setTools: ((extraTools: ReactNode) => void) | undefined = context["setTools"];

    useEffect(() => {
      setTools?.(<>
        <NextPieceDisplay onChangePiece={onChangeNextPiece}/>
        <ActionSelector action={action} onChangeAction={onChangeAction}/>
        <PlayerSelector onSetColour={setColour}/>
        <AutoGrabFocus/>
      </>);
      return () => {
        setTools?.(null);
      };
    }, [action, onChangeAction, onChangeNextPiece, setTools]);

    return <>
      <RBoard board={board}/>
      <RPreview
        board={board}
        nextPiece={nextPiece}
        action={action}
        colour={colour}
        onBoardChange={setBoard}
      />
    </>;
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
