import Character from '../Character';

export default class Daemon extends Character {
  constructor(level, type, health, attack = 10, defence = 40, distance = 1, attackDistance = 4) {
    super(level, 'Daemon', health);
    this.attack = attack;
    this.defence = defence;
    this.distance = distance;
    this.attackDistance = attackDistance;
  }
}
