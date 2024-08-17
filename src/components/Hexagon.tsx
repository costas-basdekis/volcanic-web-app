import React, {ReactNode} from "react";
import _ from "underscore";
import {Position} from "../hexGridUtils";

export interface HexagonProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  position?: Position,
  label?: string | undefined | null,
  content?: ReactNode,
  onMouseEnter?: (React.MouseEventHandler) | undefined | null,
  onMouseLeave?: (React.MouseEventHandler) | undefined | null,
  onClick?: (React.MouseEventHandler) | undefined | null,
}

export function Hexagon(props: HexagonProps) {
  const {
    stroke = "black", strokeWidth = 1, fill = "white",
    size = 100, position = {x: 200, y: 200},
    label, content,
  } = props;
  return <>
    <path
      d={Hexagon.pathD}
      stroke={stroke} strokeWidth={strokeWidth}
      fill={fill}
      vectorEffect={"non-scaling-stroke"}
      style={{transform: `translate(${position.x}px, ${position.y}px) scale(${size})`}}
      onMouseEnter={props.onMouseEnter ?? undefined}
      onMouseLeave={props.onMouseLeave ?? undefined}
      onClick={props.onClick ?? undefined}
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
    {content ? (
      <g transform={`translate(${position.x} ${position.y})`}>
        {content}
      </g>
    ) : null}
  </>;
}
Hexagon.pathPoints = _.range(6)
  .map(index => ({x: Math.sin(index * Math.PI / 3), y: Math.cos(index * Math.PI / 3)}));
Hexagon.pathD = [
  `M${Hexagon.pathPoints[0].x} ${Hexagon.pathPoints[0].y}`,
  `L${Hexagon.pathPoints[1].x} ${Hexagon.pathPoints[1].y}`,
  `L${Hexagon.pathPoints[2].x} ${Hexagon.pathPoints[2].y}`,
  `L${Hexagon.pathPoints[3].x} ${Hexagon.pathPoints[3].y}`,
  `L${Hexagon.pathPoints[4].x} ${Hexagon.pathPoints[4].y}`,
  `L${Hexagon.pathPoints[5].x} ${Hexagon.pathPoints[5].y}`,
  `Z`,
].join(" ");
