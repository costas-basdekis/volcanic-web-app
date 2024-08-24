import "./RemainingPiecesAndUnitsDisplay.css";
import {RPiece} from "./game";
import {BlackOrWhite, Piece, playerNames, Unit} from "../game";
import {RUnit} from "./RUnit";
import {RemainingTiles, RemainingUnits} from "../game/Game";
import {Fragment} from "react";

export interface RemainingPiecesAndUnitsDisplayProps {
  currentPlayer: BlackOrWhite,
  remainingPieces: RemainingTiles,
  remainingUnits: RemainingUnits
}

export function RemainingPiecesAndUnitsDisplay(props: RemainingPiecesAndUnitsDisplayProps) {
  const {currentPlayer, remainingPieces, remainingUnits} = props;
  const playerStats = [
    ["white", remainingPieces.white, remainingUnits.white] as const,
    ["black", remainingPieces.black, remainingUnits.black] as const,
  ];
  return (
    <div className={"remaining-units-display"}>
      {playerNames[currentPlayer]} to play
      <br/>
      <svg width={120} height={120}>
        {playerStats.map(([colour, pieces, units], index) => (
          <Fragment key={index}>
            <g transform={`translate(${12 + index * 60}, 10)`}>
              <RPiece piece={Piece.presets.WhiteBlack} size={5}/>
              <text x={15} y={12} fill={colour}>x{pieces}</text>
            </g>
            <g transform={`translate(${12 + index * 60}, 40)`}>
              <RUnit unit={Unit.Pawn(colour, 1)} scale={0.3}/>
              <text x={15} y={7} fill={colour}>x{units.pawn}</text>
            </g>
            <g transform={`translate(${12 + index * 60}, 70)`}>
              <RUnit unit={Unit.Bishop(colour)} scale={0.3}/>
              <text x={15} y={7} fill={colour}>x{units.bishop}</text>
            </g>
            <g transform={`translate(${12 + index * 60}, 100)`}>
              <RUnit unit={Unit.Rook(colour)} scale={0.3}/>
              <text x={15} y={7} fill={colour}>x{units.rook}</text>
            </g>
          </Fragment>
        ))}
      </svg>
    </div>
  );
}
