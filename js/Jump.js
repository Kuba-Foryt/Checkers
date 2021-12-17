import { game } from "./Game.js";
import { board } from "./Board.js";
import { selectedPiece } from "./SelectedPiece.js";
import { move } from "./Move.js";
import { click } from "./Click.js";
import { kingJump } from "./KingJump.js";

class Jump {
  checkIfAnyJumpIsPossible() {
    let piecesToCheck = [];
    game.turn ? (piecesToCheck = game.black) : (piecesToCheck = game.red);

    for (let i = 0; i < piecesToCheck.length; i++) {
      const index = parseInt(piecesToCheck[i].getAttribute("data-n"), 10);
      if (
        piecesToCheck[i].classList.contains("blackKing") ||
        piecesToCheck[i].classList.contains("redKing")
      ) {
        kingJump.checkPossibleKingJumpHandler(index);
        if (board.cellsToJump.length) {
          board.pieceCanJump.push(piecesToCheck[i]);
        }
      } else {
        this.#checkIfAnyPossiblePieceJump(index);
        if (board.cellsToJump.length) {
          board.pieceCanJump.push(piecesToCheck[i]);
        }
      }
      board.cellsToJump = [];
      board.cellsToClean = [];
      board.cellsToJumpKing = [];
      board.cellsToCleanKing = [];
    }
  }

  #checkIfAnyPossiblePieceJump(index) {
    const pieceJumpBoard = [-19, -15, 13, 17];

    const pieceCheckBoard = [-10, -8, 6, 8];

    for (let i = 0; i < pieceJumpBoard.length; i++) {
      if (
        pieceJumpBoard[i] + index > 0 &&
        pieceJumpBoard[i] + index < 63 &&
        pieceCheckBoard[i] + index > 0 &&
        pieceCheckBoard[i] + index < 63
      ) {
        board.cellsToJump.push(board.cells[pieceJumpBoard[i] + index]);
        board.cellsToClean.push(board.cells[pieceCheckBoard[i] + index]);
      }
    }

