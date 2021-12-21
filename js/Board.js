import { UI } from "./UI.js";
import { Cell } from "./Cell.js";
import { Piece } from "./Piece.js";

class Board extends UI {
  config = {
    number: 64,
    pieces: 24,
  };

  boardOfCells = null;
  cells = [];
  redPieces = [];
  blackPieces = [];

  cellsToJump = [];
  cellsToMove = [];
  cellsToClean = [];

  cellsToMoveHandler = null;
  cellsToKingMoveHandler = null;
  cellsToJumpHandler = null;

  cellsToCleanKing = [];
  cellsToJumpKing = [];
  cellsToMoveKing = [];
  cellsToCheckMove = [];

  cellsToKingJumpHelper = [];
  cellsToKingMoveHelper = [];

  sum = 0;
  pieceCanJump = [];
  pieceCanMove = [0];

  turn = true;

  handleElements() {
    this.boardOfCells = this.getElement(this.UISelectors.board);
  }

  generateCells() {
    this.cells.length = 0;
    this.cells.number = 1;
    for (let n = 0; n < this.config.number; n++) {
      this.cells.push(new Cell(this.cells.number));
      this.cells.number++;
    }
  }

  clearBoard() {
    while (this.boardOfCells.firstChild) {
      this.boardOfCells.removeChild(this.boardOfCells.lastChild);
    }
  }

  renderBoard() {
    this.cells.forEach((cell) => {
      this.boardOfCells.insertAdjacentHTML("beforeend", cell.createElement());
      cell.element = cell.getElement(cell.selector);
    });
  }

  colorBoard() {
    let brownCell = 1;

    while (brownCell < this.config.number) {
      const cell = this.cells[brownCell];
      cell.isBrown = true;
      cell.brownCell();
      brownCell += 2;

      if (
        brownCell == 9 ||
        brownCell == 25 ||
        brownCell == 41 ||
        brownCell == 57
      ) {
        brownCell--;
      } else if (brownCell == 16 || brownCell == 32 || brownCell == 48) {
        brownCell++;
      }
    }
  }

  addKingCreationCells() {
    const cellCreatesKingIndex = [1, 3, 5, 7, 56, 58, 60, 62];

    for (let i = 0; i < 4; i++) {
      let cell = this.cells[cellCreatesKingIndex[i]];
      cell.createBlackKing = true;
    }
    for (let i = 4; i < 8; i++) {
      let cell = this.cells[cellCreatesKingIndex[i]];
      cell.createRedKing = true;
    }
  }

  generateRedPieces() {
    this.redPieces.length = 0;
    this.redPieces.number = 2;
    for (let n = 0; n < this.config.pieces; n += 2) {
      this.redPieces.push(new Piece(this.redPieces.number));
      this.redPieces.number += 2;
      if (this.redPieces.number == 10) {
        this.redPieces.number--;
      } else if (this.redPieces.number == 17) {
        this.redPieces.number++;
      }
    }
  }

  generateBlackPieces() {
    this.blackPieces.length = 0;
    this.blackPieces.number = 41;
    for (let n = 41; n < this.config.number; n += 2) {
      this.blackPieces.push(new Piece(this.blackPieces.number));
      this.blackPieces.number += 2;
      if (this.blackPieces.number == 49) {
        this.blackPieces.number++;
      } else if (this.blackPieces.number == 58) {
        this.blackPieces.number--;
      }
    }
  }

  renderRedPieces() {
    this.redPieces.forEach((piece) => {
      const index = piece["n"];
      piece.isRed = true;
      this.cells[index - 1].element.insertAdjacentHTML(
        "beforeend",
        piece.createRedPieceElement()
      );
      this.cells[index - 1].hasPiece = true;
      this.cells[index - 1].hasRed = true;
      piece.element = piece.getElement(piece.selector);
    });
  }

  renderBlackPieces() {
    this.blackPieces.forEach((piece) => {
      const index = piece["n"];
      piece.isBlack = true;
      this.cells[index - 1].element.insertAdjacentHTML(
        "beforeend",
        piece.createBlackPieceElement()
      );
      this.cells[index - 1].hasPiece = true;
      this.cells[index - 1].hasBlack = true;
      piece.element = piece.getElement(piece.selector);
    });
  }

  createBoard() {
    this.handleElements();
    this.clearBoard();
    this.generateCells();
    this.renderBoard();
    this.colorBoard();
    this.addKingCreationCells();
    this.generateBlackPieces();
    this.generateRedPieces();
    this.renderBlackPieces();
    this.renderRedPieces();
  }
}

const board = new Board();

export { board };
