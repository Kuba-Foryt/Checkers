import { UI } from "./UI.js";
import { click } from "./Click.js";
import { board } from "./Board.js";
import { language } from "./Language.js";
import { timer } from "./Timer.js";
import { players } from "./Players.js";
import { modalStarter } from "./ModalStarter.js";
import { modalMustCapture } from "./ModalMustCapture.js";
import { modalEndgame } from "./ModalEndgame.js";
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
  #pieceCanJump = [];
  #pieceCanMove = [0];

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
    console.log(modalStarter.starterBtn);
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
    timer.updateNames.bind(timer)();
    modalStarter.hideModal();
    language.showLanguageButton();
    this.changeActivePlayerUI();
    this.#addBlackPiecesEventListeners();
    this.#addFlagsEventListeners();
    this.blackCountdown = setInterval(
      timer.updateBlackCountdown.bind(timer),
      1000
    );
  }

  restartGame(e) {
    e.preventDefault();
    board.cells = [];
    board.createBoard();
    this.#resetGameParams();
    timer.generateTimers();
    this.changeActivePlayerUI();
    timer.renderTimers.bind(timer)();
    timer.updateNames.bind(timer)();
    modalEndgame.hideModal();
    language.showLanguageButton();
    this.#addBlackPiecesEventListeners();
    this.blackCountdown = setInterval(
      timer.updateBlackCountdown.bind(timer),
      1000
    );
  }

  #addBtnsEventListeners() {
    modalStarter.addEventListeners();
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
      this.redCountdown = setInterval(
        timer.updateRedCountdown.bind(timer),
        1000
      );
      clearInterval(this.blackCountdown);
    } else if (!this.turn) {
      this.turn = true;
      this.#addBlackPiecesEventListeners();
      this.blackCountdown = setInterval(
        timer.updateBlackCountdown.bind(timer),
        1000
      );
      clearInterval(this.redCountdown);
    }
    this.changeActivePlayerUI();
    jump.checkIfAnyJumpIsPossible();
    move.checkIfAnyMoveIsPossible();
    this.#endGameIfThereIsNoPossibleMove();
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
      language.hideLanguageButton();
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
    if (!this.#pieceCanMove.length && !this.#pieceCanJump.length && this.turn) {
      this.endGame();
      this.winner = "red";
      language.english
        ? modalEndgame.noMovePlayer2WinsInEnglish()
        : modalEndgame.noMovePlayer2WinsInPolish();
    } else if (
      !this.#pieceCanMove.length &&
      !this.#pieceCanJump.length &&
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
    language.hideLanguageButton();
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
    this.#removePiecesEventListeners();
    language.hideLanguageButton();
    clearInterval(this.blackCountdown);
    clearInterval(this.redCountdown);
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
