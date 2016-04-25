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
