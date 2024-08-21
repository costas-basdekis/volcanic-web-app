import {useCallback} from "react";

export function AutoGrabFocus() {
  const ref = useCallback(<E extends HTMLElement,>(element: E | null) => {
    element?.focus();
  }, []);
  return (
    <div ref={ref} tabIndex={-1}/>
  )
}
