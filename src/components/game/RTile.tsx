import {Component} from "react";
import {RBaseTile} from "./RBaseTile";
import {Tile} from "../../game";

interface RTileProps {
  tile: Tile,
}

export class RTile extends Component<RTileProps> {
  static fillMap: {[key in Tile["type"]]: string} = {
    volcano: "red",
    white: "white",
    black: "black",
  };

  render() {
    const {tile} = this.props;
    return (
      <RBaseTile fill={RTile.fillMap[tile.type]} position={tile.position} />
    );
  }
}
