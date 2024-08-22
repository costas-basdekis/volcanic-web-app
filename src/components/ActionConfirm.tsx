import "./ActionConfirm.css";
import {useAutoShortcut} from "../hooks";

export type MoveStage = "move-start" | "move-middle" | "move-end";

export interface ActionConfirmProps {
  moveStage: MoveStage,
  onUndo: () => void,
  onConfirm: () => void,
}

export function ActionConfirm(props: ActionConfirmProps) {
  const {moveStage, onUndo, onConfirm} = props;
  useAutoShortcut(onUndo, ["u"], "Undo move", "Undo part of a move");
  useAutoShortcut(onConfirm, ["c"], "Confirm move", "Confirm move and commit it");
  return (
    <div className={"action-confirm"}>
      <button disabled={moveStage === "move-start"} onClick={onUndo}>Undo [U]</button>
      <button disabled={moveStage !== "move-end"} onClick={onConfirm}>Confirm [C]</button>
    </div>
  )
}
