import {Component} from "react";
import {Board} from "../../game";
import {RLevel} from "./RLevel";

export interface RBoardProps {
  board: Board,
}

export class RBoard extends Component<RBoardProps> {

  render() {
    const {board} = this.props;
    return <>
      {Array.from(board.levels.values()).map(level => (
        <RLevel key={level.index} level={level} />
      ))}
    </>;
  }
}
