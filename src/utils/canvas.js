// Figure out our backing scale.
// This ensures canvas looks crisp on retina displays, where there are
// in fact 4 on-screen pixels for every 1 calculated pixel.
export function scaleCanvas(canvas, ctx) {
  const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;

  const ratio = (window.devicePixelRatio || 1) / backingStoreRatio;

  if (ratio > 1) {
    /* eslint-disable no-param-reassign */
    canvas.style.height = canvas.height + 'px';
    canvas.style.width = canvas.width + 'px';
    canvas.width *= ratio;
    canvas.height *= ratio;
    /* eslint-enable */

    ctx.scale(ratio, ratio);
  }
}

export function getCursorPosition(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x, y];
}

export function matchCursorPosToCell({ cursorX, cursorY, colWidth, rowHeight }) {
  const x = Math.floor(cursorX / colWidth);
  const y = Math.floor(cursorY / rowHeight);

  return [x, y];
}

export function getCellBoundingBox(event, { x, y, colWidth, rowHeight }) {
  // We want our tiles to be 1 pixel narrower/shorter than the width/height,
  // so that they don't overlap the grid lines. We also need to offset
  // their x/y coordinates by 1.
  return {
    width:    colWidth - 1,
    height:   rowHeight - 1,
    x:        x + 1,
    y:        y + 1
  };
}

/**
 * Calculates the width of each column and the height of each row, based on
 * the board width/height provided, and the number of cells per column/row.
 * @param {array} cells - a 2D array of cells
 * @param {number} width - the total width of the board
 * @param {number} height - the total height of the board
 */
export function calculateCellSizing({ cells, width, height }) {
  const firstRow = cells[0];

  // If we've supplied a 1D array, we need to throw an error.
  // This component requires a 2D grid of cells to function.
  if ( !Array.isArray(firstRow) ) { // eslint-disable-line
    throw new Error(`
      DrawingBoard requires a 2-dimensional array of cells.
      It appears you provided an array containing non-arrays:
      ${cells}
    `);
  }

  const numOfRows = cells.length;
  const numOfCols = firstRow && firstRow.length;

  const rowHeight = height / numOfRows;
  const colWidth = width / numOfCols;

  return [rowHeight, colWidth];
}
