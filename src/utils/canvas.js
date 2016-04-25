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

  if ( ratio > 1 ) {
    canvas.style.height = canvas.height + 'px';
    canvas.style.width  = canvas.width + 'px';
    canvas.width  *= ratio;
    canvas.height *= ratio;

    ctx.scale(ratio, ratio);
  }
}

export function getCursorPosition(event, canvas) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  return [ x, y ];
}

export function matchCursorPosToCell({ cursorX, cursorY, colWidth, rowHeight }) {
  const x = Math.floor(cursorX / colWidth)  * colWidth;
  const y = Math.floor(cursorY / rowHeight) * rowHeight;

  return [ x, y ];
}

export function getCellBoundingBox(event, { x, y, colWidth, rowHeight }) {
  // We want our tiles to be 1 pixel narrower/shorter than the width/height,
  // so that they don't overlap the grid lines. We also need to offset
  // their x/y coordinates by 1.
  return {
    width:    colWidth  - 1,
    height:   rowHeight - 1,
    x:        x + 1,
    y:        y + 1
  };
}
