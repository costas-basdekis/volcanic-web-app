import {useCallback, useState} from "react";
import {RBaseTile} from "./RBaseTile";
import {makePositionKey, Position} from "../../hexGridUtils";
import {Piece} from "../../game";
import {RPiece} from "./RPiece";

export interface RPreviewPlacePieceProps {
  placeablePositions: Position[],
  piece: Piece,
  onPlacePiece?: ((position: Position) => void) | undefined | null,
}

export function RPreviewPlacePiece(props: RPreviewPlacePieceProps) {
  const {placeablePositions, piece, onPlacePiece} = props;
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

  const onBackgroundHoverMouseEnter = useCallback(() => {
    setHoveredPosition(null);
  }, []);
  const onTileHover = useCallback((position: Position, hovering: boolean) => {
    setHoveredPosition(hoveredPosition => {
      if (hovering) {
        return position;
      } else {
        if (hoveredPosition !== position) {
          return hoveredPosition;
        }
        return null;
      }
    });
  }, []);
  const onClick = useCallback((position: Position) => {
    onPlacePiece?.(position);
  }, [onPlacePiece]);

  return <>
    {placeablePositions.map(position => (
      <PlaceableTile
        key={makePositionKey(position)}
        position={position}
      />
    ))}
    {hoveredPosition ? (
      <RPiece piece={piece.moveFirstTileTo(hoveredPosition)}/>
    ) : null}
    <rect
      x={-10000} y={-10000}
      width={20000} height={20000}
      stroke={"transparent"}
      fill={"transparent"}
      onMouseEnter={onBackgroundHoverMouseEnter}
    />
    {placeablePositions.map(position => (
      <HoverTile
        key={makePositionKey(position)}
        position={position}
        onHover={onTileHover}
        onClick={onPlacePiece ? onClick : null}
      />
    ))}
  </>;
}

interface HoverTileProps {
  position: Position,
  onHover?: ((position: Position, hovering: boolean) => void) | undefined | null,
  onClick?: ((position: Position) => void) | undefined | null,
}

function HoverTile(props: HoverTileProps) {
  const {position} = props;
  return (
    <RBaseTile
      key={makePositionKey(position)}
      stroke={"transparent"}
      fill={"transparent"}
      position={position}
      onHover={props.onHover}
      onClick={props.onClick}
    />
  );
}

interface PlaceableTileProps {
  position: Position,
  onClick?: ((position: Position) => void) | null | undefined,
}

function PlaceableTile(props: PlaceableTileProps) {
  const {onClick: outerOnClick, position} = props;

  const onClick = useCallback(() => {
    outerOnClick?.(position);
  }, [outerOnClick, position]);

  return (
    <RBaseTile
      key={makePositionKey(position)}
      fill={"green"}
      position={position}
      onClick={outerOnClick ? onClick : undefined}
    />
  );
}
