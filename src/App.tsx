import React, {Component} from 'react';
import './App.css';
import {Board, Piece} from "./game";
import {AutoResizeSvg, RBaseTile, RBoard} from "./components";
import {makePositionKey, Position} from "./hexGridUtils";

interface AppState {
  board: Board,
  nextPiece: Piece,
}

export default class App extends Component<{}, AppState> {
  state: AppState = {
    board: Board.makeEmpty().placePiece(Piece.presets.WhiteBlack),
    nextPiece: Piece.presets.BlackWhite,
  };

  render() {
    const {board, nextPiece} = this.state;
    return (
      <div className="App">
        <AutoResizeSvg>
          <RBoard board={board}/>
          {board.levels.get(1)!.getPlaceablePositionsForPiece(nextPiece).map(position => (
            <PlaceableTile
              key={makePositionKey(position)}
              position={position}
              onClick={this.onClick}
            />
          ))}
        </AutoResizeSvg>
      </div>
    );
  }

  onClick = (position: Position) => {
    this.setState(({board, nextPiece}) => ({
      board: board.placePieceAt(nextPiece, position),
    }));
  };
}

interface PlaceableTileProps {
  position: Position,
  onClick?: ((position: Position) => void) | null | undefined,
}

class PlaceableTile extends Component<PlaceableTileProps> {
  render() {
    const {position} = this.props;
    return (
      <RBaseTile
        key={makePositionKey(position)}
        fill={"green"}
        position={position}
        onClick={this.props.onClick ? this.onClick : undefined}
      />
    )
  }

  onClick = () => {
    this.props.onClick?.(this.props.position);
  };
}
