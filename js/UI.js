export class UI {
  UISelectors = {
    board: "[data-board]",
    cell: "[data-cell]",
    piece: "[data-piece]",
    name1: "[data-name1]",
    name2: "[data-name2]",
    fas1: "[data-fas1]",
    fas2: "[data-fas2]",
    flag1: "[data-flag1]",
    flag2: "[data-flag2]",
    counter1: "[data-counter1]",
    counter2: "[data-counter2]",
    languageBtn: "[data-language-button]",
    starterModal: "[data-starter-modal]",
    starterModalBtn: "[data-starter-modal-button]",
    starterModalHeader: "[data-starter-modal-header]",
    starterLanguageBtn: "[data-starter-language-button]",
    starterModalPlayer1: "[data-starter-player1]",
    starterModalPlayer2: "[data-starter-player2]",
    captureModal: "[data-capture-modal]",
    captureModalText: "[data-capture-modal-text]",
    captureModalLanguageBtn: "[data-capture-modal-language-button]",
    captureModalBtn: "[data-capture-modal-button]",
    endgameModal: "[data-endgame-modal]",
    endgameModalText: "[data-endgame-modal-header]",
    endgameLanguageBtn: "[data-endgame-modal-language-button]",
    endgameModalAgainBtn: "[data-endgame-modal-again-button]",
    endgameModalBoardBtn: "[data-endgame-modal-board-button]",
    boardModal: "[data-board-modal]",
    boardModalBtn: "[data-board-modal-button]",
  };

  getElement(selector) {
    return document.querySelector(selector);
  }
  getElements(selector) {
    return document.querySelectorAll(selector);
  }
}
