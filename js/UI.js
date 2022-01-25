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
    rulesBtn: "[data-rules-button]",
    starterModal: "[data-starter-modal]",
    starterModalBtn: "[data-starter-modal-button]",
    starterModalHeader: "[data-starter-modal-header]",
    starterModalPlayer1: "[data-starter-player1]",
    starterModalPlayer2: "[data-starter-player2]",
    captureModal: "[data-capture-modal]",
    captureModalText: "[data-capture-modal-text]",
    captureModalBtn: "[data-capture-modal-button]",
    rulesModal: "[data-rules-modal]",
    rulesModalHeader: "[data-rules-modal-header]",
    rulesModalRule1: "[data-rules-modal-rule1]",
    rulesModalRule2: "[data-rules-modal-rule2]",
    rulesModalRule3: "[data-rules-modal-rule3]",
    rulesModalRule4: "[data-rules-modal-rule4]",
    rulesModalRule5: "[data-rules-modal-rule5]",
    rulesModalRule6: "[data-rules-modal-rule6]",
    rulesModalRule7: "[data-rules-modal-rule7]",
    rulesModalBtn: "[data-rules-modal-button]",
    endgameModal: "[data-endgame-modal]",
    endgameModalText: "[data-endgame-modal-header]",
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
