import {useCallback} from "react";
import {useAutoShortcut} from "../hooks";
import "./ActionSelector.css";

const UnitActions = [
  "place-pawn",
  "expand-pawn",
  "place-bishop",
  "place-rook",
] as const;
const Actions = [
  "place-piece",
  ...UnitActions,
] as const;
export type UnitAction = typeof UnitActions[number];
export type Action = typeof Actions[number];

export type ActionSelectorProps = {
  action: Action,
  allowPlacePiece: true,
  onChangeAction: (action: Action) => void,
} | {
  action: UnitAction,
  allowPlacePiece: false,
  onChangeAction: (action: UnitAction) => void,
}

const actionLabels: {[key in Action]: string} = {
  "place-pawn": "Place pawn",
  "expand-pawn": "Expand pawn",
  "place-bishop": "Place bishop",
  "place-rook": "Place rook",
  "place-piece": "Place piece",
};

export function ActionSelector(props: ActionSelectorProps) {
  const {action, allowPlacePiece, onChangeAction} = props;
  const actionList = allowPlacePiece ? Actions : UnitActions;
  // @ts-ignore
  const nextAction = actionList[(actionList.indexOf(action) + 1) % actionList.length];
  const rotateAction = useCallback(() => {
    // @ts-ignore
    onChangeAction(nextAction);
  }, [nextAction, onChangeAction]);
  useAutoShortcut(rotateAction, ["y"], "Cycle through actions", "Cycle through actions");
  return (
    <div className={"action-selector"}>
      {actionList.map((action) => (
        <label className={"action"} key={action}>
          <input
            type={"radio"}
            name={"action"}
            value={action}
            checked={props.action === action}
            onChange={() => {
              // @ts-ignore
              props.onChangeAction(action);
            }}
          />
          {" "}{actionLabels[action]}
          {nextAction === action ? ` [Y]` : ""}
        </label>
      ))}
    </div>
  );
}
