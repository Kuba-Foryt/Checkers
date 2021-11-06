import { UI } from "./UI.js";
import { Cell } from "./Cell.js";
import { Piece } from "./Piece.js";
import { Timer } from "./Timer.js";

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
  #cellsElement = [];
  #cellsToJump = [];
  #cellsToMove = [];
  #cellsToCheck = [];
  #cellsToMoveHandler = null;
  #cellsToKingMoveHandler = null;
  #cellsToJumpHandler = null;

  #cellsToCheckKing = [];
  #cellsToJumpKing = [];
  #cellsToMoveKing = [];
  #cellsToCheckKingMove = [];

  #cellsToClean = [];
  #cellsToKingJumpHelper = [];
  #cellsToKingMoveHelper = [];

  #sum = 0;
  #moveWithoutCapture = 0;

  #selectedPiece = {
    cell: null,
    index: null,
    target: null,
    pickedPiece: null,
    option: null,
  };

  #redPieces = [];
  #blackPieces = [];
  #pieces = [];
  #pieceCanJump = [];

  #black = [];
  #red = [];
  #blackAmount = 12;
  #redAmount = 12;
  #turn = true;

  #redPlayer = null;
  #blackPlayer = null;
  #redCounter = null;
  #blackCounter = null;

  #starterModal = null;
  #starterBtn = null;
  #starterPlayer1 = null;
  #starterPlayer2 = null;
  #player1Name = null;
  #player2Name = null;
  #name1 = null;
  #name2 = null;

  #endgameModal = null;
  #endgameModalText = null;
  #endgameModalBtn = null;

  #redCountdown = null;
  #blackCountdown = null;

  initializeGame() {
    this.#handleElements();
    this.#newGame();
    this.#colorBoard();
  }

  #handleElements() {
    this.#board = this.getElement(this.UISelectors.board);
    this.#redPlayer = this.getElement(this.UISelectors.counter1);
    this.#blackPlayer = this.getElement(this.UISelectors.counter2);
    this.#name1 = this.getElement(this.UISelectors.name1);
    this.#name2 = this.getElement(this.UISelectors.name2);
    this.#starterModal = this.getElement(this.UISelectors.starterModal);
    this.#starterPlayer1 = this.getElement(
      this.UISelectors.starterModalPlayer1
    );
    this.#starterPlayer2 = this.getElement(
      this.UISelectors.starterModalPlayer2
    );
    this.#starterBtn = this.getElement(this.UISelectors.starterModalBtn);
    this.#endgameModal = this.getElement(this.UISelectors.endgameModal);
    this.#endgameModalText = this.getElement(this.UISelectors.endgameModalText);
    this.#endgameModalBtn = this.getElement(this.UISelectors.endgameModalBtn);

    // console.log(this);
    // this.#cellsElements = this.getElements(this.UISelectors.cell);
    // this.#cellsElements = this.getElement(this.UISelectors.cell);
  }

  #newGame() {
    this.#generateCells();
    this.#renderBoard();
    this.#colorBoard();
    this.#generateTimers();
    this.#renderTimers();
    this.#generateRedPieces();
    this.#generateBlackPieces();
    this.#renderRedPieces();
    this.#renderBlackPieces();
    this.#addKingCreationCells();

    this.#starterBtn.addEventListener("click", this.#startGame.bind(this));
  }

  #startGame(e) {
    e.preventDefault();
    // this.#renderTimers();
    this.#updateNames();
    this.#starterModal.classList.add("starter__modal--hidden");
    this.#cellsElements = this.getElements(this.UISelectors.cell);
    this.#addBlackPiecesEventListeners();
    this.#redCountdown = setInterval(this.#updateRedCountdown.bind(this), 1000);
    this.#blackCountdown = setInterval(
      this.#updateBlackCountdown.bind(this),
      1000
    );

    if (this.#turn) {
      clearInterval(this.#redCountdown);
    }

    this.#endgameModalBtn.addEventListener(
      "click",
      this.#restartGame.bind(this)
    );
  }

  #restartGame(e) {
    e.preventDefault();
    this.#cells = [];
    this.#redCounter = null;
    this.#blackCounter = null;
    this.#generateCells();
    this.#renderBoard();
    this.#colorBoard();
    this.#generateTimers();
    this.#renderTimers();
    this.#generateRedPieces();
    this.#generateBlackPieces();
    this.#renderRedPieces();
    this.#renderBlackPieces();
    this.#addKingCreationCells();
    this.createCustomKings();
    this.#turn = true;
    this.#endgameModal.classList.add("endgame__modal--hidden");
    this.#cellsElements = this.getElements(this.UISelectors.cell);
    this.#addBlackPiecesEventListeners();
    this.#blackCountdown = setInterval(
      this.#updateBlackCountdown.bind(this),
      1000
    );

    this.#endgameModalBtn.addEventListener("click", this.#restartGame);
  }

  #generateCells() {
    this.#cells.length = 0;
    this.#cells.number = 1;
    for (let n = 0; n < this.#config.number; n++) {
      this.#cells.push(new Cell(this.#cells.number));
      this.#cells.number++;
    }
  }

  #updateRedCountdown() {
    this.#redCounter.time--;
    this.#redCounter.minutes = Math.floor(this.#redCounter.time / 60);
    this.#redCounter.time % 60 > 9
      ? (this.#redCounter.seconds = this.#redCounter.time % 60)
      : (this.#redCounter.seconds = `0${this.#redCounter.time % 60}`);
    this.#redPlayer.firstChild.innerHTML = `${this.#redCounter.minutes}
  : ${this.#redCounter.seconds}`;
    this.#redCounter.time < 60
      ? (this.#redPlayer.firstChild.style.color = "red")
      : (this.#redPlayer.firstChild.style.color = "black");
    this.#checkIfWin();
  }

  #updateBlackCountdown() {
    this.#blackCounter.time--;
    this.#blackCounter.minutes = Math.floor(this.#blackCounter.time / 60);
    this.#blackCounter.time % 60 > 9
      ? (this.#blackCounter.seconds = this.#blackCounter.time % 60)
      : (this.#blackCounter.seconds = `0${this.#blackCounter.time % 60}`);
    this.#blackPlayer.firstChild.innerHTML = `${this.#blackCounter.minutes}
  : ${this.#blackCounter.seconds}`;
    this.#blackCounter.time < 60
      ? (this.#blackPlayer.firstChild.style.color = "red")
      : (this.#blackPlayer.firstChild.style.color = "black");

    this.#checkIfWin();
  }
  #updateNames() {
    this.#player1Name = this.#starterPlayer1.value;
    !this.#player1Name ? (this.#player1Name = "PLAYER 1") : this.#player1Name;
    this.#player2Name = this.#starterPlayer2.value;
    !this.#player2Name ? (this.#player2Name = "PLAYER 2") : this.#player2Name;
    this.#name2.innerHTML = this.#player1Name;
    this.#name1.innerHTML = this.#player2Name;
  }
  #generateTimers() {
    this.#redCounter = new Timer();
    this.#blackCounter = new Timer();

    this.#redPlayer.insertAdjacentHTML(
      "beforeend",
      this.#redCounter.createElement()
    );
    this.#blackPlayer.insertAdjacentHTML(
      "beforeend",
      this.#blackCounter.createElement()
    );
  }

  #renderTimers() {
    this.#name1.innerHTML = "PLAYER 2";
    this.#name2.innerHTML = "PLAYER 1";
    this.#redPlayer.firstChild.innerHTML = `${this.#redCounter.minutes}
    : 0${this.#redCounter.seconds}`;
    this.#blackPlayer.firstChild.innerHTML = `${this.#blackCounter.minutes}
    : 0${this.#blackCounter.seconds}`;
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

  createCustomKings() {
    this.#cells[44].element.firstChild.classList.add("blackKing");
    this.#cells[46].element.firstChild.classList.add("blackKing");
    this.#cells[19].element.firstChild.classList.add("redKing");
  }

  #addKingCreationCells() {
    const kingCells = [1, 3, 5, 7, 56, 58, 60, 62];

    for (let i = 0; i < 4; i++) {
      let cell = this.#cells[kingCells[i]];
      cell.element.classList.add("blackKingCell");
    }
    for (let i = 4; i < 8; i++) {
      let cell = this.#cells[kingCells[i]];
      cell.element.classList.add("redKingCell");
    }

    // this.createCustomKings();
  }

  #addBlackPiecesEventListeners() {
    this.#red = document.querySelectorAll(".red");
    this.#black = document.querySelectorAll(".black");
    this.#turn = true;
    this.#redAmount = this.#red.length;
    this.#blackAmount = this.#black.length;
    this.#black.forEach((element) => {
      element.addEventListener("click", this.#handleCellClick);
    });
    this.#red.forEach((element) => {
      element.removeEventListener("click", this.#handleCellClick);
    });
  }
  #addRedPiecesEventListeners() {
    this.#red = document.querySelectorAll(".red");
    this.#black = document.querySelectorAll(".black");
    this.#turn = false;
    this.#redAmount = this.#red.length;
    this.#blackAmount = this.#black.length;
    this.#red.forEach((element) => {
      element.addEventListener("click", this.#handleCellClick);
    });
    this.#black.forEach((element) => {
      element.removeEventListener("click", this.#handleCellClick);
    });
  }

  #generateRedPieces() {
    this.#redPieces.length = 0;
    this.#redPieces.number = 2;
    for (let n = 0; n < this.#config.pieces; n += 2) {
      this.#redPieces.push(new Piece(this.#redPieces.number));
      if (this.#redPieces.number == 8) {
        this.#redPieces.number--;
      } else if (this.#redPieces.number == 15) {
        this.#redPieces.number++;
      }
      this.#redPieces.number += 2;
    }
    this.#pieces.push(...this.#redPieces);
  }

  #generateBlackPieces() {
    this.#blackPieces.length = 0;
    this.#blackPieces.number = 41;
    for (let n = 41; n < this.#config.number; n += 2) {
      this.#blackPieces.push(new Piece(this.#blackPieces.number));
      if (this.#blackPieces.number == 56) {
        this.#blackPieces.number--;
      } else if (this.#blackPieces.number == 47) {
        this.#blackPieces.number++;
      }
      this.#blackPieces.number += 2;
    }
    this.#pieces.push(...this.#blackPieces);
  }

  #renderRedPieces() {
    this.#redPieces.forEach((piece) => {
      const index = piece["n"];
      piece.isRed = true;
      this.#cells[index - 1].element.insertAdjacentHTML(
        "beforeend",
        piece.createRedPieceElement()
      );
      this.#cells[index - 1].hasPiece = true;
      this.#cells[index - 1].hasRed = true;
      this.#cells[index - 1].element.classList.add("hasPiece");
      piece.element = piece.getElement(piece.selector);
    });
  }
  #renderBlackPieces() {
    this.#blackPieces.forEach((piece) => {
      const index = piece["n"];
      piece.isBlack = true;
      this.#cells[index - 1].element.insertAdjacentHTML(
        "beforeend",
        piece.createBlackPieceElement()
      );
      this.#cells[index - 1].hasPiece = true;
      this.#cells[index - 1].hasBlack = true;
      this.#cells[index - 1].element.classList.add("hasPiece");
      piece.element = piece.getElement(piece.selector);
    });
  }

  #handleCellClick = (e) => {
    if (this.#selectedPiece.target) {
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToMoveHandler
      );
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToKingMoveHandler
      );
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToJumpHandler
      );
    }

    // if (this.#pieceCanJump.length) {
    //   this.#pieceCanJump.forEach((element) =>
    //     element.classList.remove("canJump")
    //   );
    // }

    if (this.#turn) {
      this.#addBlackPiecesEventListeners();
    } else if (!this.#turn) {
      this.#addRedPiecesEventListeners();
    }

    if (this.#cellsToJump.length) {
      this.#cellsToJump.forEach((element) =>
        element.element.classList.remove("possibleJump")
      );
    }

    this.#cleanMemoryClick();

    this.#pieceCanJump = [];
    this.#checkIfAnyJumpIsPossible();

    this.#selectedPiece.target = e.target;
    this.#selectedPiece.pickedPiece = this.#selectedPiece.target;
    this.#selectedPiece.index = parseInt(
      this.#selectedPiece.target.getAttribute("data-n"),
      10
    );

    this.#selectedPiece.cell = this.#cells[this.#selectedPiece.index - 1];
    this.#selectedPiece.target.classList.add("selected");
    console.log(this.#selectedPiece.target);

    if (
      this.#selectedPiece.target.classList.contains("blackKing") ||
      this.#selectedPiece.target.classList.contains("redKing")
    ) {
      this.#checkPossibleKingJump(this.#selectedPiece.index);
    } else {
      this.#checkPossibleJump(this.#selectedPiece.index);
    }
  };

  #checkIfAnyJumpIsPossible() {
    let piecesToCheck = [];
    // console.log(this);
    if (this.#turn) {
      piecesToCheck = this.#black;
    } else if (!this.#turn) {
      piecesToCheck = this.#red;
    }

    console.log(piecesToCheck);

    for (let i = 0; i < piecesToCheck.length; i++) {
      const index = parseInt(piecesToCheck[i].getAttribute("data-n"), 10);
      // console.log(piecesToCheck);

      if (
        piecesToCheck[i].classList.contains("blackKing") ||
        piecesToCheck[i].classList.contains("redKing")
      ) {
        this.#checkPossibleKingJumpHandler(index);
        if (this.#cellsToJump.length) {
          this.#pieceCanJump.push(piecesToCheck[i]);
          console.log(this.#pieceCanJump);
          // piecesToCheck[i].classList.add("canJump");
        }
        this.#cellsToJump = [];
        this.#cellsToCheck = [];
        this.#cellsToJumpKing = [];
        this.#cellsToCheckKing = [];
      } else {
        this.#checkIfAnyPossiblePieceJump(index);
        if (this.#cellsToJump.length) {
          this.#pieceCanJump.push(piecesToCheck[i]);
          // piecesToCheck[i].classList.add("canJump");
          console.log(this.#pieceCanJump);
        }
        this.#cellsToJump = [];
        this.#cellsToCheck = [];
        // this.#checkPossibleJump(this.#selectedPiece.index);
      }
    }
  }

  #checkPossibleKingJump(index) {
    this.#checkPossibleKingJumpHandler(index);

    console.log(index);

    this.#cellsToJump.forEach((element) =>
      element.element.classList.add("possibleJump")
    );

    if (!this.#cellsToJump.length) {
      this.#checkPossibleKingMove();
      return;
    }

    this.#handlePieceJump(
      this.#selectedPiece.cell,
      this.#selectedPiece.index,
      this.#selectedPiece.target,
      this.#selectedPiece.pickedPiece
    );
  }

  #checkPossibleKingJumpHandler(index) {
    const kingJumpBoard = [
      index - 19,
      index - 28,
      index - 37,
      index - 46,
      index - 55,
      index - 15,
      index - 22,
      index - 29,
      index - 36,
      index - 43,
      index - 50,
      index + 13,
      index + 20,
      index + 27,
      index + 34,
      index + 41,
      index + 48,
      index + 17,
      index + 26,
      index + 35,
      index + 44,
      index + 53,
    ];

    const kingCheckBoard = [
      index - 10,
      index - 19,
      index - 28,
      index - 37,
      index - 46,
      index - 8,
      index - 15,
      index - 22,
      index - 29,
      index - 36,
      index - 43,
      index + 6,
      index + 13,
      index + 20,
      index + 27,
      index + 34,
      index + 41,
      index + 8,
      index + 17,
      index + 26,
      index + 35,
      index + 44,
    ];

    for (let i = 0; i < kingJumpBoard.length; i++) {
      kingJumpBoard[i] > 0 && kingJumpBoard[i] < 63
        ? this.#cellsToJumpKing.push(this.#cells[kingJumpBoard[i]])
        : this.#cellsToJumpKing.push(this.#cells[0]);
    }
    for (let i = 0; i < kingCheckBoard.length; i++) {
      kingCheckBoard[i] > 0 && kingCheckBoard[i] < 63
        ? this.#cellsToCheckKing.push(this.#cells[kingCheckBoard[i]])
        : this.#cellsToCheckKing.push(this.#cells[0]);
    }

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

  #checkPossibleKingMove() {
    // console.log(this.#selectedPiece.index);
    console.log(this.#cellsToCheckKing);
    this.#cellsToMoveKing = this.#cellsToCheckKing;
    this.#cellsToMoveKing.splice(5, 0, this.#cellsToJumpKing[4]);
    this.#cellsToMoveKing.splice(12, 0, this.#cellsToJumpKing[10]);
    this.#cellsToMoveKing.splice(19, 0, this.#cellsToJumpKing[16]);
    this.#cellsToMoveKing.push(this.#cellsToJumpKing[21]);
    console.log(this.#cellsToMoveKing);

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

    if (!this.#cellsToMove.length) {
      this.#cleanMemoryClick();
      this.#selectedPiece.target.classList.remove("selected");
      return;
    }

    this.#handleKingMovement(
      this.#selectedPiece.cell,
      this.#selectedPiece.index,
      this.#selectedPiece.target,
      this.#selectedPiece.pickedPiece
    );
  }

  #handleKingMovement(cell, index, target, pickedPiece) {
    this.#cellsToKingMoveHandler = this.#moveKing.bind(
      this,
      cell,
      index,
      target,
      pickedPiece
    );

    this.#cellsToMove.forEach((element) =>
      element.element.addEventListener("click", this.#cellsToKingMoveHandler)
    );
    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#handleCellClick
    );
    this.#selectedPiece.target.addEventListener(
      "click",
      this.#cellsToKingMoveHandler
    );
    this.#cellsToMove.forEach((element) =>
      element.element.classList.add("possibleMove")
    );
  }

  #moveKing(cell, index, target, pickedPiece, e) {
    this.#selectedPiece.option = e.target;

    if (
      this.#pieceCanJump.length &&
      this.#selectedPiece.option != this.#selectedPiece.target
    ) {
      console.log(this.#pieceCanJump);
      for (let i = 0; i < this.#pieceCanJump.length; i++) {
        this.#pieceCanJump[i].classList.add("canJump");
      }
      if (this.#selectedPiece.target) {
        this.#selectedPiece.target.classList.remove("selected");
      }

      this.#cellsToMove.forEach((element) =>
        element.element.removeEventListener("click", this.#cellsToMoveHandler)
      );
      this.#cellsToMoveKing.forEach((element) =>
        element.element.removeEventListener(
          "click",
          this.#cellsToKingMoveHandler
        )
      );

      if (this.#cellsToMove.length) {
        this.#cellsToMove.forEach((element) =>
          element.element.classList.remove("possibleMove")
        );
      }
      if (this.#turn) {
        this.#addBlackPiecesEventListeners();
      } else if (!this.#turn) {
        this.#addRedPiecesEventListeners();
      }

      // this.#pieceCanJump = [];
      return;
    }

    for (let i = 0; i < this.#cellsToMove.length; i++) {
      if (this.#selectedPiece.option === this.#cellsToMove[i].element) {
        this.#cellsToMove[i].hasPiece = true;
        this.#cellsToMove[i].element.appendChild(pickedPiece);
        this.#cellsToMove[i].element.classList.add("hasPiece");
        index = this.#cellsToMove[i].n;
        pickedPiece.setAttribute("data-n", index);
        if (this.#turn) {
          cell.hasBlack = null;
          this.#cellsToMove[i].hasBlack = true;
        } else {
          cell.hasRed = null;
          this.#cellsToMove[i].hasRed = true;
        }
      }
    }

    if (this.#selectedPiece.option === this.#selectedPiece.target) {
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToKingMoveHandler
      );

      this.#cleanMemoryClick();

      if (this.#turn) {
        this.#addBlackPiecesEventListeners();
      } else if (!this.#turn) {
        this.#addRedPiecesEventListeners();
      }
      return;
    }
    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#cellsToKingMoveHandler
    );
    target.classList.remove("selected");
    this.#selectedPiece.cell.element.classList.remove("hasPiece");

    this.#cellsToMove.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToKingMoveHandler)
    );
    this.#cellsToMove.forEach((element) =>
      element.element.classList.remove("possibleMove")
    );

    cell.hasPiece = null;

    this.#moveWithoutCapture++;

    if (this.#turn) {
      this.#addRedPiecesEventListeners();
      this.#redCountdown = setInterval(
        this.#updateRedCountdown.bind(this),
        1000
      );
      clearInterval(this.#blackCountdown);
    } else if (!this.#turn) {
      this.#addBlackPiecesEventListeners();
      this.#blackCountdown = setInterval(
        this.#updateBlackCountdown.bind(this),
        1000
      );
      clearInterval(this.#redCountdown);
    }

    this.#checkIfWin();
  }

  #checkMoveLeftTopDirection(i) {
    this.#cellsToKingMoveHelper = [];
    if (
      this.#cellsToMoveKing[i].isBrown &&
      !this.#cellsToMoveKing[i].hasPiece
    ) {
      for (let j = 0; j < i + 1; j++) {
        if (
          this.#cellsToMoveKing[j].isBrown &&
          !this.#cellsToMoveKing[j].hasPiece
        ) {
          this.#cellsToKingMoveHelper.push(0);
        } else {
          this.#cellsToKingMoveHelper.push(1);
        }
      }
      this.#selectPossibleMoveSpots(i);
      console.log(this.#cellsToMoveKing[i].element);
    }
  }
  #checkMoveRightTopDirection(i) {
    this.#cellsToKingMoveHelper = [];
    if (
      this.#cellsToMoveKing[i].isBrown &&
      !this.#cellsToMoveKing[i].hasPiece
    ) {
      for (let j = 6; j < i + 1; j++) {
        if (
          this.#cellsToMoveKing[j].isBrown &&
          !this.#cellsToMoveKing[j].hasPiece
        ) {
          this.#cellsToKingMoveHelper.push(0);
        } else {
          this.#cellsToKingMoveHelper.push(1);
        }

        // console.log(this.#cellsToMoveKing[j].element);
      }
      this.#selectPossibleMoveSpots(i);
      console.log(this.#cellsToMoveKing[i].element);
    }
  }
  #checkMoveLeftBottomDirection(i) {
    this.#cellsToKingMoveHelper = [];
    if (
      this.#cellsToMoveKing[i].isBrown &&
      !this.#cellsToMoveKing[i].hasPiece
    ) {
      for (let j = 13; j < i + 1; j++) {
        if (
          this.#cellsToMoveKing[j].isBrown &&
          !this.#cellsToMoveKing[j].hasPiece
        ) {
          this.#cellsToKingMoveHelper.push(0);
        } else {
          this.#cellsToKingMoveHelper.push(1);
        }
      }
      this.#selectPossibleMoveSpots(i);
      console.log(this.#cellsToMoveKing[i].element);
    }
  }
  #checkMoveRightBottomDirection(i) {
    this.#cellsToKingMoveHelper = [];
    if (
      this.#cellsToMoveKing[i].isBrown &&
      !this.#cellsToMoveKing[i].hasPiece
    ) {
      for (let j = 20; j < i + 1; j++) {
        if (
          this.#cellsToMoveKing[j].isBrown &&
          !this.#cellsToMoveKing[j].hasPiece
        ) {
          this.#cellsToKingMoveHelper.push(0);
        } else {
          this.#cellsToKingMoveHelper.push(1);
        }
      }
      this.#selectPossibleMoveSpots(i);
      console.log(this.#cellsToMoveKing[i].element);
    }
  }

  #selectPossibleMoveSpots(i) {
    this.#sum = 0;
    if (this.#cellsToKingMoveHelper.length) {
      for (let k = 0; k < this.#cellsToKingMoveHelper.length; k++) {
        this.#sum += this.#cellsToKingMoveHelper[k];
      }
      if (!this.#sum) {
        this.#cellsToMove.push(this.#cellsToMoveKing[i]);
      }
    }
  }

  #checkLeftTopDirection(i) {
    if (
      this.#cellsToJumpKing[i].isBrown &&
      !this.#cellsToJumpKing[i].hasPiece
    ) {
      for (let j = 0; j < i + 1; j++) {
        this.#checkOverjumpedCells(j);
      }
      this.#selectPossibleKingJumpSpots(i);
    }
  }
  #checkRightTopDirection(i) {
    if (
      this.#cellsToJumpKing[i].isBrown &&
      !this.#cellsToJumpKing[i].hasPiece
    ) {
      for (let j = 5; j < i + 1; j++) {
        this.#checkOverjumpedCells(j);
      }
      this.#selectPossibleKingJumpSpots(i);
    }
  }
  #checkLeftBottomDirection(i) {
    if (
      this.#cellsToJumpKing[i].isBrown &&
      !this.#cellsToJumpKing[i].hasPiece
    ) {
      for (let j = 11; j < i + 1; j++) {
        this.#checkOverjumpedCells(j);
      }
      this.#selectPossibleKingJumpSpots(i);
    }
  }
  #checkRightBottomDirection(i) {
    if (
      this.#cellsToJumpKing[i].isBrown &&
      !this.#cellsToJumpKing[i].hasPiece
    ) {
      for (let j = 17; j < i + 1; j++) {
        this.#checkOverjumpedCells(j);
      }
      this.#selectPossibleKingJumpSpots(i);
    }
  }

  #checkOverjumpedCells(j) {
    // console.log(this.#cellsToCheckKing[j]);
    if (
      this.#cellsToCheckKing[j].isBrown &&
      this.#cellsToCheckKing[j].hasPiece &&
      ((this.#turn && this.#cellsToCheckKing[j].hasRed) ||
        (!this.#turn && this.#cellsToCheckKing[j].hasBlack))
    ) {
      this.#cellsToKingJumpHelper.push(1);
    } else if (
      this.#cellsToCheckKing[j].isBrown &&
      this.#cellsToCheckKing[j].hasPiece &&
      ((this.#turn && this.#cellsToCheckKing[j].hasBlack) ||
        (!this.#turn && this.#cellsToCheckKing[j].hasRed))
    ) {
      this.#cellsToKingJumpHelper.push(2);
    } else this.#cellsToKingJumpHelper.push(0);
  }

  #selectPossibleKingJumpSpots(i) {
    this.#sum = 0;
    if (this.#cellsToKingJumpHelper.length) {
      for (let k = 0; k < this.#cellsToKingJumpHelper.length; k++) {
        this.#sum += this.#cellsToKingJumpHelper[k];
        // console.log(i, k, this.#cellsToKingJumpHelper, this.#sum);
      }
      if (this.#sum === 1) {
        this.#cellsToJump.push(this.#cellsToJumpKing[i]);
        let cleanIndex = this.#cellsToKingJumpHelper.indexOf(1);

        if (i <= 4) {
          cleanIndex = cleanIndex;
        } else if (i >= 5 && i < 11) {
          cleanIndex += 5;
        } else if (i >= 11 && i < 17) {
          cleanIndex += 11;
        } else if (i >= 17) {
          cleanIndex += 17;
        }

        this.#cellsToClean.push(this.#cellsToCheckKing[cleanIndex]);
      }
      this.#cellsToKingJumpHelper = [];
    }
  }
  #checkIfAnyPossiblePieceJump(index) {
    const pieceJumpBoard = [index - 19, index - 15, index + 13, index + 17];

    const pieceCheckBoard = [index - 10, index - 8, index + 6, index + 8];

    for (let i = 0; i < pieceJumpBoard.length; i++) {
      if (
        pieceJumpBoard[i] > 0 &&
        pieceJumpBoard[i] < 63 &&
        pieceCheckBoard[i] > 0 &&
        pieceCheckBoard[i] < 63
      ) {
        this.#cellsToJump.push(this.#cells[pieceJumpBoard[i]]);
        this.#cellsToCheck.push(this.#cells[pieceCheckBoard[i]]);
      }
    }

    for (let i = 0; i < this.#cellsToJump.length; i++) {
      // console.log(this.#cellsToCheck[i]);
      // console.log(
      //   pieceJumpBoard,
      //   pieceCheckBoard,
      //   this.#cellsToJump,
      //   this.#cellsToCheck,
      //   this.#cellsToJump[i],
      //   this.#cellsToCheck[i],
      //   !(
      //     this.#cellsToJump[i].isBrown &&
      //     this.#cellsToCheck[i].isBrown &&
      //     this.#cellsToCheck[i].hasPiece &&
      //     !this.#cellsToJump[i].hasPiece &&
      //     ((this.#turn && this.#cellsToCheck[i].hasRed) ||
      //       // &&!this.#cellsToCheck[i].element.firstChild.classList.contains("blackKing")
      //       (!this.#turn && this.#cellsToCheck[i].hasBlack))
      //   )
      // );
      if (
        !(
          (
            this.#cellsToJump[i].isBrown &&
            this.#cellsToCheck[i].isBrown &&
            this.#cellsToCheck[i].hasPiece &&
            !this.#cellsToJump[i].hasPiece &&
            ((this.#turn && this.#cellsToCheck[i].hasRed) ||
              // &&!this.#cellsToCheck[i].element.firstChild.classList.contains("blackKing")
              (!this.#turn && this.#cellsToCheck[i].hasBlack))
          )
          // &&!this.#cellsToCheck[i].element.firstChild.classList.contains("redKing")
        )
      ) {
        const index = this.#cellsToJump.indexOf(this.#cellsToJump[i]);
        this.#cellsToJump.splice(index, 1);
        this.#cellsToCheck.splice(index, 1);
        i--;
      }
    }
  }
  #selectPossibleJumpSpots(index) {
    const pieceJumpBoard = [index - 19, index - 15, index + 13, index + 17];

    const pieceCheckBoard = [index - 10, index - 8, index + 6, index + 8];

    for (let i = 0; i < pieceJumpBoard.length; i++) {
      if (
        pieceJumpBoard[i] > 0 &&
        pieceJumpBoard[i] < 63 &&
        pieceCheckBoard[i] > 0 &&
        pieceCheckBoard[i] < 63
      ) {
        this.#cellsToJump.push(this.#cells[pieceJumpBoard[i]]);
        this.#cellsToCheck.push(this.#cells[pieceCheckBoard[i]]);
      }
    }

    for (let i = 0; i < this.#cellsToJump.length; i++) {
      if (
        this.#cellsToJump[i].isBrown &&
        this.#cellsToCheck[i].isBrown &&
        this.#cellsToCheck[i].hasPiece &&
        !this.#cellsToJump[i].hasPiece &&
        ((this.#turn && this.#cellsToCheck[i].hasRed) ||
          (!this.#turn && this.#cellsToCheck[i].hasBlack))
      ) {
        // console.log(pieceJumpBoard[i]);
        this.#cellsToJump[i].element.classList.add("possibleJump");
      } else {
        const index = this.#cellsToJump.indexOf(this.#cellsToJump[i]);
        this.#cellsToJump.splice(index, 1);
        this.#cellsToCheck.splice(index, 1);
        i--;
      }
    }
  }

  #checkPossibleJump(index) {
    this.#selectPossibleJumpSpots(index);

    if (!this.#cellsToJump.length) {
      this.#checkPossibleMove(this.#selectedPiece.index);
      return;
    }

    this.#handlePieceJump(
      this.#selectedPiece.cell,
      this.#selectedPiece.index,
      this.#selectedPiece.target,
      this.#selectedPiece.pickedPiece
    );
  }

  #handlePieceJump(cell, index, target, pickedPiece) {
    if (
      this.#selectedPiece.target.classList.contains("blackKing") ||
      this.#selectedPiece.target.classList.contains("redKing")
    ) {
      this.#cellsToJumpHandler = this.#jumpKing.bind(
        this,
        cell,
        index,
        target,
        pickedPiece
      );
      this.#selectedPiece.target.addEventListener(
        "click",
        this.#cellsToJumpHandler
      );
    } else {
      this.#cellsToJumpHandler = this.#jumpPiece.bind(
        this,
        cell,
        index,
        target,
        pickedPiece
      );
      this.#selectedPiece.target.addEventListener(
        "click",
        this.#cellsToJumpHandler
      );
    }
    this.#cellsToJump.forEach((element) =>
      element.element.addEventListener("click", this.#cellsToJumpHandler)
    );
    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#handleCellClick
    );
  }

  #jumpKing(cell, index, target, pickedPiece, e) {
    this.#selectedPiece.option = e.target;
    console.log(this.#selectedPiece.option);

    for (let i = 0; i < this.#cellsToJump.length; i++) {
      if (this.#selectedPiece.option === this.#cellsToJump[i].element) {
        this.#cellsToJump[i].hasPiece = true;
        this.#cellsToJump[i].element.appendChild(pickedPiece);
        this.#cellsToJump[i].element.classList.add("hasPiece");
        this.#cellsToClean[i].hasPiece = false;
        this.#cellsToClean[i].element.classList.remove("hasPiece");
        this.#cellsToClean[i].element.firstChild.remove();

        if (this.#turn) {
          cell.hasBlack = null;
          this.#cellsToClean[i].hasRed = null;
          this.#cellsToJump[i].hasBlack = true;
        } else {
          cell.hasRed = null;
          this.#cellsToClean[i].hasBlack = null;
          this.#cellsToJump[i].hasRed = true;
        }
        index = this.#cellsToJump[i].n;
        pickedPiece.setAttribute("data-n", index);
      }
    }

    if (this.#selectedPiece.option === this.#selectedPiece.target) {
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToJumpHandler
      );

      this.#cleanMemoryClick();

      if (this.#turn) {
        this.#addBlackPiecesEventListeners();
      } else if (!this.#turn) {
        this.#addRedPiecesEventListeners();
      }
      return;
    }
    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#cellsToJumpHandler
    );
    this.#selectedPiece.cell.element.classList.remove("hasPiece");
    cell.hasPiece = null;
    target.classList.remove("selected");

    this.#cellsToJump.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToJumpHandler)
    );
    this.#cellsToJump.forEach((element) =>
      element.element.classList.remove("possibleJump")
    );

    this.#moveWithoutCapture = 0;

    if (this.#turn) {
      this.#redAmount--;
    } else if (!this.#turn) {
      this.#blackAmount--;
    }

    console.log(this.#redAmount, this.#blackAmount);

    this.#checkIfNextKingJumpIsPossible(pickedPiece);

    this.#checkIfWin();
  }

  #jumpPiece(cell, index, target, pickedPiece, e) {
    this.#selectedPiece.option = e.target;
    for (let i = 0; i < this.#cellsToJump.length; i++) {
      if (this.#selectedPiece.option === this.#cellsToJump[i].element) {
        this.#cellsToJump[i].hasPiece = true;
        this.#cellsToJump[i].element.appendChild(pickedPiece);
        this.#cellsToJump[i].element.classList.add("hasPiece");
        this.#cellsToCheck[i].hasPiece = false;
        this.#cellsToCheck[i].element.classList.remove("hasPiece");
        this.#cellsToCheck[i].element.firstChild.remove();
        if (this.#turn) {
          cell.hasBlack = null;
          this.#cellsToCheck[i].hasRed = null;
          this.#cellsToJump[i].hasBlack = true;
        } else {
          cell.hasRed = null;
          this.#cellsToCheck[i].hasBlack = null;
          this.#cellsToJump[i].hasRed = true;
        }
        index = this.#cellsToJump[i].n;
        pickedPiece.setAttribute("data-n", index);
      }

      if (this.#selectedPiece.option === this.#selectedPiece.target) {
        this.#selectedPiece.target.removeEventListener(
          "click",
          this.#cellsToJumpHandler
        );

        this.#cleanMemoryClick();

        if (this.#turn) {
          this.#addBlackPiecesEventListeners();
        } else if (!this.#turn) {
          this.#addRedPiecesEventListeners();
        }
        return;
      }

      if (this.#turn) {
        this.#redAmount--;
      } else {
        this.#blackAmount--;
      }

      console.log(this.#redAmount, this.#blackAmount);
    }

    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#cellsToJumpHandler
    );
    this.#selectedPiece.cell.element.classList.remove("hasPiece");
    cell.hasPiece = null;
    target.classList.remove("selected");

    let option = this.#selectedPiece.option;

    this.#cellsToJump.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToJumpHandler)
    );
    this.#cellsToJump.forEach((element) =>
      element.element.classList.remove("possibleJump")
    );

    this.#moveWithoutCapture = 0;

    this.#checkIfNextJumpIsPossible(option, pickedPiece);

    this.#checkIfWin();
  }

  #checkIfNextKingJumpIsPossible(pickedPiece) {
    this.#cleanMemoryClick();
    this.#selectedPiece.target = pickedPiece;
    this.#selectedPiece.pickedPiece = pickedPiece;
    this.#selectedPiece.index = parseInt(
      this.#selectedPiece.target.getAttribute("data-n"),
      10
    );

    this.#selectedPiece.cell = this.#cells[this.#selectedPiece.index - 1];
    this.#selectedPiece.target.classList.add("selected");

    this.#checkPossibleNextKingJump(this.#selectedPiece.index);
  }

  #checkPossibleNextKingJump(index) {
    const pieceJumpBoard = [
      index - 19,
      index - 28,
      index - 37,
      index - 46,
      index - 55,
      index - 15,
      index - 22,
      index - 29,
      index - 36,
      index - 43,
      index - 50,
      index + 13,
      index + 20,
      index + 27,
      index + 34,
      index + 41,
      index + 48,
      index + 17,
      index + 26,
      index + 35,
      index + 44,
      index + 53,
    ];

    const pieceCheckBoard = [
      index - 10,
      index - 19,
      index - 28,
      index - 37,
      index - 46,
      index - 8,
      index - 15,
      index - 22,
      index - 29,
      index - 36,
      index - 43,
      index + 6,
      index + 13,
      index + 20,
      index + 27,
      index + 34,
      index + 41,
      index + 8,
      index + 17,
      index + 26,
      index + 35,
      index + 44,
    ];

    for (let i = 0; i < pieceJumpBoard.length; i++) {
      pieceJumpBoard[i] > 0 && pieceJumpBoard[i] < 63
        ? this.#cellsToJumpKing.push(this.#cells[pieceJumpBoard[i]])
        : this.#cellsToJumpKing.push(this.#cells[0]);
    }
    for (let i = 0; i < pieceCheckBoard.length; i++) {
      pieceCheckBoard[i] > 0 && pieceCheckBoard[i] < 63
        ? this.#cellsToCheckKing.push(this.#cells[pieceCheckBoard[i]])
        : this.#cellsToCheckKing.push(this.#cells[0]);
    }

    // console.log(this.#cellsToJumpKing);
    // console.log(this.#cellsToCheckKing);

    // #boundaryConditions
    //left up
    for (let i = 0; i < 5; i++) {
      this.#checkLeftTopDirection(i);
    }

    // //right up
    for (let i = 5; i < 11; i++) {
      this.#checkRightTopDirection(i);
    }

    // // //left down
    for (let i = 11; i < 17; i++) {
      this.#checkLeftBottomDirection(i);
    }

    // // //right down
    for (let i = 17; i < 22; i++) {
      this.#checkRightBottomDirection(i);
    }

    this.#cellsToJump.forEach((element) =>
      element.element.classList.add("possibleJump")
    );

    if (!this.#cellsToJump.length) {
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToJumpHandler
      );
      this.#cleanMemoryClick();
      if (this.#turn) {
        this.#addRedPiecesEventListeners();
        this.#redCountdown = setInterval(
          this.#updateRedCountdown.bind(this),
          1000
        );
        clearInterval(this.#blackCountdown);
      } else if (!this.#turn) {
        this.#addBlackPiecesEventListeners();
        this.#blackCountdown = setInterval(
          this.#updateBlackCountdown.bind(this),
          1000
        );
        clearInterval(this.#redCountdown);
      }
      return;
    }

    this.#handlePieceJump(
      this.#selectedPiece.cell,
      this.#selectedPiece.index,
      this.#selectedPiece.target,
      this.#selectedPiece.pickedPiece
    );
  }

  #checkIfNextJumpIsPossible(option, pickedPiece) {
    let kingOption = option;
    this.#cleanMemoryClick();
    this.#selectedPiece.target = pickedPiece;
    this.#selectedPiece.pickedPiece = pickedPiece;
    this.#selectedPiece.index = parseInt(
      this.#selectedPiece.target.getAttribute("data-n"),
      10
    );

    this.#selectedPiece.cell = this.#cells[this.#selectedPiece.index - 1];
    this.#selectedPiece.target.classList.add("selected");

    this.#checkPossibleNextJump(
      this.#selectedPiece.index,
      this.#selectedPiece.pickedPiece,
      kingOption
    );
  }

  #checkPossibleNextJump(index, pickedPiece, kingOption) {
    this.#selectPossibleJumpSpots(index);

    if (!this.#cellsToJump.length) {
      this.#checkIfMoveCreatesKing(kingOption, pickedPiece);
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToJumpHandler
      );
      this.#cleanMemoryClick();
      if (this.#turn) {
        this.#addRedPiecesEventListeners();
        this.#redCountdown = setInterval(
          this.#updateRedCountdown.bind(this),
          1000
        );
        clearInterval(this.#blackCountdown);
      } else if (!this.#turn) {
        this.#addBlackPiecesEventListeners();
        this.#blackCountdown = setInterval(
          this.#updateBlackCountdown.bind(this),
          1000
        );
        clearInterval(this.#redCountdown);
      }
      return;
    }

    this.#handlePieceJump(
      this.#selectedPiece.cell,
      this.#selectedPiece.index,
      this.#selectedPiece.target,
      this.#selectedPiece.pickedPiece
    );
  }

  #checkPossibleMove(index) {
    // if (this.#turn) {
    //   this.#cellsToMove.push(this.#cells[index - 8]);
    //   this.#cellsToMove.push(this.#cells[index - 10]);
    // } else {
    //   this.#cellsToMove.push(this.#cells[index + 6]);
    //   this.#cellsToMove.push(this.#cells[index + 8]);
    // }

    // console.log(this.#cellsToMove);
    // for (let i = 0; i < this.#cellsToMove.length; i++) {
    //   if (this.#cellsToMove[i].isBrown && !this.#cellsToMove[i].hasPiece) {
    //     this.#cellsToMove[i].element.classList.add("possibleMove");
    //   } else {
    //     const index = this.#cellsToMove.indexOf(this.#cellsToMove[i]);
    //     this.#cellsToMove.splice(index, 1);
    //     i--;
    //   }
    // }

    if (this.#turn) {
      index - 8 > 0 && index - 8 < 63
        ? this.#cellsToMove.push(this.#cells[index - 8])
        : this.#cellsToMove.push(this.#cells[0]);
      index - 10 > 0 && index - 10 < 63
        ? this.#cellsToMove.push(this.#cells[index - 10])
        : this.#cellsToMove.push(this.#cells[0]);
    } else {
      index + 6 > 0 && index + 6 < 63
        ? this.#cellsToMove.push(this.#cells[index + 6])
        : this.#cellsToMove.push(this.#cells[0]);
      index + 8 > 0 && index + 8 < 63
        ? this.#cellsToMove.push(this.#cells[index + 8])
        : this.#cellsToMove.push(this.#cells[0]);
    }

    console.log(this.#cellsToMove);
    for (let i = 0; i < this.#cellsToMove.length; i++) {
      if (this.#cellsToMove[i].isBrown && !this.#cellsToMove[i].hasPiece) {
        this.#cellsToMove[i].element.classList.add("possibleMove");
      } else {
        const index = this.#cellsToMove.indexOf(this.#cellsToMove[i]);
        this.#cellsToMove.splice(index, 1);
        i--;
      }
    }

    if (!this.#cellsToMove.length) {
      this.#selectedPiece.target.classList.remove("selected");
      this.#selectedPiece.index = null;
      return;
    }

    this.#handlePieceMovement(
      this.#selectedPiece.cell,
      this.#selectedPiece.index,
      this.#selectedPiece.pickedPiece
    );
  }

  #handlePieceMovement(cell, index, pickedPiece) {
    this.#cellsToMoveHandler = this.#movePiece.bind(
      this,
      cell,
      index,
      pickedPiece
    );

    this.#cellsToMove.forEach((element) =>
      element.element.addEventListener("click", this.#cellsToMoveHandler)
    );

    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#handleCellClick
    );

    this.#selectedPiece.target.addEventListener(
      "click",
      this.#cellsToMoveHandler
    );
  }

  #movePiece(cell, index, pickedPiece, e) {
    this.#selectedPiece.option = e.target;

    if (
      this.#pieceCanJump.length &&
      this.#selectedPiece.option != this.#selectedPiece.target
    ) {
      console.log(this.#pieceCanJump);
      for (let i = 0; i < this.#pieceCanJump.length; i++) {
        this.#pieceCanJump[i].classList.add("canJump");
      }
      if (this.#selectedPiece.target) {
        this.#selectedPiece.target.classList.remove("selected");
      }

      this.#cellsToMove.forEach((element) =>
        element.element.removeEventListener("click", this.#cellsToMoveHandler)
      );
      this.#cellsToMoveKing.forEach((element) =>
        element.element.removeEventListener(
          "click",
          this.#cellsToKingMoveHandler
        )
      );

      if (this.#cellsToMove.length) {
        this.#cellsToMove.forEach((element) =>
          element.element.classList.remove("possibleMove")
        );
      }
      if (this.#turn) {
        this.#addBlackPiecesEventListeners();
      } else if (!this.#turn) {
        this.#addRedPiecesEventListeners();
      }

      // this.#pieceCanJump = [];
      return;
    }

    console.log(this.#selectedPiece.target);
    for (let i = 0; i < this.#cellsToMove.length; i++) {
      if (this.#selectedPiece.option === this.#cellsToMove[i].element) {
        this.#cellsToMove[i].hasPiece = true;
        this.#cellsToMove[i].element.appendChild(pickedPiece);
        this.#cellsToMove[i].element.classList.add("hasPiece");
        index = this.#cellsToMove[i].n;
        pickedPiece.setAttribute("data-n", index);
        if (this.#turn) {
          cell.hasBlack = null;
          this.#cellsToMove[i].hasBlack = true;
        } else {
          cell.hasRed = null;
          this.#cellsToMove[i].hasRed = true;
        }
      }
    }

    if (this.#selectedPiece.option === this.#selectedPiece.target) {
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToMoveHandler
      );

      this.#cleanMemoryClick();

      if (this.#turn) {
        this.#addBlackPiecesEventListeners();
      } else if (!this.#turn) {
        this.#addRedPiecesEventListeners();
      }
      return;
    }
    this.#checkIfMoveCreatesKing(
      this.#selectedPiece.option,
      this.#selectedPiece.pickedPiece
    );

    pickedPiece.setAttribute("data-n", index);

    cell.element.classList.remove("hasPiece");
    cell.hasPiece = null;

    this.#cellsToMove.forEach((i) =>
      i.element.classList.remove("possibleMove")
    );
    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#cellsToMoveHandler
    );
    this.#cellsToMove.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToMoveHandler)
    );

    this.#moveWithoutCapture++;

    if (this.#turn) {
      this.#addRedPiecesEventListeners();
      this.#redCountdown = setInterval(
        this.#updateRedCountdown.bind(this),
        1000
      );
      clearInterval(this.#blackCountdown);
    } else if (!this.#turn) {
      this.#addBlackPiecesEventListeners();
      this.#blackCountdown = setInterval(
        this.#updateBlackCountdown.bind(this),
        1000
      );
      clearInterval(this.#redCountdown);
    }

    this.#checkIfWin();
  }

  #checkIfMoveCreatesKing(option, pickedPiece) {
    this.#cleanMemoryClick();

    if (
      option.classList.contains("blackKingCell") &&
      pickedPiece.classList.contains("black")
    ) {
      pickedPiece.classList.add("blackKing");
      option.hasKing = true;
    } else if (
      option.classList.contains("redKingCell") &&
      pickedPiece.classList.contains("red")
    ) {
      pickedPiece.classList.add("redKing");
      option.hasKing = true;
    }
  }

  #cleanMemoryClick() {
    if (this.#selectedPiece.target) {
      this.#selectedPiece.target.classList.remove("selected");
    }

    this.#cellsToMove.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToMoveHandler)
    );
    this.#cellsToMoveKing.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToKingMoveHandler)
    );

    this.#selectedPiece.cell = null;
    this.#selectedPiece.index = null;
    // this.#selectedPiece.target = null;
    this.#selectedPiece.pickedPiece = null;
    this.#selectedPiece.option = null;

    this.#cellsToJump.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToJumpHandler)
    );

    if (this.#cellsToJump.length) {
      this.#cellsToJump.forEach((element) =>
        element.element.classList.remove("possibleJump")
      );
    }
    if (this.#cellsToMove.length) {
      this.#cellsToMove.forEach((element) =>
        element.element.classList.remove("possibleMove")
      );
    }
    if (this.#pieceCanJump.length) {
      this.#pieceCanJump.forEach((element) =>
        element.classList.remove("canJump")
      );
    }

    // this.#pieceCanJump = [];
    this.#cellsToMove = [];
    this.#cellsToJump = [];
    this.#cellsToClean = [];
    this.#cellsToCheck = [];
    this.#cellsToCheckKing = [];
    this.#cellsToJumpKing = [];
    this.#cellsToKingJumpHelper = [];
    this.#cellsToKingMoveHelper = [];
    this.#sum = 0;
  }

  #checkIfWin() {
    if (this.#redAmount === 0) {
      this.#endgameModal.classList.remove("endgame__modal--hidden");
      clearInterval(this.#blackCountdown);
      clearInterval(this.#redCountdown);
      this.#cleanMemoryClick();
      console.log(this.#redAmount, this.#blackAmount);
      this.#endgameModalText.textContent = `${this.#player1Name} WINS!`;
    } else if (this.#blackAmount === 0) {
      this.#endgameModal.classList.remove("endgame__modal--hidden");
      clearInterval(this.#blackCountdown);
      clearInterval(this.#redCountdown);
      this.#endgameModalText.textContent = `${this.#player2Name} WINS!`;
      this.#cleanMemoryClick();
      console.log(this.#redAmount, this.#blackAmount);
    } else if (this.#moveWithoutCapture === 15) {
      this.endgameMmodal.classList.remove("endgame__modal--hidden");
      clearInterval(this.#blackCountdown);
      clearInterval(this.#redCountdown);
      this.#endgameModalText.textContent = "NOBODY WINS!";
      this.#cleanMemoryClick();
    } else if (this.#redCounter.time == 0) {
      this.#endgameModal.classList.remove("endgame__modal--hidden");
      clearInterval(this.#blackCountdown);
      clearInterval(this.#redCountdown);
      this.#endgameModalText.textContent = `${this.#player1Name} WINS!`;
      this.#cleanMemoryClick();
    } else if (this.#blackCounter.time == 0) {
      this.#endgameModal.classList.remove("endgame__modal--hidden");
      clearInterval(this.#blackCountdown);
      clearInterval(this.#redCountdown);
      this.#endgameModalText.textContent = `${this.#player2Name} WINS!`;
      this.#cleanMemoryClick();
    }
  }
}
window.onload = function () {
  const game = new Game();

  game.initializeGame();
};
