import { UI } from "./UI.js";
import { game } from "./Game.js";
import { board } from "./Board.js";
import { selectedPiece } from "./SelectedPiece.js";
import { move } from "./Move.js";
import { jump } from "./Jump.js";
import { kingJump } from "./KingJump.js";

export class Click extends UI {
  config = {
    rows: 8,
    cols: 8,
    number: 64,
    pieces: 24,
  };

  createCustomKings() {
    board.cells[44].element.firstChild.classList.add("blackKing");
    board.cells[46].element.firstChild.classList.add("blackKing");
    board.cells[19].element.firstChild.classList.add("redKing");
  }

  handleCellClick = (e) => {
    if (selectedPiece.target) {
      this.#cleanTargetEventListeners();
    }

    game.reloadPiecesEventListeners();
    this.cleanMemoryClick();
    jump.checkIfAnyJumpIsPossible();

    selectedPiece.target = e.target;
    selectedPiece.index = parseInt(
      selectedPiece.target.getAttribute("data-n"),
      10
    );
    selectedPiece.cell = board.cells[selectedPiece.index - 1];
    selectedPiece.target.classList.add("selected");

    selectedPiece.target.classList.contains("blackKing") ||
    selectedPiece.target.classList.contains("redKing")
      ? kingJump.checkPossibleKingJump(selectedPiece.index)
      : jump.checkPossibleJump(selectedPiece.index);
  };

  cleanMemoryClick() {
    if (selectedPiece.target) {
      selectedPiece.target.classList.remove("selected");
    }
    if (board.cellsToJump.length) {
      board.cellsToJump.forEach((element) =>
        element.element.classList.remove("possibleJump")
      );
    }
    if (board.cellsToMove.length) {
      board.cellsToMove.forEach((element) =>
        element.element.classList.remove("possibleMove")
      );
    }
    if (board.pieceCanJump.length) {
      board.pieceCanJump.forEach((element) =>
        element.classList.remove("canJump")
      );
    }

    board.cellsToMove.forEach((element) =>
      element.element.removeEventListener("click", board.cellsToMoveHandler)
    );
    board.cellsToMoveKing.forEach((element) =>
      element.element.removeEventListener("click", board.cellsToKingMoveHandler)
    );
    board.cellsToJump.forEach((element) =>
      element.element.removeEventListener("click", board.cellsToJumpHandler)
    );

    selectedPiece.cell = null;
    selectedPiece.index = null;
    selectedPiece.option = null;
    board.pieceCanJump = [];
    board.pieceCanMove = [];
    board.cellsToMove = [];
    board.cellsToJump = [];
    board.cellsToClean = [];
    board.cellsToCleanKing = [];
    board.cellsToJumpKing = [];
    board.cellsToKingJumpHelper = [];
    board.cellsToKingMoveHelper = [];
    board.cellsToCheckMove = [];
    board.sum = 0;
  }

  #cleanTargetEventListeners() {
    selectedPiece.target.removeEventListener("click", board.cellsToMoveHandler);
    selectedPiece.target.removeEventListener(
      "click",
      board.cellsToKingMoveHandler
    );
    selectedPiece.target.removeEventListener("click", board.cellsToJumpHandler);
  }
}

const click = new Click();
export { click };
