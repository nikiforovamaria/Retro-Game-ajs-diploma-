import Character from '../Character';
import Bowman from '../characters/Bowman';

test('1 - should give an error about new Character', () => {
  const result = 'Character cannot be called with new';
  expect(() => {
    const daemon = new Character();
    return daemon;
  }).toThrow(result);
});

test('2 - should not give an error about new Character', () => {
  const bowman = new Bowman();
  expect(bowman.defence).toBe(25);
});
