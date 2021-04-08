import GameStateService from '../statefortest/GameStateService';
import GameState from '../statefortest/GameState';

jest.mock('../statefortest/GameState');
beforeEach(() => {
  jest.resetAllMocks();
});

test('should load state', () => {
  const expected = '{"point":10,"maxPoint":10,"level":1,"currentTheme":"prairie","userPositions":[]}';
  GameState.mockReturnValue(expected);
  const received = GameStateService.load();
  expect(JSON.stringify(received)).toEqual(expected);
});

test('should throw error', () => {
  const expected = '';
  GameState.mockReturnValue(expected);

  expect(() => GameStateService.load()).toThrow();
});
