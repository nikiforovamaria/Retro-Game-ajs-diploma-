import Bowman from './Characters/Bowman';
import Swordsman from './Characters/Swordsman';
import Daemon from './Characters/Daemon';
import Magician from './Characters/Magician';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';

export default class Team {
  static getStartUserTeam() {
    return [new Bowman(1), new Swordsman(1)];
  }

  static getUserTeam() {
    return [Bowman, Swordsman, Magician];
  }

  static getEnemyTeam() {
    return [Daemon, Undead, Vampire];
  }
}
