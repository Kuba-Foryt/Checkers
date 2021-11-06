import { UI } from "./UI.js";
import { Cell } from "./Cell.js";
import { Piece } from "./Piece.js";

class Game extends UI {
  #config = {
    rows: 8,
    cols: 8,
    number: 64,
    pieces: 24,
  };

  #board = null;
  #cells = [];
  #cellsElements = null;

  #redPieces = [];
  #blackPieces = [];

  #numberOfRows = null;
  #numberOfCols = null;

  initializeGame() {
    this.#handleElements();
    this.#newGame();
    this.#colorBoard();
  }

  #handleElements() {
    this.#board = this.getElement(this.UISelectors.board);
    this.#cellsElements = this.getElements(this.UISelectors.cell);
    // this.#cellsElements = this.getElement(this.UISelectors.cell);
  }

  #newGame(rows = this.#config.rows, cols = this.#config.cols) {
    this.#numberOfRows = rows;
    this.#numberOfCols = cols;

    this.#generateCells();
    this.#renderBoard();
    this.#generateRedPieces();
    this.#generateBlackPieces();
    this.#renderRedPieces();
    this.#renderBlackPieces();

    this.#cellsElements = this.getElements(this.UISelectors.cell);
  }

  #generateCells() {
    this.#cells.length = 0;
    this.#cells.number = 1;
    for (let n = 0; n < this.#config.number; n++) {
      this.#cells.push(new Cell(this.#cells.number));
      this.#cells.number++;
    }
  }

  #renderBoard() {
    while (this.#board.firstChild) {
      this.#board.removeChild(this.#board.lastChild);
    }
    this.#cells.forEach((cell) => {
      this.#board.insertAdjacentHTML("beforeend", cell.createElement());
      cell.element = cell.getElement(cell.selector);
    });
  }

  #colorBoard() {
    let brownCell = 1;

    while (brownCell < this.#config.number) {
      const cell = this.#cells[brownCell];
      // console.log(cell);

      const isBrown = cell.isBrown;

      if (!isBrown) {
        cell.isBrown = true;
        cell.brownCell();
      }
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
  // #colorBoard() {
  //   let brownCell = 1;

  //   while (brownCell < this.#config.number) {
  //     const cell = this.#cells[brownCell];
  //     // console.log(cell);
  //     brownCell += 2;

  //     if (
  //       brownCell == 9 ||
  //       brownCell == 25 ||
  //       brownCell == 41 ||
  //       brownCell == 57
  //     ) {
  //       brownCell--;
  //     } else if (brownCell == 16 || brownCell == 32 || brownCell == 48) {
  //       brownCell++;
  //     }

  //     const isBrown = cell.isBrown;

  //     if (!isBrown) {
  //       cell.isBrown = true;
  //       cell.brownCell();
  //     }
  //   }
  // }

  #generateRedPieces() {
    this.#redPieces.length = 0;
    this.#redPieces.number = 1;
    for (let n = 0; n < this.#config.pieces; n += 2) {
      this.#redPieces.push(new Piece(this.#redPieces.number));
      if (this.#redPieces.number == 7) {
        this.#redPieces.number--;
      } else if (this.#redPieces.number == 14) {
        this.#redPieces.number++;
      }
      this.#redPieces.number += 2;
    }
    // console.log(this.#pieces);
  }
  #generateBlackPieces() {
    this.#blackPieces.length = 0;
    this.#blackPieces.number = 40;
    for (let n = 41; n < this.#config.number; n += 2) {
      this.#blackPieces.push(new Piece(this.#blackPieces.number));
      if (this.#blackPieces.number == 55) {
        this.#blackPieces.number--;
      } else if (this.#blackPieces.number == 46) {
        this.#blackPieces.number++;
      }
      this.#blackPieces.number += 2;
    }
  }

  #renderRedPieces() {
    this.#redPieces.forEach((piece) => {
      const index = piece["n"];
      // console.log(index);
      // console.log(this.#cells[index].element);
      this.#cells[index].element.insertAdjacentHTML(
        "beforeend",
        piece.createRedPieceElement()
      );
      this.#cells[index].hasPiece = true;
      // console.log(this.#cells[index]);
      piece.element = piece.getElement(piece.selector);
    });
  }
  #renderBlackPieces() {
    this.#blackPieces.forEach((piece) => {
      const index = piece["n"];
      // console.log(this.#cells[index].element);
      this.#cells[index].element.insertAdjacentHTML(
        "beforeend",
        piece.createBlackPieceElement()
      );
      // console.log(this.#cells[index]);

      piece.element = piece.getElement(piece.selector);
    });

    console.log(this.#redPieces);
  }
}

window.onload = function () {
  const game = new Game();

  game.initializeGame();
};
