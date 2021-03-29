import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level, type, health, attack = 40, defence = 10, distance = 2, attackDistance = 2) {
    super(level, 'Swordsman', health);
    this.attack = attack;
    this.defence = defence;
    this.distance = distance;
    this.attackDistance = attackDistance;
  }
}
