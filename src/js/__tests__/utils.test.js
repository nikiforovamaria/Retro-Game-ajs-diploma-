import calcTileType from '../utils';

test.each([
  [0, 8, 'top-left'],
  [1, 8, 'top'],
  [7, 8, 'top-right'],
  [8, 8, 'left'],
  [15, 8, 'right'],
  [56, 8, 'bottom-left'],
  [57, 8, 'bottom'],
  [63, 8, 'bottom-right'],
  [9, 8, 'center'],
  [0, 9, 'center'],
])(('should return tile type'), (index, boardSize, result) => {
  const received = calcTileType(index, boardSize);
  expect(received).toBe(result);
});
