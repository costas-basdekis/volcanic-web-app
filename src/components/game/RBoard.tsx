import {Board} from "../../game";
import {RLevel} from "./RLevel";

export interface RBoardProps {
  board: Board,
}

export function RBoard(props: RBoardProps) {
  const {board} = props;
  return <>
    {Array.from(board.levels.values()).map(level => (
      <RLevel key={level.index} level={level} unitMap={board.unitMap} />
    ))}
  </>;
}
