import React, {Component} from "react";
import {Hexagon} from "./Hexagon";

export interface TileProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  position?: { x: number, y: number },
}

export class Tile extends Component<TileProps> {
  render() {
    const {
      stroke = "black", strokeWidth = 1, fill = "white",
      size = 100, position = {x: 0, y: 0},
    } = this.props;
    const evenRow = position.y % 2 === 0;
    const x = position.x + (evenRow ? 0 : 0.5);
    const y = position.y;
    return (
      <Hexagon
        stroke={stroke} strokeWidth={strokeWidth} fill={fill}
        size={size}
        position={{
          x: x * Math.sin(Math.PI / 3) * size * 2,
          y: y * Math.cos(Math.PI / 3) * size * 3,
        }}
      />
    )
  }
}
