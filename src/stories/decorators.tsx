import {AutoResizeSvg, RUnit} from "../components";
import {ReactRenderer} from "@storybook/react";
import {DecoratorFunction} from "@storybook/csf";

export const svgWrapper:  DecoratorFunction<ReactRenderer> = (Story) => (
  <AutoResizeSvg>
    <defs>
      {RUnit.Definitions}
    </defs>
    <Story />
  </AutoResizeSvg>
);
