// calculating random position

function randomPosition(columnEnemy = 0) {
  return (Math.floor(Math.random() * 8) * 8) + ((Math.floor(Math.random() * 2) + columnEnemy));
}

export default function getPositions(length) {
  const position = {
    player: [],
    enemy: [],
  };
  let random;
  for (let i = 0; i < length; i += 1) {
    do {
      random = randomPosition();
    } while (position.player.includes(random));
    position.player.push(random);
    do {
      random = randomPosition(6);
    } while (position.enemy.includes(random));
    position.enemy.push(random);
  }
  return position;
}
