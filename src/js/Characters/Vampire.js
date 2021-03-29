import Character from '../Character';

export default class Vampire extends Character {
  constructor(level, type, health, attack = 25, defence = 25, distance = 2, attackDistance = 2) {
    super(level, 'Vampire', health);
    this.attack = attack;
    this.defence = defence;
    this.distance = distance;
    this.attackDistance = attackDistance;
  }
}
