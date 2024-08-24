import {makePositionKey, Position} from "../../hexGridUtils";
import {Unit} from "../../game";
import {useCallback, useState} from "react";
import {RBaseTile} from "./RBaseTile";
import {RUnit} from "./RUnit";

export interface RPreviewPlaceUnitProps {
  unit: Unit;
  placeablePositions: Position[];
  onPlaceUnit: (unit: Unit, position: Position) => void;
}

export function RPreviewPlaceUnit(props: RPreviewPlaceUnitProps) {
  const {unit, placeablePositions, onPlaceUnit} = props;

  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

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
  const onTileClick = useCallback((position: Position) => {
    onPlaceUnit(unit, position);
  }, [onPlaceUnit, unit]);

  return <>
    {placeablePositions.map(position => (
      <PlaceablePawn
        key={makePositionKey(position)}
        position={position}
        hoveredPosition={hoveredPosition}
        unit={unit}
        onHover={onTileHover}
        onClick={onTileClick}
      />
    ))}
  </>;
}

interface PlaceablePawnProps {
  position: Position;
  unit: Unit;
  hoveredPosition: Position | null;
  onHover: (position: Position, hovering: boolean) => void,
  onClick: (position: Position) => void;
}

function PlaceablePawn(props: PlaceablePawnProps) {
  const {position, hoveredPosition, unit, onClick} = props;

  return (
    <RBaseTile
      stroke={"transparent"}
      fill={"transparent"}
      position={position}
      content={<RUnit unit={unit} preview={position !== hoveredPosition} />}
      onHover={props.onHover}
      onClick={onClick}
    />
  );
}
