import React, {Component} from 'react';
import './App.css';
import {Board, Piece} from "./game";
import {AutoResizeSvg, RBaseTile, RBoard} from "./components";
import {makePositionKey, Position} from "./hexGridUtils";
import {RPiece} from "./components/game/RPiece";

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
          <AutoResizeSvg.Tools>
            <NextPieceDisplay piece={nextPiece} onChangePiece={this.onChangeNextPiece} />
          </AutoResizeSvg.Tools>
        </AutoResizeSvg>
      </div>
    );
  }

  onClick = (position: Position) => {
    this.setState(({board, nextPiece}) => ({
      board: board.placePieceAt(nextPiece, position),
    }));
  };

  onChangeNextPiece = (piece: Piece) => {
    this.setState({nextPiece: piece});
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

interface NextPieceDisplayProps {
  piece: Piece,
  onChangePiece: (piece: Piece) => void,
}

interface NextPieceDisplayState {
}

class NextPieceDisplay extends Component<NextPieceDisplayProps, NextPieceDisplayState> {
  render() {
    const {piece} = this.props;
    const middlePoint = piece.getMiddlePosition(25);
    return (
      <div className={"next-piece-preview"}>
        <label>Next piece:</label>
        <br/>
        <svg width={100} height={100}>
          <g transform={`translate(${50 - middlePoint.x}, ${50 - middlePoint.y})`}>
            <RPiece piece={piece} size={25} />
          </g>
        </svg>
        <br/>
        <button onClick={this.onCwClick}>CW</button>
        <button onClick={this.onCcwClick}>CCW</button>
      </div>
    );
  }

  onCwClick = () => {
    this.props.onChangePiece(this.props.piece.rotate(1));
  };

  onCcwClick = () => {
    this.props.onChangePiece(this.props.piece.rotate(-1));
  };
}
