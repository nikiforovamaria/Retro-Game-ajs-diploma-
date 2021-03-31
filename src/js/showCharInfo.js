// character info message

export default function showCharInfo(char) {
  return `${'\u{1F396}'} ${char.level} ${'\u{2694}'} ${char.attack}
     ${'\u{1F6E1}'} ${char.defence} ${'\u{2764}'} ${char.health}`;
}
