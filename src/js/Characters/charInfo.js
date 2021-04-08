const icons = {
  level: '\u{1F396}',
  attack: '\u{2694}',
  defence: '\u{1F6E1}',
  health: '\u{2764}',
};

export default function getCharInfo(character) {
  const charInfo = `${icons.level}${character.level} ${icons.attack}${character.attack} ${icons.defence}${character.defence} ${icons.health}${character.health}`;
  return charInfo;
}
