import {RBaseTile} from "./RBaseTile";
import {Tile} from "../../game";

interface RTileProps {
  tile: Tile,
  size?: number,
  drawSize?: number,
}

export function RTile(props: RTileProps) {
  const {tile, size, drawSize } = props;
  return (
    <RBaseTile
      fill={RTile.fillMap[tile.type]}
      position={tile.position}
      size={size}
      drawSize={drawSize}
    />
  );
}
RTile.fillMap = {
  volcano: "red",
  white: "white",
  black: "black",
};