    for (let i = 0; i < board.cellsToJump.length; i++) {
      if (
        !(
          board.cellsToJump[i].isBrown &&
          board.cellsToClean[i].isBrown &&
          board.cellsToClean[i].hasPiece &&
          !board.cellsToJump[i].hasPiece &&
          ((game.turn && board.cellsToClean[i].hasRed) ||
            (!game.turn && board.cellsToClean[i].hasBlack))
        )
      ) {
        const index = board.cellsToJump.indexOf(board.cellsToJump[i]);
        board.cellsToJump.splice(index, 1);
        board.cellsToClean.splice(index, 1);
        i--;
      }
    }
  }
  #selectPossibleJumpSpots(index) {
    const pieceJumpBoard = [-19, -15, 13, 17];
    const pieceCheckBoard = [-10, -8, 6, 8];

    for (let i = 0; i < pieceJumpBoard.length; i++) {
      if (
        pieceJumpBoard[i] + index > 0 &&
        pieceJumpBoard[i] + index < 63 &&
        pieceCheckBoard[i] + index > 0 &&
        pieceCheckBoard[i] + index < 63
      ) {
        board.cellsToJump.push(board.cells[pieceJumpBoard[i] + index]);
        board.cellsToClean.push(board.cells[pieceCheckBoard[i] + index]);
      }
    }

    for (let i = 0; i < board.cellsToJump.length; i++) {
      if (
        board.cellsToJump[i].isBrown &&
        board.cellsToClean[i].isBrown &&
        board.cellsToClean[i].hasPiece &&
        !board.cellsToJump[i].hasPiece &&
        ((game.turn && board.cellsToClean[i].hasRed) ||
          (!game.turn && board.cellsToClean[i].hasBlack))
      ) {
        board.cellsToJump[i].element.classList.add("possibleJump");
      } else {
        const index = board.cellsToJump.indexOf(board.cellsToJump[i]);
        board.cellsToJump.splice(index, 1);
        board.cellsToClean.splice(index, 1);
        i--;
      }
    }
  }

  checkPossibleJump(index) {
    this.#selectPossibleJumpSpots(index);

    if (!board.cellsToJump.length) {
      move.checkPossibleMove(selectedPiece.index);
      return;
    }

    this.handlePieceJump(
      selectedPiece.cell,
      selectedPiece.index,
      selectedPiece.target
    );
  }

  handlePieceJump(cell, index, target) {
    if (
      selectedPiece.target.classList.contains("blackKing") ||
      selectedPiece.target.classList.contains("redKing")
    ) {
      board.cellsToJumpHandler = kingJump.jumpKing.bind(
        this,
        cell,
        index,
        target
      );
    } else {
      board.cellsToJumpHandler = this.#jumpPiece.bind(
        this,
        cell,
        index,
        target
      );
    }
    board.cellsToJump.forEach((element) =>
      element.element.addEventListener("click", board.cellsToJumpHandler)
    );
    selectedPiece.target.addEventListener("click", board.cellsToJumpHandler);
    selectedPiece.target.removeEventListener("click", click.handleCellClick);
  }

  renderJump(cell, index, target, i) {
    board.cellsToJump[i].hasPiece = true;
    board.cellsToJump[i].element.appendChild(target);
    board.cellsToClean[i].hasPiece = false;
    board.cellsToClean[i].element.firstChild.remove();
    cell.hasPiece = null;
    target.classList.remove("selected");
    index = board.cellsToJump[i].n;
    target.setAttribute("data-n", index);
    game.moveWithoutCapture = 0;

    if (game.turn) {
      cell.hasBlack = null;
      board.cellsToClean[i].hasRed = null;
      board.cellsToJump[i].hasBlack = true;
      board.cellsToJump[i].hasPiece = true;
    } else {
      cell.hasRed = null;
      board.cellsToClean[i].hasBlack = null;
      board.cellsToJump[i].hasRed = true;
      board.cellsToJump[i].hasPiece = true;
    }
  }

  #jumpPiece(cell, index, target, e) {
    selectedPiece.option = e.target;
    for (let i = 0; i < board.cellsToJump.length; i++) {
      if (selectedPiece.option === board.cellsToJump[i].element) {
        this.renderJump(cell, index, target, i);
      }

      if (selectedPiece.option === selectedPiece.target) {
        selectedPiece.target.removeEventListener(
          "click",
          board.cellsToJumpHandler
        );
        click.cleanMemoryClick();
        game.reloadPiecesEventListeners();
        return;
      }
    }

    this.removePropertiesAfterJump();
    this.#checkIfNextJumpIsPossible(selectedPiece.option, target);
    game.checkIfWin();
  }

  removePropertiesAfterJump() {
    selectedPiece.target.removeEventListener("click", board.cellsToJumpHandler);
    board.cellsToJump.forEach((element) =>
      element.element.removeEventListener("click", board.cellsToJumpHandler)
    );
    board.cellsToJump.forEach((element) =>
      element.element.classList.remove("possibleJump")
    );
  }

  #checkIfNextJumpIsPossible(option, target) {
    let kingOption = option;
    click.cleanMemoryClick();
    selectedPiece.target = target;
    selectedPiece.index = parseInt(
      selectedPiece.target.getAttribute("data-n"),
      10
    );

    selectedPiece.cell = board.cells[selectedPiece.index - 1];
    selectedPiece.target.classList.add("selected");

    this.#checkPossibleNextJump(
      selectedPiece.index,
      selectedPiece.target,
      kingOption
    );
  }

  #checkPossibleNextJump(index, target, kingOption) {
    this.#selectPossibleJumpSpots(index);

    if (!board.cellsToJump.length) {
      move.checkIfMoveCreatesKing(kingOption, target);
      selectedPiece.target.removeEventListener(
        "click",
        board.cellsToJumpHandler
      );
      game.changeTurn();
      return;
    }

    this.handlePieceJump(
      selectedPiece.cell,
      selectedPiece.index,
      selectedPiece.target
    );
  }
}

const jump = new Jump();
export { jump };
