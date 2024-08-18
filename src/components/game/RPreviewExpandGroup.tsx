import {makePositionKey, Position} from "../../hexGridUtils";
import {BlackOrWhite, Unit} from "../../game";
import {useCallback, useState} from "react";
import {RBaseTile} from "./RBaseTile";
import {RUnit} from "../RUnit";

export interface RPreviewExpandGroupProps {
  colour: BlackOrWhite;
  groupExpandablePositionsPositionsAndLevelIndexes: [Position, Position[], number][];
  onExpandGroup: (position: Position) => void;
}

export function RPreviewExpandGroup(props: RPreviewExpandGroupProps) {
  const {colour, groupExpandablePositionsPositionsAndLevelIndexes, onExpandGroup} = props;

  const [hoveredPositions, setHoveredPositions] = useState<Position[] | null>(null);

  const onTileHover = useCallback((positions: Position[], hovering: boolean) => {
    setHoveredPositions(hoveredPositions => {
      if (hovering) {
        return positions;
      } else {
        if (hoveredPositions !== positions) {
          return hoveredPositions;
        }
        return null;
      }
    });
  }, []);
  const onTileClick = useCallback((position: Position) => {
    onExpandGroup(position);
  }, [onExpandGroup]);

  return <>
    {groupExpandablePositionsPositionsAndLevelIndexes.map(([position, positions, levelIndex]) => (
      <ExpandableTile
        key={makePositionKey(position)}
        position={position}
        positions={positions}
        hoveredPositions={hoveredPositions}
        unit={Unit.Pawn(colour, levelIndex)}
        onHover={onTileHover}
        onClick={onTileClick}
      />
    ))}
  </>;
}

interface ExpandableTileProps {
  position: Position;
  positions: Position[];
  unit: Unit;
  hoveredPositions: Position[] | null;
  onHover: (positions: Position[], hovering: boolean) => void,
  onClick: (position: Position) => void;
}

function ExpandableTile(props: ExpandableTileProps) {
  const {
    position, positions, hoveredPositions,
    unit, onHover: outerOnHover, onClick,
  } = props;

  const onHover = useCallback((_position: Position, hovering: boolean) => {
    outerOnHover(positions, hovering);
  }, [outerOnHover, positions]);

  return (
    <RBaseTile
      stroke={"transparent"}
      fill={"transparent"}
      position={position}
      content={<RUnit unit={unit} preview={!hoveredPositions?.includes(position)} />}
      onHover={onHover}
      onClick={onClick}
    />
  );
}
