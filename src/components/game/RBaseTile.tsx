import React, {Component} from "react";
import {Hexagon} from "../Hexagon";
import {Center, getTilePosition, Position} from "../../hexGridUtils";

export interface RBaseTileProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  position?: Position,
  label?: string | undefined | null,
  onHover?: ((position: Position, hovering: boolean) => void) | null,
}

export class RBaseTile extends Component<RBaseTileProps> {
  render() {
    const {
      stroke = "black", strokeWidth = 1, fill = "white",
      size = 50, position = Center, label,
    } = this.props;
    return (
      <Hexagon
        stroke={stroke} strokeWidth={strokeWidth} fill={fill}
        size={size}
        position={getTilePosition(position, size)}
        label={label}
        onMouseEnter={this.props.onHover ? this.onMouseEnter : null}
        onMouseLeave={this.props.onHover ? this.onMouseLeave : null}
      />
    )
  }

  onMouseEnter = () => {
    this.props.onHover?.(this.props.position ?? Center, true);
  };

  onMouseLeave = () => {
    this.props.onHover?.(this.props.position ?? Center, false);
  };
}
