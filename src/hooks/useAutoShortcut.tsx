import {useShortcut} from "react-keybind";
import {useEffect} from "react";

export function useAutoShortcut(method: (e?: KeyboardEvent) => any, keys: string[], title: string, description: string, holdDuration?: number) {
  const {registerShortcut, unregisterShortcut} = useShortcut()!;
  useEffect(() => {
    registerShortcut(method, keys, title, description, holdDuration);
    return () => {
      unregisterShortcut(keys);
    };
  }, [registerShortcut, unregisterShortcut, method, [...keys].sort().join("|"), title, description, holdDuration]);
}
