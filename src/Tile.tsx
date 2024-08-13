import React, {Component} from "react";
import {Hexagon} from "./Hexagon";
import {getTilePosition, Position} from "./hexGridUtils";

export interface TileProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  position?: Position,
}

export class Tile extends Component<TileProps> {
  render() {
    const {
      stroke = "black", strokeWidth = 1, fill = "white",
      size = 100, position = {x: 0, y: 0},
    } = this.props;
    return (
      <Hexagon
        stroke={stroke} strokeWidth={strokeWidth} fill={fill}
        size={size}
        position={getTilePosition(position, size)}
      />
    )
  }
}
