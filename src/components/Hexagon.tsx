import React, {MouseEvent, ReactNode, useCallback} from "react";
import {CartesianPosition} from "../CartesianPosition";
import {pointsToPathD} from "../svgUtils";
import {isTouchDevice} from "../htmlUtils";
import {HexPosition} from "../game";

export interface HexagonProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  position?: CartesianPosition,
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
    label, content, onClick,
  } = props;

  const onPointerEnter = useCallback((e: MouseEvent) => {
    if (!isTouchDevice()) {
      return;
    }
    onClick?.(e);
  }, [onClick]);

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
      onPointerEnter={props.onClick ? onPointerEnter : undefined}
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
Hexagon.pathD = pointsToPathD(HexPosition.Center.getTileOutline(1, 1));
