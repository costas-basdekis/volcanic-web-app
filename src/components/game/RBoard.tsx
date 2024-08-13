import {Component, Fragment} from "react";
import {Board} from "../../game";
import {RTile} from "./RTile";

export interface RBoardProps {
  board: Board,
}

export class RBoard extends Component<RBoardProps> {

  render() {
    const {board} = this.props;
    return <>
      {Array.from(board.levels.values()).map(level => <Fragment key={level.index}>
        {level.tiles.map(tile => (
          <RTile key={tile.key} tile={tile} />
        ))}
      </Fragment>)}
    </>;
  }
}
