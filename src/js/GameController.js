import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';
import GamePlay from './GamePlay';
// import cursors from './cursors';
import Team from './Team';
import GameState from './GameState';

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
    this.charIndex = 0;
    this.score = 0;
    this.bestScore = 0;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.drawUi(this.theme);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    // TODO: load saved stated from stateService
    this.stateService.load();
    this.checkLevel();
    this.gamePlay.redrawPositions([...this.playerPositions, ...this.enemyPositions]);
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
        this.gamePlay.redrawPositions([...this.playerPositions, ...this.enemyPositions]);
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

  checkLevel() {
    this.player = 'player';
    if (this.level === 1) {
      this.playerTeam = Team.initialPlayerTeam;
      this.enemyTeam = generateTeam(Team.enemyTeam, 1, 2);
      this.addPositions(this.playerTeam, this.enemyTeam);
      GamePlay.showMessage('Level 1!');
    } else if (this.level === 2) {
      this.theme = themes.desert;
      this.playerTeam = generateTeam(Team.playerTeam, 1, 1);
      this.enemyTeam = generateTeam(Team.enemyTeam, 2,
        this.playerTeam.length + this.playerPositions.length);
      this.addPositions(this.playerTeam, this.enemyTeam);
      GamePlay.showMessage('Level 2!');
    } else if (this.level === 3) {
      this.theme = themes.arctic;
      this.playerTeam = generateTeam(Team.playerTeam, 2, 2);
      this.enemyTeam = generateTeam(Team.enemyTeam, 3,
        this.playerTeam.length + this.playerPositions.length);
      this.addPositions(this.playerTeam, this.enemyTeam);
      GamePlay.showMessage('Level 3!');
    } else if (this.level === 4) {
      this.theme = themes.mountain;
      this.playerTeam = generateTeam(Team.playerTeam, 3, 2);
      this.enemyTeam = generateTeam(Team.enemyTeam, 4,
        this.playerTeam.length + this.playerPositions.length);
      this.addPositions(this.playerTeam, this.enemyTeam);
      GamePlay.showMessage('Level 4!');
    } else {
      GamePlay.showMessage(`Game Over! Your score: ${this.score}. Best score: ${this.bestScore}.`);
    }
  }

  addPositions(playerTeam, enemyTeam) {
    for (let i = 0; i < playerTeam.length; i += 1) {
      this.playerPositions.push(new PositionedCharacter(playerTeam[i], 0));
    }
    for (let i = 0; i < enemyTeam.length; i += 1) {
      this.playerPositions.push(new PositionedCharacter(enemyTeam[i], 0));
    }
  }

  /* showCharInfo() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
  }

  chooseChar() {
    this.gamePlay.addCellClickListener(this.onCellClick);
  }
*/

  onCellEnter(index, char) {
    // TODO: react to mouse enter
    if (index === char.index) {
      const message = `U+1F396${char.level}U+2694${char.attack}U+1F6E1${char.defence}U+2764${char.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (index) {
      this.gamePlay.hideCellTooltip();
    }
  }

  async onCellClick(index, char) {
    // TODO: react to click
    this.gamePlay.deselectCell(index);
    if (index === char.index) {
      if (char.type === 'Bowman' || char.type === 'Swordsman' || char.type === 'Magician') {
        this.gamePlay.selectCell(index);
      } else {
        this.gamePlay.showError('Нельзя выбрать этого персонажа');
      }
    }
  }
}
