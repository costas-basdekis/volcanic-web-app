import {Piece} from "../../game";
import _ from "underscore";
import {useMemo} from "react";
import {getPieceOutline, pointsToPathD} from "../../graphics";

export interface RPieceOutlineProps {
  piece: Piece,
  levelIndex: number,
  size?: number,
}

const perLevelColours: string[] = [
  "transparent",
  "black",
  "purple",
  "brown",
  "orange",
  "silver",
];

const highLevelColour: string = "golden";

export function RPieceOutline(props: RPieceOutlineProps) {
  const {piece, size = 50, levelIndex} = props;
  const pieceOutline = useMemo(() => {
    return getPieceOutline(piece, size, size - (levelIndex - 1) * 5);
  }, [levelIndex, piece, size]);
  const uid = useMemo(() => {
    return Math.random();
  }, []);
  return <>
    <defs>
      <g id={`outline-${uid}-base`}>
        <path
          d={pointsToPathD(pieceOutline)}
        />
      </g>
      {_.range(2, levelIndex + 1).map(borderLevelIndex => (
        <mask key={borderLevelIndex} id={`outline-${uid}-mask-level-${borderLevelIndex}`}>
          <rect width={"100%"} height={"100%"} fill={"black"}/>
          <use xlinkHref={`#outline-${uid}-base`} strokeWidth={borderLevelIndex * 5} stroke={"white"} fill={"black"}/>
        </mask>
      ))}
    </defs>
    {_.range(levelIndex, 1, -1).map(borderLevelIndex => (
      <use
        key={borderLevelIndex}
        xlinkHref={`#outline-${uid}-base`}
        stroke={"transparent"}
        strokeWidth={borderLevelIndex * 5}
        fill={perLevelColours[levelIndex - borderLevelIndex + 1] ?? highLevelColour}
        mask={`url(#outline-${uid}-mask-level-${borderLevelIndex})`}
      />
    ))}
    <use
      xlinkHref={`#outline-${uid}-base`}
      stroke={perLevelColours[levelIndex] ?? highLevelColour}
      strokeWidth={3}
      fill={"transparent"}
    />
  </>;
}
