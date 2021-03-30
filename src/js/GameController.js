import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import getPositions from './calcPositions';
import { generateTeam } from './generators';
import GamePlay from './GamePlay';
import cursors from './cursors';
import Team from './Team';
import GameState from './GameState';
import { getMovesCells, getAttackCells } from './calcCells';

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

  // character info message
  /*
  showCharInfo(char) {
    return `${'\u{1F396}'} ${char.level} ${'\u{2694}'} ${char.attack}
     ${'\u{1F6E1}'} ${char.defence} ${'\u{2764}'} ${char.health}`;
  }
*/
  // entering the cell

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.index = index;
    for (const item of [...this.playerPositions, ...this.enemyPositions]) {
      if (item.position === index) {
        this.gamePlay.showCellTooltip(this.showCharInfo(item.character), index);
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
      const attack = [...this.enemyPositions].find((item) => item.position === index);
      this.gamePlay.deselectCell(this.selectedIndex);
      this.gamePlay.deselectCell(index);
      this.gamePlay.setCursor(cursors.auto);
      this.selected = false;
      await this.characterAttack(this.selectedChar.character, attack);
      if (this.enemyPositions.length > 0) {
        this.enemyStrategy();
      }
    }
  }

  // tbc
  async characterAttack(attacker, attacked) {
    const attackedCharacter = attacked.character;
    const damage = Math.floor(Math.max(attacker.attack
       - attackedCharacter.defence, attacker.attack * 0.1));
    await this.gamePlay.showDamage(attacked.position, damage);
    attackedCharacter.health -= damage;
    if (this.player === 'user') {
      this.player = 'enemy';
    } else if (this.player === 'enemy') {
      this.player = 'user';
    }

    // Если персонаж погиб, убираем игрока
    if (attacked.character.health <= 0) {
      this.userPositions = this.userPositions.filter((item) => item.position !== attacked.position);
      this.enemyPositions = this.enemyPositions.filter((item) => item.position
      !== attacked.position);

      // Если погибли все персонажи юзера, то выдаем ошибку
      if (this.userPositions.length === 0) {
        GamePlay.showMessage('Вы проиграли!');
      }
      // Если погибли все персонажи противника, повышаем левел и переходим на новый
      if (this.enemyPositions.length === 0) {
        for (const item of this.userPositions) {
          this.point += item.character.health;
        }
        this.levelUp();
        this.level += 1;
        this.drawTeams();
      }
    }
    this.gamePlay.redrawPositions([...this.userPositions, ...this.enemyPositions]);
  }
}
