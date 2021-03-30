// available cells to move
export function getMovesCells(position, distance, boardSize) {
  const result = [];
  const itemRow = Math.floor(position / boardSize);
  const itemColumn = position % boardSize;

  for (let i = 1; i <= distance; i += 1) {
    if (itemColumn + i < 8) {
      result.push(itemRow * 8 + (itemColumn + i));
    }
    if (itemColumn - i >= 0) {
      result.push(itemRow * 8 + (itemColumn - i));
    }
    if (itemRow + i < 8) {
      result.push((itemRow + i) * 8 + itemColumn);
    }
    if (itemRow - i >= 0) {
      result.push((itemRow - i) * 8 + itemColumn);
    }
    if (itemRow + i < 8 && itemColumn + i < 8) {
      result.push((itemRow + i) * 8 + (itemColumn + i));
    }
    if (itemRow - i >= 0 && itemColumn - i >= 0) {
      result.push((itemRow - i) * 8 + (itemColumn - i));
    }
    if (itemRow + i < 8 && itemColumn - i >= 0) {
      result.push((itemRow + i) * 8 + (itemColumn - i));
    }
    if (itemRow - i >= 0 && itemColumn + i < 8) {
      result.push((itemRow - i) * 8 + (itemColumn + i));
    }
  }
  return result;
}

// available cells to attack
export function getAttackCells(position, distance, boardSize) {
  const result = [];
  const itemRow = Math.floor(position / boardSize);
  const itemColumn = position % boardSize;

  for (let i = 1; i <= distance; i += 1) {
    if (itemColumn + i < 8) {
      result.push(itemRow * 8 + (itemColumn + i));
    }
    if (itemColumn - i >= 0) {
      result.push(itemRow * 8 + (itemColumn - i));
    }
    if (itemRow + i < 8) {
      result.push((itemRow + i) * 8 + itemColumn);
    }
    if (itemRow - i >= 0) {
      result.push((itemRow - i) * 8 + itemColumn);
    }
    if (itemRow + i < 8 && itemColumn + i < 8) {
      result.push((itemRow + i) * 8 + (itemColumn + i));
    }
    if (itemRow - i >= 0 && itemColumn - i >= 0) {
      result.push((itemRow - i) * 8 + (itemColumn - i));
    }
    if (itemRow + i < 8 && itemColumn - i >= 0) {
      result.push((itemRow + i) * 8 + (itemColumn - i));
    }
    if (itemRow - i >= 0 && itemColumn + i < 8) {
      result.push((itemRow - i) * 8 + (itemColumn + i));
    }
  }
  return result;
}
