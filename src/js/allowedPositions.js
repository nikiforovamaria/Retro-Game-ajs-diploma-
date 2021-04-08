export default function allowedPositions(position, distance, boardSize) {
  const allowedPositionsArray = [];
  const itemRow = Math.floor(position / boardSize);
  const itemColumn = position % boardSize;

  for (let i = 1; i <= distance; i += 1) {
    if ((itemColumn + i) < 8) {
      allowedPositionsArray.push((itemRow * 8) + (itemColumn + i));
    }
    if ((itemColumn - i) >= 0) {
      allowedPositionsArray.push((itemRow * 8) + (itemColumn - i));
    }
    if ((itemRow + i) < 8) {
      allowedPositionsArray.push(((itemRow + i) * 8) + itemColumn);
    }
    if ((itemRow - i) >= 0) {
      allowedPositionsArray.push(((itemRow - i) * 8) + itemColumn);
    }
    if ((itemRow + i) < 8 && (itemColumn + i) < 8) {
      allowedPositionsArray.push(((itemRow + i) * 8) + (itemColumn + i));
    }
    if ((itemRow - i) >= 0 && (itemColumn - i) >= 0) {
      allowedPositionsArray.push(((itemRow - i) * 8) + (itemColumn - i));
    }
    if ((itemRow + i) < 8 && (itemColumn - i) >= 0) {
      allowedPositionsArray.push(((itemRow + i) * 8) + (itemColumn - i));
    }
    if ((itemRow - i) >= 0 && (itemColumn + i) < 8) {
      allowedPositionsArray.push(((itemRow - i) * 8) + (itemColumn + i));
    }
  }
  return allowedPositionsArray;
}
