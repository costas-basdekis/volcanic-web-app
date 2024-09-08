import {GroupExpansionInfo, HexPosition, Unit} from "../../game";
import {useCallback, useState} from "react";
import {RBaseTile} from "./RBaseTile";
import {RUnit} from "./RUnit";

export interface RPreviewExpandGroupProps {
  groupExpansionInfos: GroupExpansionInfo[];
  onExpandGroup: (position: HexPosition) => void;
}

export function RPreviewExpandGroup(props: RPreviewExpandGroupProps) {
  const {groupExpansionInfos, onExpandGroup} = props;

  const [hoveredPositions, setHoveredPositions] = useState<HexPosition[] | null>(null);

  const onTileHover = useCallback((positions: HexPosition[], hovering: boolean) => {
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
  const onTileClick = useCallback((position: HexPosition) => {
    onExpandGroup(position);
  }, [onExpandGroup]);

  return <>
    {groupExpansionInfos.map(info => (
      <ExpandableTile
        key={info.position.key}
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
  hoveredPositions: HexPosition[] | null,
  onHover: (positions: HexPosition[], hovering: boolean) => void,
  onClick: (position: HexPosition) => void;
}

function ExpandableTile(props: ExpandableTileProps) {
  const {
    groupExpansionInfo, hoveredPositions, onHover: outerOnHover, onClick,
  } = props;

  const onHover = useCallback((_position: HexPosition, hovering: boolean) => {
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
