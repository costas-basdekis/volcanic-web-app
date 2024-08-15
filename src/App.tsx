import React, {Component} from 'react';
import './App.css';
import {Board, Piece} from "./game";
import {AutoResizeSvg, RBaseTile, RBoard} from "./components";
import {makePositionKey} from "./hexGridUtils";

interface AppState {
  board: Board,
  nextPiece: Piece,
}

export default class App extends Component<{}, AppState> {
  state: AppState = {
    board: Board.makeEmpty().putPiece(Piece.presets.WhiteBlack),
    nextPiece: Piece.presets.BlackWhite,
  };

  render() {
    const {board, nextPiece} = this.state;
    return (
      <div className="App">
        <AutoResizeSvg>
          <RBoard board={board}/>
          {board.levels.get(1)!.getPlaceablePositionsForPiece(nextPiece).map(position => (
            <RBaseTile key={makePositionKey(position)} fill={"green"} position={position}/>
          ))}
        </AutoResizeSvg>
      </div>
    );
  }
}
