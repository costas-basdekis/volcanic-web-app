import {useCallback, useState} from 'react';
import './App.css';
import {BlackOrWhite, Board, Piece} from "./game";
import {
  Action, ActionSelector,
  AutoResizeSvg,
  Credits,
  NextPieceDisplay,
  RBoard,
  RUnit, PlayerSelector, RPreview
} from "./components";

export default function App() {
  const [board, setBoard] = useState(() => Board.makeEmpty().placePiece(Piece.presets.WhiteBlack));
  const [nextPiece, setNextPiece] = useState(Piece.presets.BlackWhite);
  const [action, setAction] = useState<Action>("place-tile");
  const [colour, setColour] = useState<BlackOrWhite>("white");

  const onChangeNextPiece = useCallback((piece: Piece) => {
    setNextPiece(piece);
  }, []);
  const onChangeAction = useCallback((action: Action) => {
    setAction(action);
  }, []);

  return (
    <div className="App">
      <AutoResizeSvg>
        <defs>
          {RUnit.Definitions}
        </defs>
        <RBoard board={board}/>
        <RPreview
          board={board}
          nextPiece={nextPiece}
          action={action}
          colour={colour}
          onBoardChange={setBoard}
        />
        <AutoResizeSvg.Tools>
          <NextPieceDisplay onChangePiece={onChangeNextPiece} />
          <ActionSelector action={action} onChangeAction={onChangeAction} />
          <PlayerSelector onSetColour={setColour} />
          <Credits />
        </AutoResizeSvg.Tools>
      </AutoResizeSvg>
    </div>
  );
}

