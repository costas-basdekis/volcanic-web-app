import {Piece, PiecePreset, piecePresets} from "../game";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useAutoShortcut} from "../hooks";
import {RPiece} from "./game";
import "./NextPieceDisplay.css";

interface NextPieceDisplayProps {
  onChangePiece: (piece: Piece, piecePreset: PiecePreset, pieceRotation: number) => void,
}

const presets = [
  Piece.presets.WhiteBlack,
  Piece.presets.BlackWhite,
  Piece.presets.WhiteWhite,
  Piece.presets.BlackBlack,
];
export function NextPieceDisplay(props: NextPieceDisplayProps) {
  const {onChangePiece} = props;

  const [presetIndex, setPresetIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const rotatedPresets = useMemo(() => {
    return presets.map(piece => piece.rotate(rotation));
  }, [rotation]);
  const piece = useMemo(() => {
    return rotatedPresets[presetIndex];
  }, [presetIndex, rotatedPresets]);
  useEffect(() => {
    onChangePiece(piece, piecePresets[presetIndex], rotation);
  }, [onChangePiece, piece, presetIndex, rotation]);

  const onCwClick = useCallback(() => {
    setRotation(rotation => (rotation + 1) % 6);
  }, []);
  const onCcwClick = useCallback(() => {
    setRotation(rotation => (rotation - 1 + 6) % 6);
  }, []);
  const onPresetClick = useCallback((index: number) => {
    setPresetIndex(index);
  }, []);
  const onPresetRotate = useCallback(() => {
    setPresetIndex(index => (index + 1) % presets.length);
  }, []);

  useAutoShortcut(onCwClick, ['r'], 'Rotate next piece CW', 'Rotate the next piece clockwise');
  useAutoShortcut(onCcwClick, ['t'], 'Rotate next piece CCW', 'Rotate the next piece counter-clockwise');
  useAutoShortcut(onPresetRotate, ['e'], 'Cycle through piece types', 'Cycle through piece types');

  return (
    <div className={"next-piece-preview"}>
      <button onClick={onCcwClick}>[T]</button>
      Rotate
      <button onClick={onCwClick}>[R]</button>
      <br/>
      [E] to choose next
      <br/>
      <svg width={120} height={120}>
        {rotatedPresets.map((piece, index) => {
          const middlePoint = piece.getMiddlePosition(10);
          return (
            <g key={index}
               transform={`translate(${30 + (index % 2) * 60 - middlePoint.x}, ${30 + Math.floor(index / 2) * 60 - middlePoint.y})`}>
              <rect
                x={middlePoint.x - 25} y={middlePoint.y - 27}
                width={50} height={50}
                stroke={presetIndex === index ? "black" : "transparent"}
                fill={presetIndex === index ? "white" : "transparent"}
                strokeWidth={3}
                onClick={() => onPresetClick(index)}
              />
              <g style={{pointerEvents: "none"}}>
                <RPiece piece={piece} size={10}/>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
