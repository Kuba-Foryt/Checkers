import { UI } from "./UI.js";
import { click } from "./Click.js";
import { board } from "./Board.js";
import { language } from "./Language.js";
import { timer } from "./Timer.js";
import { players } from "./Players.js";
import { modalStarter } from "./ModalStarter.js";
import { modalMustCapture } from "./ModalMustCapture.js";
import { modalEndgame } from "./ModalEndgame.js";
import { modalRules } from "./ModalRules.js";
import { move } from "./Move.js";
import { jump } from "./Jump.js";

export class Game extends UI {
  config = {
    rows: 8,
    cols: 8,
    number: 64,
    pieces: 24,
  };

  turn = true;
  #popup = false;

  redPieces = [];
  blackPieces = [];

  black = [];
  red = [];
  #blackAmount = 12;
  #redAmount = 12;
  moveWithoutCapture = 0;
  winner = null;

  redTimer = null;
  blackTimer = null;
  redCounter = null;
  blackCounter = null;

  player1Name = null;
  player2Name = null;
  name1 = null;
  name2 = null;
  starterBtn = null;

  redCountdown = null;
  blackCountdown = null;

  initializeGame() {
    this.#handleElements();
    board.createBoard();
    this.#newGame();
  }

  #handleElements() {
    this.name1 = this.getElement(this.UISelectors.name1);
    this.name2 = this.getElement(this.UISelectors.name2);
  }

  #newGame() {
    timer.generateTimers();
    timer.renderTimers();
    this.#addBtnsEventListeners();
    modalStarter.init();
  }

  startGame(e) {
    e.preventDefault();
    // click.createCustomKings();
    timer.updateNames();
    modalStarter.hideModal();
    this.changeActivePlayerUI();
    this.#addBlackPiecesEventListeners();
    this.#addFlagsEventListeners();
    this.blackCountdown = setInterval(timer.updateBlackCountdown, 1000);
  }

  restartGame(e) {
    e.preventDefault();
    board.cells = [];
    board.createBoard();
    this.#resetGameParams();
    timer.generateTimers();
    this.changeActivePlayerUI();
    timer.renderTimers();
    timer.updateNames();
    modalEndgame.hideModal();
    this.#addBlackPiecesEventListeners();
    this.blackCountdown = setInterval(timer.updateBlackCountdown, 1000);
  }

  #addBtnsEventListeners() {
    modalStarter.addEventListeners();
    modalRules.addEventListeners();
    language.addEventListeners();
    modalMustCapture.addEventListeners();
    modalEndgame.addEventListeners();
  }

  #addFlagsEventListeners() {
    players.flag1.addEventListener("click", this.#giveUpGame.bind(this));
    players.flag2.addEventListener("click", this.#giveUpGame.bind(this));
  }

  #addBlackPiecesEventListeners() {
    this.#updateAmountOfPieces();
    this.black.forEach((element) => {
      element.addEventListener("click", click.handleCellClick);
    });
    this.red.forEach((element) => {
      element.removeEventListener("click", click.handleCellClick);
    });
  }

  #addRedPiecesEventListeners() {
    this.#updateAmountOfPieces();
    this.red.forEach((element) => {
      element.addEventListener("click", click.handleCellClick);
    });
    this.black.forEach((element) => {
      element.removeEventListener("click", click.handleCellClick);
    });
  }

  #removePiecesEventListeners() {
    this.red.forEach((element) => {
      element.removeEventListener("click", click.handleCellClick);
    });
    this.black.forEach((element) => {
      element.removeEventListener("click", click.handleCellClick);
    });
  }

  reloadPiecesEventListeners() {
    this.turn
      ? this.#addBlackPiecesEventListeners()
      : this.#addRedPiecesEventListeners();
  }

  changeTurn() {
    click.cleanMemoryClick();
    if (this.turn) {
      this.turn = false;
      this.#addRedPiecesEventListeners();
      this.redCountdown = setInterval(timer.updateRedCountdown, 1000);
      clearInterval(this.blackCountdown);
    } else if (!this.turn) {
      this.turn = true;
      this.#addBlackPiecesEventListeners();
      this.blackCountdown = setInterval(timer.updateBlackCountdown, 1000);
      clearInterval(this.redCountdown);
    }
    this.changeActivePlayerUI();
    jump.checkIfAnyJumpIsPossible();
    move.checkIfAnyMoveIsPossible();
    this.#endGameIfThereIsNoPossibleMove();
    // console.log(board.cellsToJump, board.cellsToMove);
  }

  changeActivePlayerUI() {
    if (this.turn) {
      players.blackTurn();
    } else {
      players.redTurn();
    }
  }

  showPopup() {
    if (!this.#popup) {
      modalMustCapture.revealCaptureModalPopup();
      this.#popup = !this.#popup;
    }
  }

  #updateAmountOfPieces() {
    this.red = document.querySelectorAll(".red");
    this.black = document.querySelectorAll(".black");
    this.#redAmount = this.red.length;
    this.#blackAmount = this.black.length;
  }

  #resetGameParams() {
    this.redCounter = null;
    this.blackCounter = null;
    this.moveWithoutCapture = 0;
    this.winner = null;
    this.turn = true;
    this.#popup = false;
  }

  checkIfWin() {
    if (this.#redAmount === 0) {
      this.endGame();
      this.winner = "black";
      language.english
        ? modalEndgame.player1WinsInEnglish()
        : modalEndgame.player1WinsInPolish();
    } else if (this.#blackAmount === 0) {
      this.endGame();
      this.winner = "red";
      language.english
        ? modalEndgame.player2WinsInEnglish()
        : modalEndgame.player2WinsInPolish();
    } else if (this.moveWithoutCapture === 15) {
      this.endGame();
      language.english
        ? modalEndgame.drawTextInEnglish()
        : modalEndgame.drawTextInPolish();
    } else if (timer.timeRed == 0) {
      this.endGame();
      this.winner = "black";
      language.english
        ? modalEndgame.player1WinsInEnglish()
        : modalEndgame.player1WinsInPolish();
    } else if (timer.timeBlack == 0) {
      this.endGame();
      this.winner = "red";
      language.english
        ? modalEndgame.player2WinsInEnglish()
        : modalEndgame.player2WinsInPolish();
    }
  }

  #endGameIfThereIsNoPossibleMove() {
    if (!board.pieceCanMove.length && !board.pieceCanJump.length && this.turn) {
      this.endGame();
      this.winner = "red";
      language.english
        ? modalEndgame.noMovePlayer2WinsInEnglish()
        : modalEndgame.noMovePlayer2WinsInPolish();
    } else if (
      !board.pieceCanMove.length &&
      !board.pieceCanJump.length &&
      !this.turn
    ) {
      this.endGame();
      this.winner = "black";
      language.english
        ? modalEndgame.noMovePlayer1WinsInEnglish()
        : modalEndgame.noMovePlayer1WinsInPolish();
    }
  }

  #giveUpGame(e) {
    if (e.target === players.flag1) {
      this.endGame();
      this.winner = "black";
      language.english
        ? modalEndgame.player1WinsInEnglish()
        : modalEndgame.player1WinsInPolish();
    } else if (e.target === players.flag2) {
      this.endGame();
      this.winner = "red";
      language.english
        ? modalEndgame.player2WinsInEnglish()
        : modalEndgame.player2WinsInPolish();
    }
  }

  endGame() {
    clearInterval(this.blackCountdown);
    clearInterval(this.redCountdown);
    this.#removePiecesEventListeners();
    click.cleanMemoryClick();
    players.hideFas();
    modalEndgame.showModal();
  }
}

const game = new Game();

window.onload = function () {
  game.initializeGame();
};

export { game };
