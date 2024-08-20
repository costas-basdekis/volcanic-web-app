import {Piece} from "../game";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useAutoShortcut} from "../hooks";
import {RPiece} from "./game";
import "./NextPieceDisplay.css";

interface NextPieceDisplayProps {
  onChangePiece: (piece: Piece) => void,
}

const presets = [
  Piece.presets.BlackWhite,
  Piece.presets.WhiteBlack,
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
    onChangePiece(piece);
  }, [onChangePiece, piece]);

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

  const middlePoint = piece.getMiddlePosition(25);
  return (
    <div className={"next-piece-preview"}>
      <label>Next piece:</label>
      <br/>
      <svg width={100} height={100}>
        <g transform={`translate(${50 - middlePoint.x}, ${50 - middlePoint.y})`}>
          <RPiece piece={piece} size={25}/>
        </g>
      </svg>
      <br/>
      <button onClick={onCwClick}>CW [R]</button>
      <button onClick={onCcwClick}>CCW [T]</button>
      <br/>
      Press [E] to cycle through types
      <br/>
      <svg width={240} height={100}>
        {rotatedPresets.map((piece, index) => {
          const middlePoint = piece.getMiddlePosition(10);
          return (
            <g key={index} transform={`translate(${(30 + index * 60) - middlePoint.x}, ${30 - middlePoint.y})`}>
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
