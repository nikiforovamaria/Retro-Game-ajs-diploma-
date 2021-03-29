import Character from '../Character';

export default class Undead extends Character {
  constructor(level, type, health, attack = 40, defence = 10, distance = 4, attackDistance = 1) {
    super(level, 'Undead', health);
    this.attack = attack;
    this.defence = defence;
    this.distance = distance;
    this.attackDistance = attackDistance;
  }
}
