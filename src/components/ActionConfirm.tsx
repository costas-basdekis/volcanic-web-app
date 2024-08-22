import "./ActionConfirm.css";

export type MoveStage = "move-start" | "move-middle" | "move-end";

export interface ActionConfirmProps {
  moveStage: MoveStage,
  onUndo: () => void,
  onConfirm: () => void,
}

export function ActionConfirm(props: ActionConfirmProps) {
  const {moveStage, onUndo, onConfirm} = props;
  return (
    <div className={"action-confirm"}>
      <button disabled={moveStage === "move-start"} onClick={onUndo}>Undo</button>
      <button disabled={moveStage !== "move-end"} onClick={onConfirm}>Confirm</button>
    </div>
  )
}
