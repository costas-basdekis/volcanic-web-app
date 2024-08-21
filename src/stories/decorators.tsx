import {AutoResizeSvg, RUnit} from "../components";
import {ReactRenderer} from "@storybook/react";
import {DecoratorFunction} from "@storybook/csf";
import React, {ReactNode, useState} from "react";
import {ShortcutProvider} from "react-keybind";

export const svgWrapper:  DecoratorFunction<ReactRenderer> = (Story) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tools, setTools] = useState<ReactNode>(null);
  return (
    <ShortcutProvider>
      <AutoResizeSvg>
        <defs>
          {RUnit.Definitions}
        </defs>
        <Story setTools={setTools} />
        <AutoResizeSvg.Tools>
          {tools}
        </AutoResizeSvg.Tools>
      </AutoResizeSvg>
    </ShortcutProvider>
  );
}
