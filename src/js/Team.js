import Bowman from './Characters/Bowman';
import Swordsman from './Characters/Swordsman';
import Magician from './Characters/Magician';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import Daemon from './Characters/Daemon';

export default class Team {
  constructor() {
    this.initialPlayerTeam = [Bowman, Swordsman];
    this.playerTeam = [Bowman, Swordsman, Magician];
    this.enemyTeam = [Undead, Vampire, Daemon];
  }
}
