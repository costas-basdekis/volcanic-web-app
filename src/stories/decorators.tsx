import {AutoResizeSvg, RUnit} from "../components";
import {ReactRenderer} from "@storybook/react";
import {DecoratorFunction} from "@storybook/csf";
import {ShortcutProvider} from "react-keybind";

export const svgWrapper:  DecoratorFunction<ReactRenderer> = (Story) => {
  return (
    <ShortcutProvider>
      <AutoResizeSvg>
        <defs>
          {RUnit.Definitions}
        </defs>
        <Story/>
      </AutoResizeSvg>
    </ShortcutProvider>
  );
}
