import {Component} from "react";
import {Piece} from "../../game";
import {RTile} from "./RTile";

export interface RPieceProps {
  piece: Piece,
  size?: number,
}

export class RPiece extends Component<RPieceProps> {
  render() {
    const {piece, size} = this.props;
    return piece.tiles.map(tile => (
      <RTile key={tile.key} tile={tile} size={size} />
    ));
  }
}
