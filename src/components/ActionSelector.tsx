import {useCallback} from "react";
import {useAutoShortcut} from "../hooks";
import "./ActionSelector.css";

const Actions = [
  "place-tile",
  "place-pawn",
  "expand-pawn",
  "place-bishop",
  "place-rook",
] as const;
export type Action = typeof Actions[number];

interface ActionSelectorProps {
  action: Action,
  onChangeAction: (action: Action) => void,
}

const actionLabels = [
  "Place tile",
  "Place pawn",
  "Expand pawn",
  "Place bishop",
  "Place rook",
];

export function ActionSelector(props: ActionSelectorProps) {
  const {action, onChangeAction} = props;
  const rotateAction = useCallback(() => {
    onChangeAction(Actions[(Actions.indexOf(action) + 1) % Actions.length]);
  }, [action, onChangeAction]);
  useAutoShortcut(rotateAction, ["y"], "Cycle through actions", "Cycle through actions");
  return (
    <div className={"action-selector"}>
      Press [Y] to cycle through actions
      <ul>
        {Actions.map((action, index) => (
          <li key={action}>
            <label>
              <input
                type={"radio"}
                name={"action"}
                value={action}
                checked={props.action === action}
                onChange={() => {
                  props.onChangeAction(action);
                }}
              />
              {" "}{actionLabels[index]}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
