import { game } from "./Game.js";
import { board } from "./Board.js";
import { selectedPiece } from "./SelectedPiece.js";
import { kingMove } from "./KingMove.js";
import { jump } from "./Jump.js";
import { click } from "./Click.js";

class KingJump {
  checkPossibleKingJump(index) {
    this.checkPossibleKingJumpHandler(index);

    board.cellsToJump.forEach((element) =>
      element.element.classList.add("possibleJump")
    );

    if (!board.cellsToJump.length) {
      kingMove.checkPossibleKingMove();
      return;
    }

    jump.handlePieceJump(
      selectedPiece.cell,
      selectedPiece.index,
      selectedPiece.target
    );
  }

  checkPossibleKingJumpHandler(index) {
    this.createKingJumpBoards(index);

    //left up
    for (let i = 0; i < 5; i++) {
      this.#checkLeftTopDirection(i);
    }

    //right up
    for (let i = 5; i < 11; i++) {
      this.#checkRightTopDirection(i);
    }

    //left down
    for (let i = 11; i < 17; i++) {
      this.#checkLeftBottomDirection(i);
    }

    //right down
    for (let i = 17; i < 22; i++) {
      this.#checkRightBottomDirection(i);
    }
  }

  createKingJumpBoards(index) {
    const kingJumpBoard = [
      -19, -28, -37, -46, -55, -15, -22, -29, -36, -43, -50, 13, 20, 27, 34, 41,
      48, 17, 26, 35, 44, 53,
    ];

    const kingCheckBoard = [
      -10, -19, -28, -37, -46, -8, -15, -22, -29, -36, -43, 6, 13, 20, 27, 34,
      41, 8, 17, 26, 35, 44,
    ];

    for (let i = 0; i < kingJumpBoard.length; i++) {
      kingJumpBoard[i] + index > 0 && kingJumpBoard[i] + index < 63
        ? board.cellsToJumpKing.push(board.cells[kingJumpBoard[i] + index])
        : board.cellsToJumpKing.push(board.cells[0]);
    }
    for (let i = 0; i < kingCheckBoard.length; i++) {
      kingCheckBoard[i] + index > 0 && kingCheckBoard[i] + index < 63
        ? board.cellsToCleanKing.push(board.cells[kingCheckBoard[i] + index])
        : board.cellsToCleanKing.push(board.cells[0]);
    }
  }

  #checkLeftTopDirection(i) {
    if (
      board.cellsToJumpKing[i].isBrown &&
      !board.cellsToJumpKing[i].hasPiece
    ) {
      for (let j = 0; j < i + 1; j++) {
        this.#checkOverjumpedCells(j);
      }
      this.#selectPossibleKingJumpSpots(i);
    }
  }
  #checkRightTopDirection(i) {
    if (
      board.cellsToJumpKing[i].isBrown &&
      !board.cellsToJumpKing[i].hasPiece
    ) {
      for (let j = 5; j < i + 1; j++) {
        this.#checkOverjumpedCells(j);
      }
      this.#selectPossibleKingJumpSpots(i);
    }
  }
  #checkLeftBottomDirection(i) {
    if (
      board.cellsToJumpKing[i].isBrown &&
      !board.cellsToJumpKing[i].hasPiece
    ) {
      for (let j = 11; j < i + 1; j++) {
        this.#checkOverjumpedCells(j);
      }
      this.#selectPossibleKingJumpSpots(i);
    }
  }
  #checkRightBottomDirection(i) {
    if (
      board.cellsToJumpKing[i].isBrown &&
      !board.cellsToJumpKing[i].hasPiece
    ) {
      for (let j = 17; j < i + 1; j++) {
        this.#checkOverjumpedCells(j);
      }
      this.#selectPossibleKingJumpSpots(i);
    }
  }

  #checkOverjumpedCells(j) {
    if (
      board.cellsToCleanKing[j].isBrown &&
      board.cellsToCleanKing[j].hasPiece &&
      ((game.turn && board.cellsToCleanKing[j].hasRed) ||
        (!game.turn && board.cellsToCleanKing[j].hasBlack))
    ) {
      board.cellsToKingJumpHelper.push(1);
    } else if (
      board.cellsToCleanKing[j].isBrown &&
      board.cellsToCleanKing[j].hasPiece &&
      ((game.turn && board.cellsToCleanKing[j].hasBlack) ||
        (!game.turn && board.cellsToCleanKing[j].hasRed))
    ) {
      board.cellsToKingJumpHelper.push(2);
    } else board.cellsToKingJumpHelper.push(0);
  }

  #selectPossibleKingJumpSpots(i) {
    board.sum = 0;
    if (board.cellsToKingJumpHelper.length) {
      for (let k = 0; k < board.cellsToKingJumpHelper.length; k++) {
        board.sum += board.cellsToKingJumpHelper[k];
      }
      if (board.sum === 1) {
        board.cellsToJump.push(board.cellsToJumpKing[i]);
        let cleanIndex = board.cellsToKingJumpHelper.indexOf(1);

        if (i <= 4) {
          cleanIndex = cleanIndex;
        } else if (i >= 5 && i < 11) {
          cleanIndex += 5;
        } else if (i >= 11 && i < 17) {
          cleanIndex += 11;
        } else if (i >= 17) {
          cleanIndex += 17;
        }

        board.cellsToClean.push(board.cellsToCleanKing[cleanIndex]);
      }
      board.cellsToKingJumpHelper = [];
    }
  }

  jumpKing(cell, index, target, e) {
    selectedPiece.option = e.target;

    for (let i = 0; i < board.cellsToJump.length; i++) {
      if (selectedPiece.option === board.cellsToJump[i].element) {
        jump.renderJump(cell, index, target, i);
      }
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

    jump.removePropertiesAfterJump();
    kingJump.checkIfNextKingJumpIsPossible(target);
    game.checkIfWin();
  }

  checkIfNextKingJumpIsPossible(target) {
    click.cleanMemoryClick();
    selectedPiece.target = target;
    selectedPiece.index = parseInt(
      selectedPiece.target.getAttribute("data-n"),
      10
    );

    selectedPiece.cell = board.cells[selectedPiece.index - 1];
    selectedPiece.target.classList.add("selected");

    this.#checkPossibleNextKingJump(selectedPiece.index);
  }

  #checkPossibleNextKingJump(index) {
    this.checkPossibleKingJumpHandler(index);

    board.cellsToJump.forEach((element) =>
      element.element.classList.add("possibleJump")
    );

    if (!board.cellsToJump.length) {
      selectedPiece.target.removeEventListener(
        "click",
        board.cellsToJumpHandler
      );
      game.changeTurn();
      return;
    }

    jump.handlePieceJump(
      selectedPiece.cell,
      selectedPiece.index,
      selectedPiece.target
    );
  }
}

const kingJump = new KingJump();
export { kingJump };
