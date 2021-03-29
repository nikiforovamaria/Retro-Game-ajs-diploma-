export default class Character {
  constructor(level, type = 'generic', distance, attackDistance) {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.distance = distance;
    this.attackDistance = attackDistance;
    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('Character cannot be called with new');
    }
  }

  levelUp() {
    if (this.health > 0) {
      if (this.level < 4) {
        this.level += 1;
      }
      this.attack = Math.max(this.attack, this.attack * ((1.8 - this.health) / 100));
      this.defence = Math.max(this.defence, this.defence * ((1.8 - this.health) / 100));
      this.health = Math.min(this.health + 80, 100);
    }
  }
}
