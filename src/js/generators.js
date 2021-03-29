/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const type = Math.round(Math.random() * allowedTypes.length);
  const level = Math.floor((Math.random() * maxLevel) + 1);
  yield new allowedTypes[type](level);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  let count = 0;
  const team = [];
  while (count < characterCount) {
    team.push(characterGenerator(allowedTypes, maxLevel).next().value);
    count += 1;
  }
  return team;
}
