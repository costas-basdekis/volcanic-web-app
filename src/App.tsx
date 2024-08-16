import {useCallback, useState} from 'react';
import './App.css';
import {Board, Piece} from "./game";
import {AutoResizeSvg, RBaseTile, RBoard} from "./components";
import {makePositionKey, Position} from "./hexGridUtils";
import {RPiece} from "./components/game/RPiece";

export default function App() {
  const [board, setBoard] = useState(() => Board.makeEmpty().placePiece(Piece.presets.WhiteBlack));
  const [nextPiece, setNextPiece] = useState(Piece.presets.BlackWhite);
  const [hoveredPosition, setHoveredPosition] = useState<Position | null>(null);

  const onClick = useCallback((position: Position) => {
    setBoard(board => board.placePieceAt(nextPiece, position));
  }, [nextPiece]);
  const onChangeNextPiece = useCallback((piece: Piece) => {
    setNextPiece(piece);
  }, []);
  const onBackgroundHoverMouseEnter = useCallback(() => {
    setHoveredPosition(null);
  }, []);
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

  const placeablePositions = board.levels.get(1)!.getPlaceablePositionsForPiece(nextPiece);
  return (
    <div className="App">
      <AutoResizeSvg>
        <RBoard board={board}/>
        {placeablePositions.map(position => (
          <PlaceableTile
            key={makePositionKey(position)}
            position={position}
          />
        ))}
        {hoveredPosition ? (
          <RPiece piece={nextPiece.moveFirstTileTo(hoveredPosition)} />
        ) : null}
        <rect
          x={-10000} y={-10000}
          width={20000} height={20000}
          stroke={"transparent"}
          fill={"transparent"}
          onMouseEnter={onBackgroundHoverMouseEnter}
        />
        {placeablePositions.map(position => (
          <HoverTile
            key={makePositionKey(position)}
            position={position}
            onHover={onTileHover}
            onClick={onClick}
          />
        ))}
        <AutoResizeSvg.Tools>
          <NextPieceDisplay piece={nextPiece} onChangePiece={onChangeNextPiece} />
        </AutoResizeSvg.Tools>
      </AutoResizeSvg>
    </div>
  );
}

interface HoverTileProps {
  position: Position,
  onHover?: ((position: Position, hovering: boolean) => void) | undefined | null,
  onClick?: ((position: Position) => void) | undefined | null,
}

function HoverTile(props: HoverTileProps) {
  const {position} = props;
  return (
    <RBaseTile
      key={makePositionKey(position)}
      stroke={"transparent"}
      fill={"transparent"}
      position={position}
      onHover={props.onHover}
      onClick={props.onClick}
    />
  );
}

interface PlaceableTileProps {
  position: Position,
  onClick?: ((position: Position) => void) | null | undefined,
}

function PlaceableTile(props: PlaceableTileProps) {
  const {onClick: outerOnClick, position} = props;

  const onClick = useCallback(() => {
    outerOnClick?.(position);
  }, [outerOnClick, position]);

  return (
    <RBaseTile
      key={makePositionKey(position)}
      fill={"green"}
      position={position}
      onClick={outerOnClick ? onClick : undefined}
    />
  );
}

interface NextPieceDisplayProps {
  piece: Piece,
  onChangePiece: (piece: Piece) => void,
}

function NextPieceDisplay(props: NextPieceDisplayProps) {
  const {piece, onChangePiece} = props;

  const onCwClick = useCallback(() => {
    onChangePiece(piece.rotate(1));
  }, [onChangePiece, piece]);
  const onCcwClick = useCallback(() => {
    onChangePiece(piece.rotate(-1));
  }, [onChangePiece, piece]);

  const middlePoint = piece.getMiddlePosition(25);
  return (
    <div className={"next-piece-preview"}>
      <label>Next piece:</label>
      <br/>
      <svg width={100} height={100}>
        <g transform={`translate(${50 - middlePoint.x}, ${50 - middlePoint.y})`}>
          <RPiece piece={piece} size={25} />
        </g>
      </svg>
      <br/>
      <button onClick={onCwClick}>CW</button>
      <button onClick={onCcwClick}>CCW</button>
    </div>
  );
}
