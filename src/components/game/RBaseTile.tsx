import React, {ReactNode, useCallback} from "react";
import {Hexagon} from "../Hexagon";
import {HexPosition} from "../../game";

export interface RBaseTileProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  drawSize?: number,
  drawSizeLevel?: number,
  position?: HexPosition,
  label?: string | undefined | null,
  content?: ReactNode,
  onHover?: ((position: HexPosition, hovering: boolean) => void) | null,
  onClick?: ((position: HexPosition) => void) | null,
}

export function RBaseTile(props: RBaseTileProps) {
  const {
    onHover: outerOnHover, onClick: outerOnClick,
    stroke = "black", strokeWidth = 1, fill = "white",
    size = 50, drawSizeLevel = 1, drawSize = size - (drawSizeLevel - 1) * 5,
    position = HexPosition.Center, label, content,
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
      position={position.getTilePosition(size)}
      label={label}
      content={content}
      onMouseEnter={outerOnHover ? onMouseEnter : null}
      onMouseLeave={outerOnHover ? onMouseLeave : null}
      onClick={outerOnClick ? onClick : null}
    />
  );
}
