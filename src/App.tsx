import React, {Component} from 'react';
import {ReactSVGPanZoom, Tool, TOOL_AUTO, Value, ViewerMouseEvent} from 'react-svg-pan-zoom';
import ResizeObserver, {SizeInfo} from 'rc-resize-observer';
import './App.css';
import {Tile} from "./Tile";

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
