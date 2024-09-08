import {Unit} from "../../game";
import {useCallback, useState} from "react";
import {RBaseTile} from "./RBaseTile";
import {RUnit} from "./RUnit";
import {HexPosition} from "../../HexPosition";

export interface RPreviewPlaceUnitProps {
  unit: Unit;
  placeablePositions: HexPosition[];
  onPlaceUnit: (unit: Unit, position: HexPosition) => void;
}

export function RPreviewPlaceUnit(props: RPreviewPlaceUnitProps) {
  const {unit, placeablePositions, onPlaceUnit} = props;

  const [hoveredPosition, setHoveredPosition] = useState<HexPosition | null>(null);

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
  const onTileClick = useCallback((position: HexPosition) => {
    onPlaceUnit(unit, position);
  }, [onPlaceUnit, unit]);

  return <>
    {placeablePositions.map(position => (
      <PlaceablePawn
        key={position.key}
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
  position: HexPosition;
  unit: Unit;
  hoveredPosition: HexPosition | null;
  onHover: (position: HexPosition, hovering: boolean) => void,
  onClick: (position: HexPosition) => void;
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
