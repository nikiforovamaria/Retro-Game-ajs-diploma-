import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import getPositions from './calcPositions';
import { generateTeam } from './generators';
import GamePlay from './GamePlay';
import cursors from './cursors';
import Team from './Team';
import GameState from './GameState';
import { getMovesCells, getAttackCells } from './calcCells';
import showCharInfo from './showCharInfo';
import getIndex from './getIndex';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.player = 'player';
    this.level = 1;
    this.theme = themes.prairie;
    this.playerTeam = [];
    this.enemyTeam = [];
    this.playerPositions = [];
    this.enemyPositions = [];
    this.selectedChar = {};
    this.selectedIndex = 0;
    this.score = 0;
    this.boardBlocked = false;
    this.selected = false;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    // TODO: load saved stated from stateService
    this.stateService.load();
    this.checkLevel();
  }

  // new Game

  newGame() {
    this.player = 'player';
    this.level = 1;
    this.theme = themes.prairie;
    this.playerTeam = [];
    this.enemyTeam = [];
    this.playerPositions = [];
    this.enemyPositions = [];
    this.score = 0;
    this.boardBlocked = false;
    const bestScore = this.getBestScore();
    const state = this.stateService.load();
    if (state) {
      state.bestScore = bestScore;
      this.stateService.save(GameState.from(state));
    }
    this.checkLevel();
    GamePlay.showMessage('New Game Begins!');
  }

  // save Game

  saveGame() {
    const bestScore = this.getBestScore();
    const state = {
      player: this.player,
      level: this.level,
      theme: this.theme,
      score: this.score,
      bestScore,
      playerPositions: this.playerPositions,
      enemyPositions: this.enemyPositions,
    };
    this.stateService.save(GameState.from(state));
    GamePlay.showMessage('Game Saved!');
  }

  // load Game

  loadGame() {
    try {
      const state = this.stateService.load();
      if (state) {
        this.score = state.score;
        this.level = state.level;
        this.theme = state.theme;
        this.playerPositions = state.playerPositions;
        this.enemyPositions = state.enemyPositions;
        this.gamePlay.drawUi(this.theme);
      }
      GamePlay.showMessage('Game loaded!');
    } catch (e) {
      GamePlay.showError(`Error: ${e}`);
      this.newGame();
    }
  }

  // getting best score from state

  getBestScore() {
    let bestScore = 0;
    try {
      const state = this.stateService.load();
      if (state) {
        bestScore = Math.max(state.bestScore, this.point);
      }
    } catch (e) {
      bestScore = this.score;
    }
    return bestScore;
  }

  // changing the theme & character level up

  checkLevel() {
    this.player = 'player';
    if (this.level === 1) {
      this.playerTeam = generateTeam(Team.initialPlayerTeam, 1, 2);
      this.enemyTeam = generateTeam(Team.enemyTeam, 1, 2);
      this.addPositions(this.playerTeam, this.enemyTeam);
      GamePlay.showMessage('Level 1!');
    } else if (this.level === 2) {
      this.playerTeam.forEach((char) => char.character.levelUp());
      this.theme = themes.desert;
      this.playerTeam = generateTeam(Team.playerTeam, 1, 1);
      this.enemyTeam = generateTeam(Team.enemyTeam, 2,
        this.playerTeam.length + this.playerPositions.length);
      this.addPositions(this.playerTeam, this.enemyTeam);
      GamePlay.showMessage('Level 2!');
    } else if (this.level === 3) {
      this.playerTeam.forEach((char) => char.character.levelUp());
      this.theme = themes.arctic;
      this.playerTeam = generateTeam(Team.playerTeam, 2, 2);
      this.enemyTeam = generateTeam(Team.enemyTeam, 3,
        this.playerTeam.length + this.playerPositions.length);
      this.addPositions(this.playerTeam, this.enemyTeam);
      GamePlay.showMessage('Level 3!');
    } else if (this.level === 4) {
      this.playerTeam.forEach((char) => char.character.levelUp());
      this.theme = themes.mountain;
      this.playerTeam = generateTeam(Team.playerTeam, 3, 2);
      this.enemyTeam = generateTeam(Team.enemyTeam, 4,
        this.playerTeam.length + this.playerPositions.length);
      this.addPositions(this.playerTeam, this.enemyTeam);
      GamePlay.showMessage('Level 4!');
    } else {
      GamePlay.showMessage(`Game Over! Your score: ${this.score}. Best score: ${this.getBestScore()}.`);
      return;
    }
    const charPositions = getPositions(this.playerPositions.length);
    for (let i = 0; i < this.playerPositions.length; i += 1) {
      this.playerPositions[i].position = charPositions.user[i];
      this.enemyPositions[i].position = charPositions.enemy[i];
    }
    this.gamePlay.drawUi(this.theme);
    this.gamePlay.redrawPositions([...this.playerPositions, ...this.enemyPositions]);
  }

  addPositions(playerTeam, enemyTeam) {
    for (let i = 0; i < playerTeam.length; i += 1) {
      this.playerPositions.push(new PositionedCharacter(playerTeam[i], 0));
    }
    for (let i = 0; i < enemyTeam.length; i += 1) {
      this.playerPositions.push(new PositionedCharacter(enemyTeam[i], 0));
    }
  }

  // entering the cell

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.index = index;
    for (const item of [...this.playerPositions, ...this.enemyPositions]) {
      if (item.position === index) {
        this.gamePlay.showCellTooltip(showCharInfo(item.character), index);
      }
    }
    if (this.selected) {
      const moves = getMovesCells(this.selectedChar.position,
        this.selectedChar.character.distance, this.gamePlay.boardSize);
      const attacks = getAttackCells(this.selectedChar.position,
        this.selectedChar.character.attackDistance, this.gamePlay.boardSize);
      if (this.checkIndex(this.playerPositions) !== -1) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if ((moves.includes(this.index))
      && (this.checkIndex([...this.playerPositions, ...this.enemyPositions]) === -1)) {
        this.gamePlay.selectCell(this.index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else if ((attacks.includes(this.index))
      && (this.checkIndex(this.enemyPositions) !== -1)) {
        this.gamePlay.selectCell(this.index, 'red');
        this.gamePlay.setCursor(cursors.crosshair);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  // checking the index of positions

  checkIndex(positions) {
    return positions.findIndex((item) => item.position === this.index);
  }

  // leaving the cell

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.selectedChar.position !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  // clicking the cell

  async onCellClick(index) {
    // TODO: react to click
    // if selected player
    this.index = index;
    if (this.checkIndex([...this.playerPositions]) !== -1) {
      this.gamePlay.deselectCell(this.selectedIndex);
      this.gamePlay.selectCell(index);
      this.selectedIndex = index;
      this.selectedChar = [...this.playerPositions].find((item) => item.position === index);
      this.selected = true;

      // selected enemy
    } else if ((!this.selected) && (this.checkIndex([...this.enemyPositions]) !== -1)) {
      GamePlay.showError('Cannot choose this character!');

      // our move
    } else if (this.selected && this.gamePlay.boardEl.style.cursor === 'pointer') {
      this.selectedChar.position = index;
      this.gamePlay.deselectCell(this.selectedIndex);
      this.gamePlay.deselectCell(index);
      this.selected = false;
      this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);

      // enemy turn
      this.player = 'enemy';
      this.enemyStrategy();

      // our attack
    } else if (this.selected && this.gamePlay.boardEl.style.cursor === 'crosshair') {
      const target = [...this.enemyPositions].find((item) => item.position === index);
      this.gamePlay.deselectCell(this.selectedIndex);
      this.gamePlay.deselectCell(index);
      this.gamePlay.setCursor(cursors.auto);
      this.selected = false;
      await this.charAttack(this.selectedChar.character, target);
      if (this.enemyPositions.length > 0) {
        this.enemyStrategy();
      }
    }
  }

  // attack strategy
  async charAttack(char, target) {
    const targetChar = target.character;
    const damage = Math.floor(Math.max(char.attack
       - targetChar.defence, char.attack * 0.1));
    await this.gamePlay.showDamage(target.position, damage);
    targetChar.health -= damage;
    if (this.player === 'player') {
      this.player = 'enemy';
    } else if (this.player === 'enemy') {
      this.player = 'player';
    }

    // removing dead character
    if (target.character.health <= 0) {
      this.playerPositions = this.playerPositions
        .filter((item) => item.position !== target.position);
      this.enemyPositions = this.enemyPositions
        .filter((item) => item.position !== target.position);

      // player lost and all his characters dead
      if (this.playerPositions.length === 0) {
        GamePlay.showMessage('Game over! You lost...');
      }

      // on to the next level when enemy lost
      if (this.enemyPositions.length === 0) {
        for (const item of this.playerPositions) {
          this.score += item.character.health;
        }
        this.level += 1;
        this.checkLevel();
      }
    }
    this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
  }

  // enemy attack

  async enemyAttacks(char, target) {
    await this.charAttack(char, target);
    this.player = 'player';
  }

  // enemy strategy

  enemyStrategy() {
    if (this.player === 'enemy') {
      // attacking players characters
      for (const enemy of [...this.enemyPositions]) {
        const attack = getAttackCells(enemy.position,
          this.selectedChar.character.attackDistance, this.gamePlay.boardSize);
        const target = this.enemyTarget(attack);
        if (target !== null) {
          this.enemyAttacks(enemy.character, target);
          return;
        }
      }
      // enemy moves
      const random = Math.floor(Math.random() * [...this.enemyPositions].length);
      const enemy = [...this.enemyPositions][random];
      this.enemyMove(enemy);
      this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
      this.player = 'player';
    }
  }

  // choosing enemy's target

  enemyTarget(attack) {
    for (const player of [...this.playerPositions]) {
      if (attack.includes(player.position)) {
        return player;
      }
    }
    return null;
  }

  // enemy moves strategy

  enemyMove(enemy) {
    const tempEnemy = enemy;
    const enemyDistance = enemy.character.distance;
    let tempRow;
    let tempColumn;
    let stepRow;
    let stepColumn;
    let Steps;
    const enemyRow = Math.floor(tempEnemy.position / this.gamePlay.boardSize);
    const enemyColumn = tempEnemy.position % this.gamePlay.boardSize;
    let nearPlayer = {};

    for (const player of [...this.playerPositions]) {
      const playerRow = Math.floor(player.position / this.gamePlay.boardSize);
      const playerColumn = player.position % this.gamePlay.boardSize;
      stepRow = enemyRow - playerRow;
      stepColumn = enemyColumn - playerColumn;
      Steps = Math.abs(stepRow) + Math.abs(stepColumn);
      if (nearPlayer.steps === undefined || Steps < nearPlayer.steps) {
        nearPlayer = {
          steprow: stepRow,
          stepcolumn: stepColumn,
          steps: Steps,
          positionRow: playerRow,
          positionColumn: playerColumn,
        };
      }
    }
    // diagonal move
    if (Math.abs(nearPlayer.steprow) === Math.abs(nearPlayer.stepcolumn)) {
      if (Math.abs(nearPlayer.steprow) > enemyDistance) {
        tempRow = (enemyRow - (enemyDistance * Math.sign(nearPlayer.steprow)));
        tempColumn = (enemyColumn - (enemyDistance * Math.sign(nearPlayer.stepcolumn)));

        tempEnemy.position = getIndex(tempRow, tempColumn);
      } else {
        tempRow = (enemyRow - (nearPlayer.steprow - (1 * Math.sign(nearPlayer.steprow))));
        tempColumn = (enemyColumn - (nearPlayer.stepcolumn - (1 * Math.sign(nearPlayer.steprow))));

        tempEnemy.position = getIndex(tempRow, tempColumn);
      }
    } else if (nearPlayer.stepcolumn === 0) {
      // vertical move
      if (Math.abs(nearPlayer.steprow) > enemyDistance) {
        tempRow = (enemyRow - (enemyDistance * Math.sign(nearPlayer.steprow)));

        tempEnemy.position = getIndex(tempRow, (enemyColumn));
      } else {
        tempRow = (enemyRow - (nearPlayer.steprow - (1 * Math.sign(nearPlayer.steprow))));

        tempEnemy.position = getIndex(tempRow, (enemyColumn));
      }
    } else if (nearPlayer.steprow === 0) {
      if (Math.abs(nearPlayer.stepcolumn) > enemyDistance) {
        tempColumn = (enemyColumn - (enemyDistance * Math.sign(nearPlayer.stepcolumn)));

        tempEnemy.position = getIndex((enemyRow), tempColumn);
      } else {
        const tempFormul = (nearPlayer.stepcolumn - (1 * Math.sign(nearPlayer.stepcolumn)));
        tempColumn = (enemyColumn - tempFormul);

        tempEnemy.position = getIndex((enemyRow), tempColumn);
      }
    } else if (Math.abs(nearPlayer.steprow) > Math.abs(nearPlayer.stepcolumn)) {
      if (Math.abs(nearPlayer.steprow) > enemyDistance) {
        tempRow = (enemyRow - (enemyDistance * Math.sign(nearPlayer.steprow)));

        tempEnemy.position = getIndex(tempRow, (enemyColumn));
      } else {
        tempRow = (enemyRow - (nearPlayer.steprow));

        tempEnemy.position = getIndex(tempRow, (enemyColumn));
      }
    } else if (Math.abs(nearPlayer.stepcolumn) > enemyDistance) {
      tempColumn = (enemyColumn - (enemyDistance * Math.sign(nearPlayer.stepcolumn)));

      tempEnemy.position = getIndex((enemyRow), tempColumn);
    } else {
      tempEnemy.position = getIndex((enemyRow), (enemyColumn));
    }
  }
}
