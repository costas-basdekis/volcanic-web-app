import "./ActionConfirm.css";
import {useAutoShortcut} from "../hooks";
import {useCallback} from "react";

export type MoveStage = "move-start" | "move-middle" | "move-end";

export interface ActionConfirmProps {
  moveStage: MoveStage,
  lastMoveCode: string | null,
  onMoveViaCode: (code: string) => void,
  onUndo: () => void,
  onConfirm: () => void,
}

export function ActionConfirm(props: ActionConfirmProps) {
  const {moveStage, lastMoveCode, onMoveViaCode, onUndo, onConfirm} = props;
  useAutoShortcut(onUndo, ["u"], "Undo move", "Undo part of a move");
  useAutoShortcut(onConfirm, ["c"], "Confirm move", "Confirm move and commit it");

  const onEnterMoveCodeClick = useCallback(() => {
    const moveCode = prompt("Enter move code");
    if (!moveCode) {
      return;
    }
    onMoveViaCode(moveCode);
  }, [onMoveViaCode]);

  return (
    <div className={"action-confirm"}>
      <button disabled={moveStage === "move-start"} onClick={onUndo}>Undo [U]</button>
      <button disabled={moveStage !== "move-end"} onClick={onConfirm}>Confirm [C]</button>
      <br/>
      Move code: {lastMoveCode ?? "N/A"}
      <br/>
      <button disabled={moveStage !== "move-start"} onClick={onEnterMoveCodeClick}>Enter move code</button>
    </div>
  );
}
