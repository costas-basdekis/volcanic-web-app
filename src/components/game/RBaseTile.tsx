import React, {useCallback} from "react";
import {Hexagon} from "../Hexagon";
import {Center, getTilePosition, Position} from "../../hexGridUtils";

export interface RBaseTileProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  drawSize?: number,
  position?: Position,
  label?: string | undefined | null,
  onHover?: ((position: Position, hovering: boolean) => void) | null,
  onClick?: ((position: Position) => void) | null,
}

export function RBaseTile(props: RBaseTileProps) {
  const {
    onHover: outerOnHover, onClick: outerOnClick,
    stroke = "black", strokeWidth = 1, fill = "white",
    size = 50, drawSize = size, position = Center, label,
  } = props;

  const onMouseEnter = useCallback(() => {
    outerOnHover?.(position, true);
  }, [outerOnHover, position]);
  const onMouseLeave = useCallback(() => {
    outerOnHover?.(position, false);
  }, [outerOnHover, position]);
  const onClick = useCallback(() => {
    outerOnClick?.(position);
  }, [outerOnClick, position]);

  return (
    <Hexagon
      stroke={stroke} strokeWidth={strokeWidth} fill={fill}
      size={drawSize}
      position={getTilePosition(position, size)}
      label={label}
      onMouseEnter={outerOnHover ? onMouseEnter : null}
      onMouseLeave={outerOnHover ? onMouseLeave : null}
      onClick={outerOnClick ? onClick : null}
    />
  );
}
