export default class GameState {
  static from(object) {
    // TODO: create object
    if (typeof object === 'object' && object !== null) {
      return object;
    }
    return null;
  }
}
