import {makePositionKey, Position} from "../../hexGridUtils";
import {GroupExpansionInfo, Unit} from "../../game";
import {useCallback, useState} from "react";
import {RBaseTile} from "./RBaseTile";
import {RUnit} from "./RUnit";

export interface RPreviewExpandGroupProps {
  groupExpansionInfos: GroupExpansionInfo[];
  onExpandGroup: (position: Position) => void;
}

export function RPreviewExpandGroup(props: RPreviewExpandGroupProps) {
  const {groupExpansionInfos, onExpandGroup} = props;

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
    {groupExpansionInfos.map(info => (
      <ExpandableTile
        key={makePositionKey(info.position)}
        groupExpansionInfo={info}
        hoveredPositions={hoveredPositions}
        onHover={onTileHover}
        onClick={onTileClick}
      />
    ))}
  </>;
}

interface ExpandableTileProps {
  groupExpansionInfo: GroupExpansionInfo,
  hoveredPositions: Position[] | null,
  onHover: (positions: Position[], hovering: boolean) => void,
  onClick: (position: Position) => void;
}

function ExpandableTile(props: ExpandableTileProps) {
  const {
    groupExpansionInfo, hoveredPositions, onHover: outerOnHover, onClick,
  } = props;

  const onHover = useCallback((_position: Position, hovering: boolean) => {
    outerOnHover(groupExpansionInfo.positions, hovering);
  }, [outerOnHover, groupExpansionInfo.positions]);

  return (
    <RBaseTile
      stroke={"transparent"}
      fill={"transparent"}
      position={groupExpansionInfo.position}
      content={(
        <RUnit
          unit={Unit.Pawn(groupExpansionInfo.colour, groupExpansionInfo.levelIndex)}
          preview={!hoveredPositions?.includes(groupExpansionInfo.position)}
        />
      )}
      onHover={onHover}
      onClick={onClick}
    />
  );
}
