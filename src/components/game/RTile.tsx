import {RBaseTile} from "./RBaseTile";
import {Tile} from "../../game";

interface RTileProps {
  tile: Tile,
  size?: number,
}

export function RTile(props: RTileProps) {
  const {tile, size} = props;
  return (
    <RBaseTile fill={RTile.fillMap[tile.type]} position={tile.position} size={size} />
  );
}
RTile.fillMap = {
  volcano: "red",
  white: "white",
  black: "black",
};
