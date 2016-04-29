export function bindMethods(context, methods) {
  methods.forEach(method => {
    // eslint-disable-next-line no-param-reassign
    context[method] = context[method].bind(context);
  });
}

export function generateGrid(cols, rows) {
  return Array(rows).fill(null).map(() => Array(cols).fill(null));
}

export function modifyCell(cells, { x, y, newValue }) {
  // TODO: Support immutable.js as well.

  // Create a new copy of the cells. Preserve immutability to avoid wonkiness.
  const newCells = cells.slice();

  newCells[y][x] = newValue;

  return newCells;
}
