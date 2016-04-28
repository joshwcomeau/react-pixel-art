import React, { Component, PropTypes } from 'react';

import { bindMethods } from '../utils/general';
import {
  scaleCanvas,
  getCursorPosition,
  matchCursorPosToCell,
  calculateCellSizing
} from '../utils/canvas';


export default class DrawingBoard extends Component {
  constructor(props) {
    super(props);

    // Bind methods that can be called from event handlers or iterators with
    // this component as the context.
    const methodsToBind = [
      'redraw', 'drawRow', 'moveHandler', 'clickHandler', 'contextMenuHandler'
    ];
    bindMethods(this, methodsToBind);
  }

  componentDidMount() {
    this.ctx = this._canvas.getContext('2d');

    scaleCanvas(this._canvas, this.ctx);

    calculateCellSizing(this.props.cells, this.props.width, this.props.height);

    this.redraw();
  }

  componentWillReceiveProps(nextProps) {
    calculateCellSizing(nextProps.cells, nextProps.width, nextProps.height);
  }

  /**
   * Paints a row's worth of cells to the board.
   * @param {array} rowCells - the array of cells to be painted
   * @param {number} rowIndex - an integer that will be used to calculate
   * vertical positioning.
   */
  drawRow(rowCells, rowIndex) {
    rowCells.forEach((cell, colIndex) => {
      // `cell` can either be null if it's a 'clear' cell, or a color value if
      // it's filled. Either way, we need to paint something.
      const x = this.colWidth * colIndex;
      const y = this.rowHeight * rowIndex;

      if (cell) {
        this.ctx.fillStyle = cell;
        this.ctx.fillRect(x, y, this.colWidth, this.rowHeight);
      } else {
        this.ctx.lineWidth = this.props.gridLineWidth;
        this.ctx.strokeStyle = this.props.gridLineColor;
      }
    });
  }

  /**
   * redraw() - our primary update method.
   * Called on mount and when cells change (via props).
   */
  redraw() {
    const { canvasBgColor, width, height } = this.props;

    // Reset the canvas. Either by a clear, or by filling with the BG color
    if (canvasBgColor) {
      this.ctx.fillStyle = canvasBgColor;
      this.ctx.fillRect(0, 0, width, height);
    } else {
      this.ctx.clearRect(0, 0, width, height);
    }

    // Draw a square for each cell passed to the props.
    // We need to
    this.props.cells.forEach(this.drawRow);
  }

  handleMouseEvent(event, eventType) {
    const [cursorX, cursorY] = getCursorPosition(event, this._canvas);
    const [x, y] = matchCursorPosToCell({
      cursorX,
      cursorY,
      colWidth: this._colWidth,
      rowHeight: this._rowHeight
    });
    // const { x, y, width, height } = getCellBoundingBox(event, {
    //   x: roundedX,
    //   y: roundedY,
    //   colWidth: this._colWidth,
    //   rowHeight: this._rowHeight
    // });
    //
    // const cellX = roundedX / this._colWidth;
    // const cellY = roundedY / this._rowHeight;

    this.props.onChange({ x, y }, eventType);

    // // If this is a duplicate action (painting a tile that is already that
    // // color), we want to avoid actually doing anything.
    // const currentVal = this.cells[cellX][cellY];
    // if ( mode === 'paint' && currentVal !== this.props.paintColor ) {
    //   this.cells[cellX][cellY] = this.props.paintColor;
    //   this.props.onPaint(this.cells);
    // } else if ( mode === 'erase' && !!currentVal ) {
    //   this.cells[cellX][cellY] = null;
    //   this.ctx.clearRect(x, y, width, height);
    //   this.props.onErase(this.cells);
    // }
    //
    // this.props.onChange(this.cells);
  }

  clickHandler(event) {
    this.handleMouseEvent(event, 'left-click');
  }

  contextMenuHandler(event) {
    // AKA. right click.
    event.preventDefault();
    this.handleMouseEvent(event, 'right-click');
  }

  highlightTile(event) {
    this.handleMouseEvent(event, 'hover');
  }

  moveHandler(event) {
    // Paint if left-click is held
    // Erase if right-click is held
    // Highlight if no button is held
    const buttonHeld = event.which || event.buttons;

    switch (buttonHeld) {
      case 1:
        this.handleMouseEvent(event, 'left-click');
        break;
      case 2:
        this.handleMouseEvent(event, 'right-click');
        break;
      default:
        this.handleMouseEvent(event, 'hover');
    }
  }


  render() {
    return (
      <canvas
        ref={ c => this._canvas = c }
        style={this.props.style}
        width={this.props.width}
        height={this.props.height}
        onClick={this.clickHandler}
        onMouseMove={this.moveHandler}
        onContextMenu={this.contextMenuHandler}
      />
    );
  }
}

DrawingBoard.propTypes = {
  cells:          PropTypes.array.isRequired,
  width:          PropTypes.number.isRequired,
  height:         PropTypes.number.isRequired,
  canvasBgColor:  PropTypes.string,
  gridLineColor:  PropTypes.string,
  gridLineWidth:  PropTypes.number,
  style:          PropTypes.object,
  onChange:       PropTypes.func
};

DrawingBoard.defaultProps = {
  rows: 16,
  cols: 32,
  width: 800,
  height: 400,
  gridLineColor: '#000000',
  gridLineWidth: 1,
  style: {},
  onChange() { /* no-op */}
};
