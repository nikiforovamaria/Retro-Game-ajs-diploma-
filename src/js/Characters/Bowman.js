import Character from '../Character';

export default class Bowman extends Character {
  constructor(level, type, health, attack = 25, defence = 25, distance = 4, attackDistance = 1) {
    super(level, 'Bowman', health);
    this.attack = attack;
    this.defence = defence;
    this.distance = distance;
    this.attackDistance = attackDistance;
  }
}
