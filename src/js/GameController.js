/* eslint-disable class-methods-use-this */
import themes from './themes';
import Team from './Team';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import getCharInfo from './Characters/charInfo';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';
import allowedPositions from './allowedPositions';

let userPositions = [];
let enemyPositions = [];
let selectedCharacterIndex = 0;
let allowDistance;
let allowDistanceAttack;
let allowPosition;
let boardSize;

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.currentMove = 'user';
    this.selectedCharacter = {};
    this.selected = false;
    this.point = 0;
    this.level = 1;
    this.currentTheme = themes.prairie;
    this.blockedBoard = false;
    this.userTeam = [];
    this.enemyTeam = [];
    this.index = 0;
  }

  init() {
    this.events();
    this.nextLevel();
  }

  events() {
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  nextLevel() {
    this.currentMove = 'user';
    if (this.level === 1) {
      this.userTeam = Team.getStartUserTeam();
      this.enemyTeam = generateTeam(Team.getEnemyTeam(), 1, 2);
      this.addPositionCharacter(this.userTeam, this.enemyTeam);
    } else if (this.level === 2) {
      this.currentTheme = themes.desert;
      this.userTeam = generateTeam(Team.getUserTeam(), 1, 1);
      this.enemyTeam = generateTeam(
        Team.getEnemyTeam(), 2, (this.userTeam.length + userPositions.length),
      );
      this.addPositionCharacter(this.userTeam, this.enemyTeam);
    } else if (this.level === 3) {
      this.currentTheme = themes.arctic;
      this.userTeam = generateTeam(Team.getUserTeam(), 2, 2);
      this.enemyTeam = generateTeam(
        Team.getEnemyTeam(), 3, (this.userTeam.length + userPositions.length),
      );
      this.addPositionCharacter(this.userTeam, this.enemyTeam);
    } else if (this.level === 4) {
      this.currentTheme = themes.mountain;
      this.userTeam = generateTeam(Team.getUserTeam(), 3, 2);
      this.enemyTeam = generateTeam(
        Team.getEnemyTeam(), 4, (this.userTeam.length + userPositions.length),
      );
      this.addPositionCharacter(this.userTeam, this.enemyTeam);
    } else {
      this.blockedBoard = true;
      GamePlay.showMessage(`Your score ${this.point}. Best score: ${this.maxPoints()}.`);
      return;
    }

    const characterPositions = this.getPositions(userPositions.length);
    for (let i = 0; i < userPositions.length; i += 1) {
      userPositions[i].position = characterPositions.user[i];
      enemyPositions[i].position = characterPositions.enemy[i];
    }

    this.gamePlay.drawUi(this.currentTheme);
    this.gamePlay.redrawPositions([...userPositions, ...enemyPositions]);
  }

  newGame() {
    this.blockedBoard = false;
    const maxPoint = this.maxPoints();
    const currentGameState = this.stateService.load();
    if (currentGameState) {
      currentGameState.maxPoint = maxPoint;
      this.stateService.save(GameState.from(currentGameState));
    }
    userPositions = [];
    enemyPositions = [];
    this.level = 1;
    this.point = 0;
    this.currentTheme = themes.prairie;
    this.nextLevel();
    GamePlay.showMessage('New Game Begins!');
  }

  saveGame() {
    const maxPoint = this.maxPoints();
    const currentGameState = {
      point: this.point,
      maxPoint,
      level: this.level,
      currentTheme: this.currentTheme,
      userPositions,
      enemyPositions,
    };
    this.stateService.save(GameState.from(currentGameState));
    GamePlay.showMessage('Game Saved!');
  }

  loadGame() {
    try {
      const loadGameState = this.stateService.load();
      if (loadGameState) {
        this.point = loadGameState.point;
        this.level = loadGameState.level;
        this.currentTheme = loadGameState.currentTheme;
        userPositions = loadGameState.userPositions;
        enemyPositions = loadGameState.enemyPositions;
        this.gamePlay.drawUi(this.currentTheme);
        this.gamePlay.redrawPositions([...userPositions, ...enemyPositions]);
      }
      GamePlay.showMessage('Game loaded!');
    } catch (e) {
      console.log(e);
      GamePlay.showError('Loading failed!');
      this.newGame();
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.index = index;
    if (!this.blockedBoard) {
      for (const item of [...userPositions, ...enemyPositions]) {
        if (item.position === index) {
          this.gamePlay.showCellTooltip(getCharInfo(item.character), index);
        }
      }

      if (this.selected) {
        allowPosition = this.selectedCharacter.position;
        allowDistance = this.selectedCharacter.character.distance;
        boardSize = this.gamePlay.boardSize;

        const allowPositions = allowedPositions(allowPosition, allowDistance, boardSize);

        allowDistanceAttack = this.selectedCharacter.character.distanceAttack;
        const allowAttack = allowedPositions(allowPosition, allowDistanceAttack, boardSize);

        if (this.getIndex(userPositions) !== -1) {
          this.gamePlay.setCursor(cursors.pointer);
        } else if (allowPositions.includes(index)
          && this.getIndex([...userPositions, ...enemyPositions]) === -1) {
          this.gamePlay.selectCell(index, 'green');
          this.gamePlay.setCursor(cursors.pointer);
        } else if (allowAttack.includes(index) && this.getIndex(enemyPositions) !== -1) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.selectedCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  async onCellClick(index) {
    this.index = index;
    // TODO: react to click
    if (!this.blockedBoard) {
      if (this.gamePlay.boardEl.style.cursor === 'not-allowed') {
        GamePlay.showError('invalid action');
      } else if (this.getIndex([...userPositions]) !== -1) {
        this.gamePlay.deselectCell(selectedCharacterIndex);
        this.gamePlay.selectCell(index);
        selectedCharacterIndex = index;
        this.selectedCharacter = [...userPositions].find((item) => item.position === index);
        this.selected = true;
      } else if (!this.selected && this.getIndex([...enemyPositions]) !== -1) {
        GamePlay.showError('Cannot choose this character!');
      } else if (this.selected && this.gamePlay.boardEl.style.cursor === 'pointer') {
        this.selectedCharacter.position = index;
        this.gamePlay.deselectCell(selectedCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.selected = false;
        this.gamePlay.redrawPositions([...userPositions, ...enemyPositions]);
        this.currentMove = 'enemy';
        this.enemyStrategy();
      } else if (this.selected && this.gamePlay.boardEl.style.cursor === 'crosshair') {
        const thisAttackEnemy = [...enemyPositions].find((item) => item.position === index);
        this.gamePlay.deselectCell(selectedCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor(cursors.auto);
        this.selected = false;
        await this.characterAttacker(this.selectedCharacter.character, thisAttackEnemy);
        if (enemyPositions.length > 0) {
          this.enemyStrategy();
        }
      }
    }
  }

  getIndex(arr) {
    return arr.findIndex((item) => item.position === this.index);
  }

  maxPoints() {
    let maxPoint = 0;
    try {
      const loadGameState = this.stateService.load();
      if (loadGameState) {
        maxPoint = Math.max(loadGameState.maxPoint, this.point);
      }
    } catch (e) {
      maxPoint = this.point;
      console.log(e);
    }
    return maxPoint;
  }

  getPositions(length) {
    const position = { user: [], enemy: [] };
    let random;
    for (let i = 0; i < length; i += 1) {
      do {
        random = this.randomPosition();
      } while (position.user.includes(random));
      position.user.push(random);

      do {
        random = this.randomPosition(6);
      } while (position.enemy.includes(random));
      position.enemy.push(random);
    }
    return position;
  }

  randomPosition(columnEnemy = 0) {
    return (Math.floor(Math.random() * 8) * 8) + ((Math.floor(Math.random() * 2) + columnEnemy));
  }

  levelUp() {
    for (const item of userPositions) {
      const current = item.character;
      current.level += 1;
      current.attack = this.attackAndDefenceLevelUp(current.attack, current.health);
      current.defence = this.attackAndDefenceLevelUp(current.defence, current.health);
      current.health = (current.health + 80) < 100 ? current.health + 80 : 100;
    }
  }

  attackAndDefenceLevelUp(attackBefore, life) {
    return Math.floor(Math.max(attackBefore, attackBefore * (1.8 - life / 100)));
  }

  addPositionCharacter(userTeam, enemyTeam) {
    for (let i = 0; i < userTeam.length; i += 1) {
      userPositions.push(new PositionedCharacter(userTeam[i], 0));
    }
    for (let i = 0; i < enemyTeam.length; i += 1) {
      enemyPositions.push(new PositionedCharacter(enemyTeam[i], 0));
    }
  }

  async characterAttacker(attacker, target) {
    const targetedCharacter = target.character;
    let damage = Math.max(attacker.attack - targetedCharacter.defence, attacker.attack * 0.1);
    damage = Math.floor(damage);
    await this.gamePlay.showDamage(target.position, damage);
    targetedCharacter.health -= damage;
    this.currentMove = this.currentMove === 'enemy' ? 'user' : 'enemy';
    if (targetedCharacter.health <= 0) {
      userPositions = userPositions.filter((item) => item.position !== target.position);
      enemyPositions = enemyPositions.filter((item) => item.position !== target.position);
      if (userPositions.length === 0) {
        GamePlay.showMessage('Game over');
        this.blockedBoard = true;
      }
      if (enemyPositions.length === 0) {
        for (const item of userPositions) {
          this.point += item.character.health;
        }
        this.levelUp();
        this.level += 1;
        this.nextLevel();
      }
    }
    this.gamePlay.redrawPositions([...userPositions, ...enemyPositions]);
  }

  async enemyAttacks(character, target) {
    await this.characterAttacker(character, target);
    this.currentMove = 'user';
  }

  enemyStrategy() {
    if (this.currentMove === 'enemy') {
      for (const enemy of [...enemyPositions]) {
        allowDistanceAttack = this.selectedCharacter.character.distanceAttack;
        allowPosition = enemy.position;
        boardSize = this.gamePlay.boardSize;
        const allowAttack = allowedPositions(allowPosition, allowDistanceAttack, boardSize);
        const target = this.enemyAttack(allowAttack);
        if (target !== null) {
          this.enemyAttacks(enemy.character, target);
          return;
        }
      }
      const randomIndex = Math.floor(Math.random() * [...enemyPositions].length);
      const randomEnemy = [...enemyPositions][randomIndex];
      this.enemyMove(randomEnemy);
      this.gamePlay.redrawPositions([...userPositions, ...enemyPositions]);
      this.currentMove = 'user';
    }
  }

  enemyMove(itemEnemy) {
    const currentEnemyCharacter = itemEnemy;
    const itemEnemyDistance = itemEnemy.character.distance;
    let tempPRow;
    let tempPCOlumn;
    let stepRow;
    let stepColumn;
    let Steps;
    const itemEnemyRow = this.positionRow(currentEnemyCharacter.position);
    const itemEnemyColumn = this.positionColumn(currentEnemyCharacter.position);
    let nearUser = {};

    for (const itemUser of [...userPositions]) {
      const itemUserRow = this.positionRow(itemUser.position);
      const itemUserColumn = this.positionColumn(itemUser.position);
      stepRow = itemEnemyRow - itemUserRow;
      stepColumn = itemEnemyColumn - itemUserColumn;
      Steps = Math.abs(stepRow) + Math.abs(stepColumn);

      if (nearUser.steps === undefined || Steps < nearUser.steps) {
        nearUser = {
          steprow: stepRow,
          stepcolumn: stepColumn,
          steps: Steps,
          positionRow: itemUserRow,
          positionColumn: itemUserColumn,
        };
      }
    }
    if (Math.abs(nearUser.steprow) === Math.abs(nearUser.stepcolumn)) {
      if (Math.abs(nearUser.steprow) > itemEnemyDistance) {
        tempPRow = (itemEnemyRow - (itemEnemyDistance * Math.sign(nearUser.steprow)));
        tempPCOlumn = (itemEnemyColumn - (itemEnemyDistance * Math.sign(nearUser.stepcolumn)));

        currentEnemyCharacter.position = this.rowColumnToIndex(tempPRow, tempPCOlumn);
      } else {
        tempPRow = (itemEnemyRow - (nearUser.steprow - (1 * Math.sign(nearUser.steprow))));
        tempPCOlumn = (itemEnemyColumn - (nearUser.stepcolumn - (1 * Math.sign(nearUser.steprow))));

        currentEnemyCharacter.position = this.rowColumnToIndex(tempPRow, tempPCOlumn);
      }
    } else if (nearUser.stepcolumn === 0) {
      if (Math.abs(nearUser.steprow) > itemEnemyDistance) {
        tempPRow = (itemEnemyRow - (itemEnemyDistance * Math.sign(nearUser.steprow)));

        currentEnemyCharacter.position = this.rowColumnToIndex(tempPRow, (itemEnemyColumn));
      } else {
        tempPRow = (itemEnemyRow - (nearUser.steprow - (1 * Math.sign(nearUser.steprow))));

        currentEnemyCharacter.position = this.rowColumnToIndex(tempPRow, (itemEnemyColumn));
      }
    } else if (nearUser.steprow === 0) {
      if (Math.abs(nearUser.stepcolumn) > itemEnemyDistance) {
        tempPCOlumn = (itemEnemyColumn - (itemEnemyDistance * Math.sign(nearUser.stepcolumn)));

        currentEnemyCharacter.position = this.rowColumnToIndex((itemEnemyRow), tempPCOlumn);
      } else {
        const tempFormul = (nearUser.stepcolumn - (1 * Math.sign(nearUser.stepcolumn)));
        tempPCOlumn = (itemEnemyColumn - tempFormul);

        currentEnemyCharacter.position = this.rowColumnToIndex((itemEnemyRow), tempPCOlumn);
      }
    } else if (Math.abs(nearUser.steprow) > Math.abs(nearUser.stepcolumn)) {
      if (Math.abs(nearUser.steprow) > itemEnemyDistance) {
        tempPRow = (itemEnemyRow - (itemEnemyDistance * Math.sign(nearUser.steprow)));

        currentEnemyCharacter.position = this.rowColumnToIndex(tempPRow, (itemEnemyColumn));
      } else {
        tempPRow = (itemEnemyRow - (nearUser.steprow));

        currentEnemyCharacter.position = this.rowColumnToIndex(tempPRow, (itemEnemyColumn));
      }
    } else if (Math.abs(nearUser.stepcolumn) > itemEnemyDistance) {
      tempPCOlumn = (itemEnemyColumn - (itemEnemyDistance * Math.sign(nearUser.stepcolumn)));

      currentEnemyCharacter.position = this.rowColumnToIndex((itemEnemyRow), tempPCOlumn);
    } else {
      currentEnemyCharacter.position = this.rowColumnToIndex((itemEnemyRow), (itemEnemyColumn));
    }
  }

  positionRow(index) {
    return Math.floor(index / this.gamePlay.boardSize);
  }

  positionColumn(index) {
    return index % this.gamePlay.boardSize;
  }

  rowColumnToIndex(row, column) {
    return (row * 8) + column;
  }

  enemyAttack(allowAttack) {
    for (const itemUser of [...userPositions]) {
      if (allowAttack.includes(itemUser.position)) {
        return itemUser;
      }
    }
    return null;
  }
}
