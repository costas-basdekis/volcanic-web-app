import React, {Component, createRef} from "react";
import ResizeObserver, {SizeInfo} from "rc-resize-observer";
import {ReactSVGPanZoom, Tool, TOOL_AUTO, Value, ViewerMouseEvent} from "react-svg-pan-zoom";
import "./AutoResizeSvg.css";

class AutoResizeSvgContent extends Component<{ children: React.ReactNode }> {
  render() {
    return this.props.children;
  }
}

class AutoResizeSvgTools extends Component<{ children: React.ReactNode }> {
  render() {
    return this.props.children;
  }
}

export interface AutoResizeSvgProps {
  children: React.ReactNode,
  onClick?: (<T,>(event: ViewerMouseEvent<T>) => void) | null | undefined,
}

interface AutoResizeSvgState {
  tool: Tool,
  value: Partial<Value>,
  width:  number,
  height: number,
  firstResize: boolean,
}

export class AutoResizeSvg extends Component<AutoResizeSvgProps, AutoResizeSvgState> {
  static Content = AutoResizeSvgContent;
  static Tools = AutoResizeSvgTools;

  state: AutoResizeSvgState = {
    tool: TOOL_AUTO,
    value: {},
    width: 500,
    height: 500,
    firstResize: true,
  };
  svgPanZoomRef = createRef<ReactSVGPanZoom>();

  render() {
    const {tool, value, width, height} = this.state;
    const children = React.Children.toArray(this.props.children);
    const isTool = (child: React.ReactNode) => (
      React.isValidElement(child)
      && child.type === AutoResizeSvgTools
    );
    const content = children.filter(child => !isTool(child));
    const tools = children.filter(isTool);
    return (
      <ResizeObserver onResize={this.onResize}>
        <div className={"svg-container"}>
          <ReactSVGPanZoom
            ref={this.svgPanZoomRef}
            width={width} height={height}
            tool={tool} onChangeTool={this.onChangeTool}
            value={value as Value} onChangeValue={this.onChangeValue}
            detectAutoPan={false}
            SVGBackground={"transparent"}
            onClick={this.props.onClick ?? undefined}
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

  onResize = ({width, height}: SizeInfo) => {
    this.setState(({width, height}));
    if (this.state.firstResize && this.svgPanZoomRef.current) {
      this.setState({firstResize: false});
      this.svgPanZoomRef.current.pan(width / 2, height / 2);
    }
  };

  onChangeTool = () => {
    // pass
  };

  onChangeValue = (value: Value) => {
    this.setState({value});
  };
}
