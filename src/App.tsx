import React, {Component} from 'react';
import {
  ReactSVGPanZoom,
  TOOL_AUTO,
  Value, Tool, ViewerMouseEvent
} from 'react-svg-pan-zoom';
import ResizeObserver, {SizeInfo} from 'rc-resize-observer';
import './App.css';

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
                <g fillOpacity=".5" strokeWidth="4">
                  <rect x="400" y="40" width="100" height="200" fill="#4286f4" stroke="#f4f142"/>
                  <circle cx="108" cy="108.5" r="100" fill="#0ff" stroke="#0ff"/>
                  <circle cx="180" cy="209.5" r="100" fill="#ff0" stroke="#ff0"/>
                  <circle cx="220" cy="109.5" r="100" fill="#f0f" stroke="#f0f"/>
                </g>
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
