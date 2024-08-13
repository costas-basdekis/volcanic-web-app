import React, {Component, createRef} from 'react';
import {ReactSVGPanZoom, Tool, TOOL_AUTO, Value, ViewerMouseEvent} from 'react-svg-pan-zoom';
import ResizeObserver, {SizeInfo} from 'rc-resize-observer';
import './App.css';
import {Board, Tile} from "./game";
import {RBoard} from "./components";

interface AppState {
  tool: Tool,
  value: Partial<Value>,
  width:  number,
  height: number,
  firstResize: boolean,
  board: Board,
}

export default class App extends Component<{}, AppState> {
  state: AppState = {
    tool: TOOL_AUTO,
    value: {},
    width: 500,
    height: 500,
    firstResize: true,
    board: Board.makeEmpty().putPiece([
      new Tile({position: {x: 0, y: 0}, type: "volcano"}),
      new Tile({position: {x: -1, y: 1}, type: "white"}),
      new Tile({position: {x: 0, y: 1}, type: "black"}),
    ]),
  };
  svgPanZoomRef = createRef<ReactSVGPanZoom>();

  render() {
    const {tool, value, width, height, board} = this.state;
    return (
      <div className="App">
        <ResizeObserver onResize={this.onResize}>
          <header className="App-header">
            <ReactSVGPanZoom
              ref={this.svgPanZoomRef}
              width={width} height={height}
              tool={tool} onChangeTool={this.onChangeTool}
              value={value as Value} onChangeValue={this.onChangeValue}
              detectAutoPan={false}
              SVGBackground={"transparent"}
              onClick={this.onClick}
            >
              <svg width={width} height={height}>
                <RBoard board={board} />
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

  onClick = <T,>(event: ViewerMouseEvent<T>) => {
    console.log('click', event.x, event.y, event.originalEvent);
  };
}
