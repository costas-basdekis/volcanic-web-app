import {Component} from "react";
import {Level} from "../../game";
import {RTile} from "./RTile";

export interface RLevelProps {
  level: Level,
}

export class RLevel extends Component<RLevelProps> {
  render() {
    const {level} = this.props;
    return level.tiles.map(tile => (
      <RTile key={tile.key} tile={tile} />
    ));
  }
}
