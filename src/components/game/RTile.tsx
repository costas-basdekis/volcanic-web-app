import {RBaseTile} from "./RBaseTile";
import {Tile} from "../../game";
import {ReactNode} from "react";

interface RTileProps {
  tile: Tile,
  size?: number,
  drawSize?: number,
  drawSizeLevel?: number,
  content?: ReactNode,
}

export function RTile(props: RTileProps) {
  const {tile, size, drawSize, drawSizeLevel, content} = props;
  return (
    <RBaseTile
      fill={RTile.fillMap[tile.type]}
      position={tile.position}
      size={size}
      drawSize={drawSize}
      drawSizeLevel={drawSizeLevel}
      content={content}
    />
  );
}
RTile.fillMap = {
  volcano: "red",
  white: "white",
  black: "#404040",
};
