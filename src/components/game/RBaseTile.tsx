import React, {Component} from "react";
import {Hexagon} from "../../Hexagon";
import {getTilePosition, Position} from "../../hexGridUtils";

export interface RBaseTileProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  position?: Position,
}

export class RBaseTile extends Component<RBaseTileProps> {
  render() {
    const {
      stroke = "black", strokeWidth = 1, fill = "white",
      size = 50, position = {x: 0, y: 0},
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
