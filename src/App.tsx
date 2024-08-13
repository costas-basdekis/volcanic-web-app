import React, {Component} from 'react';
import {
  ReactSVGPanZoom,
  TOOL_AUTO,
  Value, Tool, ViewerMouseEvent
} from 'react-svg-pan-zoom';
import ResizeObserver, {SizeInfo} from 'rc-resize-observer';
import './App.css';
import _ from "underscore";

interface AppState {
  tool: Tool,
  value: Value | {},
  width:  number,
  height: number,
}

export default class App extends Component<{}, AppState> {
  state: AppState = {
    tool: TOOL_AUTO,
    value: {},
    width: 500,
    height: 500,
  };

  render() {
    const {tool, value, width, height} = this.state;
    return (
      <div className="App">
        <ResizeObserver onResize={this.onResize}>
          <header className="App-header">
            <ReactSVGPanZoom
              width={width} height={height}
              tool={tool} onChangeTool={this.onChangeTool}
              value={value as Value} onChangeValue={this.onChangeValue}
              detectAutoPan={false}
              onClick={this.onClick}
            >
              <svg width={617} height={316}>
                <Tile position={{x: 2, y: 2}} />
                <Tile position={{x: 3, y: 2}} />
                <Tile position={{x: 2, y: 1}} />
              </svg>
            </ReactSVGPanZoom>
          </header>
        </ResizeObserver>
      </div>
  )
    ;
  }

  onResize = ({width, height}: SizeInfo) => {
    this.setState(({width, height}));
  };

  onChangeTool = () => {
    // pass
  };

  onChangeValue = (value: Value) => {
    this.setState({value});
  };

  onClick = <T,>(event: ViewerMouseEvent<T>) => {
    console.log('click', event.x, event.y, event.originalEvent);
  };
}

export interface TileProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  position?: {x: number, y: number},
}

export class Tile extends Component<TileProps> {
  render () {
    const {
      stroke = "black", strokeWidth = 1, fill = "white",
      size = 100, position = {x: 0, y: 0},
    } = this.props;
    const evenRow = position.y % 2 === 0;
    const x = position.x + (evenRow ? 0 : 0.5);
    const y = position.y;
    return (
      <Hexagon
        stroke={stroke} strokeWidth={strokeWidth} fill={fill}
        size={size}
        position={{
          x: x * Math.sin(Math.PI / 3) * size * 2,
          y: y * Math.cos(Math.PI / 3) * size * 3,
        }}
      />
    )
  }
}

interface HexagonProps {
  stroke?: string,
  strokeWidth?: number,
  fill?: string,
  size?: number,
  position?: {x: number, y: number},
}

class Hexagon extends Component<HexagonProps> {
  static pathPoints: {x: number, y: number}[] = _.range(6)
    .map(index => ({x: Math.sin(index * Math.PI / 3), y: Math.cos(index * Math.PI / 3)}));
  static pathD = [
    `M${this.pathPoints[0].x} ${this.pathPoints[0].y}`,
    `L${this.pathPoints[1].x} ${this.pathPoints[1].y}`,
    `L${this.pathPoints[2].x} ${this.pathPoints[2].y}`,
    `L${this.pathPoints[3].x} ${this.pathPoints[3].y}`,
    `L${this.pathPoints[4].x} ${this.pathPoints[4].y}`,
    `L${this.pathPoints[5].x} ${this.pathPoints[5].y}`,
    `Z`,
  ].join(" ")

  render() {
    const {
      stroke = "black", strokeWidth = 1, fill = "white",
      size = 100, position = {x: 200, y: 200},
    } = this.props;
    return <>
      <path
        d={Hexagon.pathD}
        stroke={stroke} strokeWidth={strokeWidth}
        fill={fill}
        vectorEffect={"non-scaling-stroke"}
        style={{transform: `translate(${position.x}px, ${position.y}px) scale(${size})`}}
      />
    </>;
  }
}
