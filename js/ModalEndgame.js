import { UI } from "./UI.js";
import { game } from "./Game.js";
import { timer } from "./Timer.js";

export class ModalEndgame extends UI {
  endgameModal = null;
  endgameModalText = null;
  endgameModalAgainBtn = null;
  endgameModalBoardBtn = null;
  languageBtn = null;

  boardModal = null;
  boardModalBtn = null;

  handleElements() {
    this.endgameModal = this.getElement(this.UISelectors.endgameModal);
    this.endgameModalText = this.getElement(this.UISelectors.endgameModalText);
    this.endgameModalAgainBtn = this.getElement(
      this.UISelectors.endgameModalAgainBtn
    );
    this.endgameModalBoardBtn = this.getElement(
      this.UISelectors.endgameModalBoardBtn
    );
    this.endgameModalLanguageBtn = this.getElement(
      this.UISelectors.endgameLanguageBtn
    );

    this.boardModal = this.getElement(this.UISelectors.boardModal);
    this.boardModalBtn = this.getElement(this.UISelectors.boardModalBtn);
  }

  addEventListeners() {
    this.endgameModalBoardBtn.addEventListener(
      "click",
      this.#showBoard.bind(this)
    );
    this.endgameModalAgainBtn.addEventListener(
      "click",
      game.restartGame.bind(game)
    );
  }

  showModal() {
    this.endgameModal.classList.remove("endgame__modal--hidden");
  }

  hideModal() {
    this.endgameModal.classList.add("endgame__modal--hidden");
  }

  #showBoard(e) {
    e.preventDefault();
    this.endgameModal.classList.add("endgame__modal--hidden");
    this.boardModal.classList.remove("board__modal--hidden");
    this.boardModal.addEventListener("click", this.#hideBoard.bind(this));
  }

  #hideBoard(e) {
    e.preventDefault();
    this.boardModal.classList.add("board__modal--hidden");
    this.endgameModal.classList.remove("endgame__modal--hidden");
  }

  againBtnInEnglish() {
    this.endgameModalAgainBtn.innerText = "PLAY AGAIN!";
  }

  againBtnInPolish() {
    this.endgameModalAgainBtn.innerText = "ZAGRAJ PONOWNIE!";
  }

  showBoardBtnInEnglish() {
    this.endgameModalBoardBtn.innerText = "SHOW BOARD";
  }

  showBoardBtnInPolish() {
    this.endgameModalBoardBtn.innerText = "POKAŻ PLANSZĘ";
  }

  player1WinsInEnglish() {
    this.endgameModalText.textContent = `${timer.player1Name} WINS!`;
  }

  player1WinsInPolish() {
    this.endgameModalText.textContent = `${timer.player1Name} WYGRYWA!`;
  }

  player2WinsInEnglish() {
    this.endgameModalText.textContent = `${timer.player2Name} WINS!`;
  }

  player2WinsInPolish() {
    this.endgameModalText.textContent = `${timer.player2Name} WYGRYWA!`;
  }

  noMovePlayer1WinsInEnglish() {
    this.endgameModalText.textContent = `${timer.player2Name} HAS NO POSSIBLE MOVE SO ${timer.player1Name} WINS!`;
  }

  noMovePlayer1WinsInPolish() {
    this.endgameModalText.textContent = `${timer.player2Name} NIE MOŻE WYKONAĆ RUCHU WIĘC ${timer.player1Name} WYGRYWA!`;
  }

  noMovePlayer2WinsInEnglish() {
    this.endgameModalText.textContent = `${timer.player1Name} HAS NO POSSIBLE MOVE SO ${timer.player2Name} WINS!`;
  }

  noMovePlayer2WinsInPolish() {
    this.endgameModalText.textContent = `${timer.player1Name} NIE MOŻE WYKONAĆ RUCHU WIĘC ${timer.player2Name} WYGRYWA!`;
  }

  drawTextInEnglish() {
    this.endgameModalText.textContent =
      "TOO MANY MOVES WITHOUT CAPTURE. NOBODY WINS!";
  }

  drawTextInPolish() {
    this.endgameModalText.textContent =
      "ZBYT DUŻO RUCHÓW BEZ WYKONANEGO BICIA. REMIS!";
  }

  init() {
    this.handleElements();
  }
}

const modalEndgame = new ModalEndgame();
modalEndgame.init();

export { modalEndgame };
