import React, {Component} from "react";
import _ from "underscore";
import {Position} from "../hexGridUtils";

export interface HexagonProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  position?: Position,
  label?: string | undefined | null,
  onMouseEnter?: (React.MouseEventHandler) | undefined | null,
  onMouseLeave?: (React.MouseEventHandler) | undefined | null,
}

export class Hexagon extends Component<HexagonProps> {
  static pathPoints: Position[] = _.range(6)
    .map(index => ({x: Math.sin(index * Math.PI / 3), y: Math.cos(index * Math.PI / 3)}));
  static pathD = [
    `M${this.pathPoints[0].x} ${this.pathPoints[0].y}`,
    `L${this.pathPoints[1].x} ${this.pathPoints[1].y}`,
    `L${this.pathPoints[2].x} ${this.pathPoints[2].y}`,
    `L${this.pathPoints[3].x} ${this.pathPoints[3].y}`,
    `L${this.pathPoints[4].x} ${this.pathPoints[4].y}`,
    `L${this.pathPoints[5].x} ${this.pathPoints[5].y}`,
    `Z`,
  ].join(" ")

  render() {
    const {
      stroke = "black", strokeWidth = 1, fill = "white",
      size = 100, position = {x: 200, y: 200}, label,
    } = this.props;
    return <>
      <path
        d={Hexagon.pathD}
        stroke={stroke} strokeWidth={strokeWidth}
        fill={fill}
        vectorEffect={"non-scaling-stroke"}
        style={{transform: `translate(${position.x}px, ${position.y}px) scale(${size})`}}
        onMouseEnter={this.props.onMouseEnter ?? undefined}
        onMouseLeave={this.props.onMouseLeave ?? undefined}
      />
      {label ? (
        <text
          x={position.x}
          y={position.y}
          dominantBaseline={"middle"}
          textAnchor={"middle"}
        >
          {label}
        </text>
      ) : null}
    </>;
  }
}
