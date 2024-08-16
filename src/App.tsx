import React, {Component} from 'react';
import './App.css';
import {Board, Piece} from "./game";
import {AutoResizeSvg, RBaseTile, RBoard} from "./components";
import {makePositionKey, Position} from "./hexGridUtils";
import {RPiece} from "./components/game/RPiece";

interface AppState {
  board: Board,
  nextPiece: Piece,
  hoveredPosition: Position | null,
}

export default class App extends Component<{}, AppState> {
  state: AppState = {
    board: Board.makeEmpty().placePiece(Piece.presets.WhiteBlack),
    nextPiece: Piece.presets.BlackWhite,
    hoveredPosition: null,
  };

  render() {
    const {board, nextPiece, hoveredPosition} = this.state;
    const placeablePositions = board.levels.get(1)!.getPlaceablePositionsForPiece(nextPiece);
    return (
      <div className="App">
        <AutoResizeSvg>
          <RBoard board={board}/>
          {placeablePositions.map(position => (
            <PlaceableTile
              key={makePositionKey(position)}
              position={position}
            />
          ))}
          {hoveredPosition ? (
            <RPiece piece={nextPiece.moveFirstTileTo(hoveredPosition)} />
          ) : null}
          <rect
            x={-10000} y={-10000}
            width={20000} height={20000}
            stroke={"transparent"}
            fill={"transparent"}
            onMouseEnter={this.onBackgroundHoverMouseEnter}
          />
          {placeablePositions.map(position => (
            <HoverTile
              key={makePositionKey(position)}
              position={position}
              onHover={this.onTileHover}
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

  onBackgroundHoverMouseEnter = () => {
    this.setState({hoveredPosition: null});
  };

  onTileHover = (position: Position, hovering: boolean) => {
    this.setState(({hoveredPosition}) => {
      if (hovering) {
        return {
          hoveredPosition: position,
        };
      } else {
        if (hoveredPosition !== position) {
          return null;
        }
        return {
          hoveredPosition: null,
        };
      }
    });
  };
}

interface HoverTileProps {
  position: Position,
  onHover?: ((position: Position, hovering: boolean) => void) | undefined | null,
  onClick?: ((position: Position) => void) | undefined | null,
}

class HoverTile extends Component<HoverTileProps> {
  render() {
    const {position} = this.props;
    return (
      <RBaseTile
        key={makePositionKey(position)}
        stroke={"transparent"}
        fill={"transparent"}
        position={position}
        onHover={this.props.onHover}
        onClick={this.props.onClick}
      />
    )
  }
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
