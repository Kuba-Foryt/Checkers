import { game } from "./Game.js";
import { board } from "./Board.js";
import { selectedPiece } from "./SelectedPiece.js";
import { click } from "./Click.js";
import { move } from "./Move.js";

class KingMove {
  checkPossibleKingMoveHandler() {
    board.cellsToMoveKing = board.cellsToCleanKing;
    board.cellsToMoveKing.splice(5, 0, board.cellsToJumpKing[4]);
    board.cellsToMoveKing.splice(12, 0, board.cellsToJumpKing[10]);
    board.cellsToMoveKing.splice(19, 0, board.cellsToJumpKing[16]);
    board.cellsToMoveKing.push(board.cellsToJumpKing[21]);

    // left up
    for (let i = 0; i < 6; i++) {
      this.#checkMoveLeftTopDirection(i);
    }

    //right up
    for (let i = 6; i < 13; i++) {
      this.#checkMoveRightTopDirection(i);
    }

    //left down
    for (let i = 13; i < 20; i++) {
      this.#checkMoveLeftBottomDirection(i);
    }

    //right down
    for (let i = 20; i < 26; i++) {
      this.#checkMoveRightBottomDirection(i);
    }
  }

  #checkColorAndFreeSpot(j) {
    if (
      board.cellsToMoveKing[j].isBrown &&
      !board.cellsToMoveKing[j].hasPiece
    ) {
      board.cellsToKingMoveHelper.push(0);
    } else {
      board.cellsToKingMoveHelper.push(1);
    }
  }

  #checkMoveLeftTopDirection(i) {
    board.cellsToKingMoveHelper = [];
    if (
      board.cellsToMoveKing[i].isBrown &&
      !board.cellsToMoveKing[i].hasPiece
    ) {
      for (let j = 0; j < i + 1; j++) {
        this.#checkColorAndFreeSpot(j);
      }
      this.#selectPossibleKingMoveSpots(i);
    }
  }

  #checkMoveRightTopDirection(i) {
    board.cellsToKingMoveHelper = [];
    if (
      board.cellsToMoveKing[i].isBrown &&
      !board.cellsToMoveKing[i].hasPiece
    ) {
      for (let j = 6; j < i + 1; j++) {
        this.#checkColorAndFreeSpot(j);
      }
      this.#selectPossibleKingMoveSpots(i);
    }
  }
  #checkMoveLeftBottomDirection(i) {
    board.cellsToKingMoveHelper = [];
    if (
      board.cellsToMoveKing[i].isBrown &&
      !board.cellsToMoveKing[i].hasPiece
    ) {
      for (let j = 13; j < i + 1; j++) {
        this.#checkColorAndFreeSpot(j);
      }
      this.#selectPossibleKingMoveSpots(i);
    }
  }

  #checkMoveRightBottomDirection(i) {
    board.cellsToKingMoveHelper = [];
    if (
      board.cellsToMoveKing[i].isBrown &&
      !board.cellsToMoveKing[i].hasPiece
    ) {
      for (let j = 20; j < i + 1; j++) {
        this.#checkColorAndFreeSpot(j);
      }
      this.#selectPossibleKingMoveSpots(i);
    }
  }

  #selectPossibleKingMoveSpots(i) {
    board.sum = 0;
    if (board.cellsToKingMoveHelper.length) {
      for (let k = 0; k < board.cellsToKingMoveHelper.length; k++) {
        board.sum += board.cellsToKingMoveHelper[k];
      }
      if (!board.sum) {
        board.cellsToMove.push(board.cellsToMoveKing[i]);
      }
    }
  }

  checkPossibleKingMove() {
    this.checkPossibleKingMoveHandler();
    if (!board.cellsToMove.length) {
      click.cleanMemoryClick();
      return;
    }

    this.#handleKingMovement(
      selectedPiece.cell,
      selectedPiece.index,
      selectedPiece.target
    );
  }

  #handleKingMovement(cell, index, target) {
    board.cellsToKingMoveHandler = this.#moveKing.bind(
      this,
      cell,
      index,
      target
    );

    board.cellsToMove.forEach((element) =>
      element.element.addEventListener("click", board.cellsToKingMoveHandler)
    );
    selectedPiece.target.removeEventListener("click", click.handleCellClick);
    selectedPiece.target.addEventListener(
      "click",
      board.cellsToKingMoveHandler
    );
    board.cellsToMove.forEach((element) =>
      element.element.classList.add("possibleMove")
    );
  }

  #moveKing(cell, index, target, e) {
    selectedPiece.option = e.target;

    if (
      board.pieceCanJump.length &&
      selectedPiece.option != selectedPiece.target
    ) {
      for (let i = 0; i < board.pieceCanJump.length; i++) {
        board.pieceCanJump[i].classList.add("canJump");
      }
      game.showPopup();
      if (selectedPiece.target) {
        selectedPiece.target.classList.remove("selected");
      }

      board.cellsToMove.forEach((element) =>
        element.element.removeEventListener("click", board.cellsToMoveHandler)
      );
      board.cellsToMoveKing.forEach((element) =>
        element.element.removeEventListener(
          "click",
          board.cellsToKingMoveHandler
        )
      );

      if (board.cellsToMove.length) {
        board.cellsToMove.forEach((element) =>
          element.element.classList.remove("possibleMove")
        );
      }
      game.reloadPiecesEventListeners();
      return;
    }

    for (let i = 0; i < board.cellsToMove.length; i++) {
      if (selectedPiece.option === board.cellsToMove[i].element) {
        move.renderMove(cell, index, target, i);
      }
    }

    if (selectedPiece.option === selectedPiece.target) {
      selectedPiece.target.removeEventListener(
        "click",
        board.cellsToKingMoveHandler
      );
      click.cleanMemoryClick();
      game.reloadPiecesEventListeners();
      return;
    }

    selectedPiece.target.removeEventListener(
      "click",
      board.cellsToKingMoveHandler
    );
    game.changeTurn();
    game.checkIfWin();
  }
}

const kingMove = new KingMove();
export { kingMove };
