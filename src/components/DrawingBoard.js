import React, { Component, PropTypes } from 'react';

import { scaleCanvas, getCursorPosition } from '../utils/canvas';


export default class DrawingBoard extends Component {
  static propTypes = {
    rows: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    canvasBgColor: PropTypes.string,
    gridLineColor: PropTypes.string,
    paintColor: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    rows: 16,
    cols: 32,
    width: 800,
    height: 400,
    paintColor: '#000000',
    gridLineColor: '#000000',
    style: {}
  }

  componentDidMount() {
    const { canvasBgColor, rows, cols, width, height } = this.props;

    const ctx = this._canvas.getContext('2d');

    scaleCanvas(this._canvas, ctx);

    if ( canvasBgColor ) {
      ctx.fillStyle = canvasBgColor;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = this.props.gridLineColor;


    // Draw our grid
    const rowHeight = height / rows;
    const colWidth = width / cols;
    for ( let r = 1; r < rows; r++ ) {
      ctx.beginPath();
      ctx.moveTo(0, r * rowHeight + .5);
      ctx.lineTo(width, r * rowHeight + .5);
      ctx.stroke();
    }


    for ( let c = 1; c < cols; c++ ) {
      ctx.beginPath();
      ctx.moveTo(c * colWidth + .5, .5);
      ctx.lineTo(c * colWidth + .5, height + .5);
      ctx.stroke();
    }

    this._ctx = ctx;
    this._rowHeight = rowHeight;
    this._colWidth  = colWidth;
  }

  paintOrEraseTile(event, mode) {
    const [ roughX, roughY ] = getCursorPosition(event, this._canvas);

    // Round down to the nearest X/Y cell.
    // We add 1 so that it doesn't overlap the grid lines.
    const roundedX = Math.floor(roughX / this._colWidth)  * this._colWidth;
    const roundedY = Math.floor(roughY / this._rowHeight) * this._rowHeight;

    // We want our tiles to be 1 pixel narrower/shorter than the width/height,
    // so that they don't overlap the grid lines. We also need to offset
    // their x/y coordinates by 1.
    const width   = this._colWidth - 1;
    const height  = this._rowHeight - 1;
    const x       = roundedX + 1;
    const y       = roundedY + 1;

    if ( mode === 'paint' ) {
      this._ctx.fillStyle = this.props.paintColor;
      this._ctx.fillRect(x, y, width, height);
    } else if ( mode === 'erase' ) {
      this._ctx.clearRect(x, y, width, height);
    }
  }

  clickHandler(event) {
    this.paintOrEraseTile(event, 'paint');
  }

  contextMenuHandler(event) {
    // AKA. right click.
    event.preventDefault();
    this.paintOrEraseTile(event, 'erase');
  }

  moveHandler(event) {
    // Only trigger if a mouse button is held down.
    const buttonHeld = event.which || event.buttons;

    switch ( buttonHeld ) {
      case 1:
        this.paintOrEraseTile(event, 'paint');
        break;
      case 2:
        this.paintOrEraseTile(event, 'erase')
        break;
      default:
        return false;
    }
  }


  render() {
    return (
      <canvas
        ref={ c => this._canvas = c}
        style={this.props.style}
        width={this.props.width}
        height={this.props.height}
        onClick={::this.clickHandler}
        onMouseMove={::this.moveHandler}
        onContextMenu={::this.contextMenuHandler}
      />
    );
  }

}
