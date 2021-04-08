import getCharInfo from '../Characters/charInfo';
import Bowman from '../Characters/Bowman';

test('should return info about character with icons', () => {
  const bowman = new Bowman(1);
  const received = getCharInfo(bowman);
  const expected = `${'\u{1F396}'}1 ${'\u{2694}'}25 ${'\u{1F6E1}'}25 ${'\u{2764}'}50`;

  expect(received).toBe(expected);
});
