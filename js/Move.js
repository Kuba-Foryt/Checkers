import { game } from "./Game.js";
import { board } from "./Board.js";
import { selectedPiece } from "./SelectedPiece.js";
import { kingMove } from "./KingMove.js";
import { kingJump } from "./KingJump.js";
import { click } from "./Click.js";

class Move {
  checkIfAnyMoveIsPossible() {
    let piecesToCheck = [];
    game.turn ? (piecesToCheck = game.black) : (piecesToCheck = game.red);

    for (let i = 0; i < piecesToCheck.length; i++) {
      const index = parseInt(piecesToCheck[i].getAttribute("data-n"), 10);
      if (
        piecesToCheck[i].classList.contains("blackKing") ||
        piecesToCheck[i].classList.contains("redKing")
      ) {
        kingJump.createKingJumpBoards(index);
        kingMove.checkPossibleKingMoveHandler(index);
        if (board.cellsToMove.length) {
          board.pieceCanMove.push(piecesToCheck[i]);
        }
      } else {
        this.#checkPossibleMoveHandler(index);
        if (board.cellsToMove.length) {
          board.pieceCanMove.push(piecesToCheck[i]);
        }
      }
    }
  }

  #checkPossibleMoveHandler(index) {
    game.turn
      ? (board.cellsToCheckMove = [index - 8, index - 10])
      : (board.cellsToCheckMove = [index + 6, index + 8]);

    board.cellsToCheckMove.forEach((cellIndex) =>
      cellIndex > 0 &&
      cellIndex < 63 &&
      board.cells[cellIndex].isBrown &&
      !board.cells[cellIndex].hasPiece
        ? board.cellsToMove.push(board.cells[cellIndex])
        : null
    );
  }

  checkPossibleMove(index) {
    this.#checkPossibleMoveHandler(index);

    if (!board.cellsToMove.length) {
      selectedPiece.target.classList.remove("selected");
      return;
    }

    this.handlePieceMovement(
      selectedPiece.cell,
      selectedPiece.index,
      selectedPiece.target
    );
  }

  handlePieceMovement(cell, index, target) {
    board.cellsToMoveHandler = this.#movePiece.bind(this, cell, index, target);

    board.cellsToMove.forEach((element) =>
      element.element.classList.add("possibleMove")
    );
    board.cellsToMove.forEach((element) =>
      element.element.addEventListener("click", board.cellsToMoveHandler)
    );

    selectedPiece.target.removeEventListener("click", click.handleCellClick);

    selectedPiece.target.addEventListener("click", board.cellsToMoveHandler);
  }

  renderMove(cell, index, target, i) {
    board.cellsToMove[i].hasPiece = true;
    board.cellsToMove[i].element.appendChild(target);
    cell.hasPiece = null;
    selectedPiece.target.classList.remove("selected");
    index = board.cellsToMove[i].n;
    target.setAttribute("data-n", index);
    game.moveWithoutCapture++;

    if (game.turn) {
      cell.hasBlack = null;
      board.cellsToMove[i].hasBlack = true;
    } else {
      cell.hasRed = null;
      board.cellsToMove[i].hasRed = true;
    }
  }

  #movePiece(cell, index, target, e) {
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
        this.renderMove(cell, index, target, i);
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

    this.checkIfMoveCreatesKing(selectedPiece.option, selectedPiece.target);

    selectedPiece.target.removeEventListener(
      "click",
      board.cellsToKingMoveHandler
    );
    board.cellsToMove.forEach((element) =>
      element.element.removeEventListener("click", board.cellsToKingMoveHandler)
    );
    board.cellsToMove.forEach((element) =>
      element.element.classList.remove("possibleMove")
    );
    game.changeTurn();
    game.checkIfWin();
  }

  checkIfMoveCreatesKing(option, target) {
    click.cleanMemoryClick();

    if (
      board.cells[option.getAttribute("data-n") - 1].createBlackKing &&
      target.classList.contains("black")
    ) {
      target.classList.add("blackKing");
      target.isBlackKing = true;
    } else if (
      board.cells[option.getAttribute("data-n") - 1].createRedKing &&
      target.classList.contains("red")
    ) {
      target.classList.add("redKing");
      target.isRedKing = true;
    }
  }
}

const move = new Move();
export { move };
