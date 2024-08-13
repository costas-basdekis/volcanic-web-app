import {Component, Fragment} from "react";
import {Board, Tile} from "../../game";
import {RTile} from "./RTile";

export interface RBoardProps {
  board: Board,
}

export class RBoard extends Component<RBoardProps> {
  static fillMap: {[key in Tile["type"]]: string} = {
    volcano: "red",
    white: "white",
    black: "black",
  };

  render() {
    const {board} = this.props;
    return <>
      {Array.from(board.levels.values()).map(level => <Fragment key={level.index}>
        {level.tiles.map(tile => (
          <RTile key={tile.key} fill={RBoard.fillMap[tile.type]} position={tile.position} />
        ))}
      </Fragment>)}
    </>;
  }
}
