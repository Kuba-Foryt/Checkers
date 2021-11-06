export class UI {
  UISelectors = {
    board: "[data-board]",
    cell: "[data-cell]",
    piece: "[data-piece]",
    name1: "[data-name1]",
    name2: "[data-name2]",
    counter1: "[data-counter1]",
    counter2: "[data-counter2]",
    starterModal: "[data-starter-modal]",
    starterModalBtn: "[data-starter-modal-button]",
    starterModalPlayer1: "[data-starter-player1]",
    starterModalPlayer2: "[data-starter-player2]",
    endgameModal: "[data-endgame-modal]",
    endgameModalText: "[data-endgame-modal-header]",
    endgameModalBtn: "[data-endgame-modal-button]",
  };

  getElement(selector) {
    return document.querySelector(selector);
  }
  getElements(selector) {
    return document.querySelectorAll(selector);
  }
}
