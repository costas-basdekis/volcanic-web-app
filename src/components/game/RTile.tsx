import {RBaseTile} from "./RBaseTile";
import {Tile} from "../../game";

interface RTileProps {
  tile: Tile,
  size?: number,
  drawSize?: number,
  drawSizeLevel?: number,
}

export function RTile(props: RTileProps) {
  const {tile, size, drawSize, drawSizeLevel } = props;
  return (
    <RBaseTile
      fill={RTile.fillMap[tile.type]}
      position={tile.position}
      size={size}
      drawSize={drawSize}
      drawSizeLevel={drawSizeLevel}
    />
  );
}
RTile.fillMap = {
  volcano: "red",
  white: "white",
  black: "#404040",
};
