import {useCallback, useMemo, useState} from "react";
import {RBaseTile} from "./RBaseTile";
import {makePositionKey, Position} from "../../hexGridUtils";
import {Level, Piece} from "../../game";
import {RPiece} from "./RPiece";

export interface RPreviewPlacePieceProps {
  placeablePositionsAndLevels: [Position, Level][],
  piece: Piece,
  onPlacePiece?: ((position: Position) => void) | undefined | null,
}

export function RPreviewPlacePiece(props: RPreviewPlacePieceProps) {
  const {placeablePositionsAndLevels, piece, onPlacePiece} = props;
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

  const levelByPlaceablePosition = useMemo(() => {
    return new Map(placeablePositionsAndLevels);
  }, [placeablePositionsAndLevels]);
  const hoveredLevel = levelByPlaceablePosition.get(hoveredPosition!);

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
    {placeablePositionsAndLevels.map(([position, level]) => (
      <PlaceableTile
        key={makePositionKey(position)}
        position={position}
        level={level}
      />
    ))}
    {hoveredPosition && hoveredLevel ? (
      <RPiece
        piece={piece.moveFirstTileTo(hoveredPosition)}
        drawSizeLevel={hoveredLevel.index}
      />
    ) : null}
    <rect
      x={-10000} y={-10000}
      width={20000} height={20000}
      stroke={"transparent"}
      fill={"transparent"}
      onMouseEnter={onBackgroundHoverMouseEnter}
    />
    {placeablePositionsAndLevels.map(([position]) => (
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
  level: Level,
  onClick?: ((position: Position) => void) | null | undefined,
}

function PlaceableTile(props: PlaceableTileProps) {
  const {onClick: outerOnClick, position, level} = props;

  const onClick = useCallback(() => {
    outerOnClick?.(position);
  }, [outerOnClick, position]);

  return (
    <RBaseTile
      key={makePositionKey(position)}
      stroke={"green"}
      strokeWidth={5}
      fill={"transparent"}
      drawSizeLevel={level.index}
      position={position}
      onClick={outerOnClick ? onClick : undefined}
    />
  );
}
