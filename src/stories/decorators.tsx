import {AutoResizeSvg} from "../components";
import {ReactRenderer} from "@storybook/react";
import {DecoratorFunction} from "@storybook/csf";

export const svgWrapper:  DecoratorFunction<ReactRenderer> = (Story) => (
  <AutoResizeSvg>
    <Story />
  </AutoResizeSvg>
);
