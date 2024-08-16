import React, {useCallback, useRef, useState} from "react";
import ResizeObserver, {SizeInfo} from "rc-resize-observer";
import {ReactSVGPanZoom, Tool, TOOL_AUTO, Value, ViewerMouseEvent} from "react-svg-pan-zoom";
import "./AutoResizeSvg.css";

function AutoResizeSvgContent(props: {children: React.ReactNode}) {
  return <>{props.children}</>;
}

function AutoResizeSvgTools(props: {children: React.ReactNode}) {
  return <>{props.children}</>;
}

export interface AutoResizeSvgProps {
  children: React.ReactNode,
  onClick?: (<T,>(event: ViewerMouseEvent<T>) => void) | null | undefined,
}

export function AutoResizeSvg(props: AutoResizeSvgProps) {
  const [tool] = useState<Tool>(TOOL_AUTO);
  const [value, setValue] = useState<Partial<Value>>({});
  const [{width, height}, setSize] = useState<{width: number, height: number}>({width: 500, height: 500});
  const [firstResize, setFirstResize] = useState<boolean>(true);
  const svgPanZoomRef = useRef<ReactSVGPanZoom>(null);

  const onResize = useCallback(({width, height}: SizeInfo) => {
    setSize({width, height});
    if (firstResize && svgPanZoomRef.current) {
      setFirstResize(false);
      svgPanZoomRef.current.pan(width / 2, height / 2);
    }
  }, [firstResize]);
  const onChangeTool = useCallback(() => {
    // pass
  }, []);
  const onChangeValue = useCallback((value: Value) => {
    setValue(value);
  }, []);
  const children = React.Children.toArray(props.children);
  const isTool = (child: React.ReactNode) => (
    React.isValidElement(child)
    && (
      child.type === AutoResizeSvgTools
      // For hot reload
      || (
        typeof child.type === "function"
        && child.type.name === AutoResizeSvgTools.name
      )
    )
  );
  const content = children.filter(child => !isTool(child));
  const tools = children.filter(isTool);
  return (
    <ResizeObserver onResize={onResize}>
      <div className={"svg-container"}>
        <ReactSVGPanZoom
          ref={svgPanZoomRef}
          width={width} height={height}
          tool={tool} onChangeTool={onChangeTool}
          value={value as Value} onChangeValue={onChangeValue}
          detectAutoPan={false}
          SVGBackground={"transparent"}
          onClick={props.onClick ?? undefined}
        >
          <svg width={width} height={height}>
            {content}
          </svg>
        </ReactSVGPanZoom>
        {tools}
      </div>
    </ResizeObserver>
  );
}
AutoResizeSvg.Content = AutoResizeSvgContent;
AutoResizeSvg.Tools = AutoResizeSvgTools;
