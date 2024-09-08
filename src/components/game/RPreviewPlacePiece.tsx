import {useCallback, useMemo, useState} from "react";
import {RBaseTile} from "./RBaseTile";
import {Level, Piece, HexPosition} from "../../game";
import {RPiece} from "./RPiece";

export interface RPreviewPlacePieceProps {
  placeablePositionsAndLevels: [HexPosition, Level][],
  piece: Piece,
  onPlacePiece?: ((position: HexPosition) => void) | undefined | null,
}

export function RPreviewPlacePiece(props: RPreviewPlacePieceProps) {
  const {placeablePositionsAndLevels, piece, onPlacePiece} = props;
  const [hoveredPosition, setHoveredPosition] = useState<HexPosition | null>(null);

  const levelByPlaceablePosition = useMemo(() => {
    return new Map(placeablePositionsAndLevels.map(([position, level]) => [position.key, level]));
  }, [placeablePositionsAndLevels]);
  const hoveredLevel = hoveredPosition ? levelByPlaceablePosition.get(hoveredPosition.key) : null;

  const onBackgroundHoverMouseEnter = useCallback(() => {
    setHoveredPosition(null);
  }, []);
  const onTileHover = useCallback((position: HexPosition, hovering: boolean) => {
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
  const onClick = useCallback((position: HexPosition) => {
    onPlacePiece?.(position);
  }, [onPlacePiece]);

  return <>
    {placeablePositionsAndLevels.map(([position, level]) => (
      <PlaceableTile
        key={position.key}
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
        key={position.key}
        position={position}
        onHover={onTileHover}
        onClick={onPlacePiece ? onClick : null}
      />
    ))}
  </>;
}

interface HoverTileProps {
  position: HexPosition,
  onHover?: ((position: HexPosition, hovering: boolean) => void) | undefined | null,
  onClick?: ((position: HexPosition) => void) | undefined | null,
}

function HoverTile(props: HoverTileProps) {
  const {position} = props;
  return (
    <RBaseTile
      key={position.key}
      stroke={"transparent"}
      fill={"transparent"}
      position={position}
      onHover={props.onHover}
      onClick={props.onClick}
    />
  );
}

interface PlaceableTileProps {
  position: HexPosition,
  level: Level,
  onClick?: ((position: HexPosition) => void) | null | undefined,
}

function PlaceableTile(props: PlaceableTileProps) {
  const {onClick: outerOnClick, position, level} = props;

  const onClick = useCallback(() => {
    outerOnClick?.(position);
  }, [outerOnClick, position]);

  return (
    <RBaseTile
      key={position.key}
      stroke={"green"}
      strokeWidth={5}
      fill={"transparent"}
      drawSizeLevel={level.index}
      position={position}
      onClick={outerOnClick ? onClick : undefined}
    />
  );
}
