import { UI } from "./UI.js";
import { Board } from "./Board.js";
import { Timer } from "./Timer.js";
import { Players } from "./Players.js";
import { ModalMustCapture } from "./ModalMustCapture.js";

class Game extends UI {
  config = {
    rows: 8,
    cols: 8,
    number: 64,
    pieces: 24,
  };

  board = new Board();
  players = new Players();
  modalMustCapture = new ModalMustCapture();

  #cellsToJump = [];
  #cellsToMove = [];
  #cellsToClean = [];
  #cellsToMoveHandler = null;
  #cellsToKingMoveHandler = null;
  #cellsToJumpHandler = null;

  #cellsToCleanKing = [];
  #cellsToJumpKing = [];
  #cellsToMoveKing = [];
  #cellsToCleanKingMove = [];
  #cellsToCleanMove = [];

  #cellsToKingJumpHelper = [];
  #cellsToKingMoveHelper = [];

  #sum = 0;
  #popup = false;
  english = true;
  #moveWithoutCapture = 0;

  #selectedPiece = {
    cell: null,
    index: null,
    target: null,
    pickedPiece: null,
    option: null,
  };

  redPieces = [];
  blackPieces = [];
  #pieceCanJump = [];

  #black = [];
  #red = [];
  #blackAmount = 12;
  #redAmount = 12;
  #turn = true;
  #winner = null;

  redTimer = null;
  blackTimer = null;
  redCounter = null;
  blackCounter = null;

  #starterModal = null;
  #starterBtn = null;
  #starterHeader = null;
  #starterLanguageBtn = null;

  starterPlayer1 = null;
  starterPlayer2 = null;
  player1Name = null;
  player2Name = null;
  name1 = null;
  name2 = null;
  languageBtn = null;

  #captureModalLanguageBtn = null;

  #endgameModal = null;
  #endgameModalText = null;
  #endgameModalBtn = null;
  #endgameModalLanguageBtn = null;

  #redCountdown = null;
  #blackCountdown = null;

  initializeGame() {
    this.#handleElements();
    this.board.createBoard();
    this.players.launchPlayers();
    this.modalMustCapture.init();
    this.#newGame();
  }

  #handleElements() {
    this.redTimer = this.getElement(this.UISelectors.counter1);
    this.blackTimer = this.getElement(this.UISelectors.counter2);
    this.name1 = this.getElement(this.UISelectors.name1);
    this.name2 = this.getElement(this.UISelectors.name2);
    this.languageBtn = this.getElement(this.UISelectors.languageBtn);
    this.#starterModal = this.getElement(this.UISelectors.starterModal);
    this.#starterHeader = this.getElement(this.UISelectors.starterModalHeader);
    this.#starterLanguageBtn = this.getElement(
      this.UISelectors.starterLanguageBtn
    );
    this.starterPlayer1 = this.getElement(this.UISelectors.starterModalPlayer1);
    this.starterPlayer2 = this.getElement(this.UISelectors.starterModalPlayer2);
    this.#starterBtn = this.getElement(this.UISelectors.starterModalBtn);

    this.#captureModalLanguageBtn = this.getElement(
      this.UISelectors.captureModalLanguageBtn
    );

    this.#endgameModal = this.getElement(this.UISelectors.endgameModal);
    this.#endgameModalText = this.getElement(this.UISelectors.endgameModalText);
    this.#endgameModalBtn = this.getElement(this.UISelectors.endgameModalBtn);
    this.#endgameModalLanguageBtn = this.getElement(
      this.UISelectors.endgameLanguageBtn
    );
  }

  #newGame() {
    this.#generateTimers();
    this.redCounter.renderTimers.bind(this)();
    this.#starterBtn.addEventListener("click", this.#startGame.bind(this));
    this.#addBtnsEventListeners();
    // this.createCustomKings();
  }

  #startGame(e) {
    e.preventDefault();
    this.createCustomKings();
    this.redCounter.updateNames.bind(this)();
    this.#starterModal.classList.add("starter__modal--hidden");
    this.languageBtn.classList.remove("languageButton--hidden");
    this.#addBlackPiecesEventListeners();
    this.#addFlagsEventListeners();
    this.#redCountdown = setInterval(
      this.redCounter.updateRedCountdown.bind(this),
      1000
    );
    this.#blackCountdown = setInterval(
      this.blackCounter.updateBlackCountdown.bind(this),
      1000
    );

    if (this.#turn) {
      clearInterval(this.#redCountdown);
    }
  }

  #restartGame(e) {
    e.preventDefault();
    this.board.cells = [];
    this.redCounter = null;
    this.blackCounter = null;
    this.board.createBoard();
    this.#generateTimers();
    this.redCounter.renderTimers.bind(this)();
    this.redCounter.updateNames.bind(this)();
    this.#moveWithoutCapture = 0;
    this.winner = null;
    this.#turn = true;
    this.#popup = false;
    this.#endgameModal.classList.add("endgame__modal--hidden");
    this.languageBtn.classList.remove("languageButton--hidden");
    this.changeActivePlayerUI();
    this.#addBlackPiecesEventListeners();
    this.#blackCountdown = setInterval(
      this.blackCounter.updateBlackCountdown.bind(this),
      1000
    );
  }

  #generateTimers() {
    this.redCounter = new Timer();
    this.blackCounter = new Timer();
    this.redCounter.generateRedTimer();
    this.blackCounter.generateBlackTimer();
  }

  createCustomKings() {
    this.board.cells[44].element.firstChild.classList.add("blackKing");
    this.board.cells[46].element.firstChild.classList.add("blackKing");
    this.board.cells[19].element.firstChild.classList.add("redKing");
  }

  #addBtnsEventListeners() {
    this.#starterLanguageBtn.addEventListener(
      "click",
      this.changeLanguage.bind(this)
    );
    this.#endgameModalBtn.addEventListener(
      "click",
      this.#restartGame.bind(this)
    );
    this.#endgameModalLanguageBtn.addEventListener(
      "click",
      this.changeLanguage.bind(this)
    );

    this.#captureModalLanguageBtn.addEventListener(
      "click",
      this.changeLanguage.bind(this)
    );
    this.languageBtn.addEventListener("click", this.changeLanguage.bind(this));
    this.modalMustCapture.addEventListeners();
  }

  #addFlagsEventListeners() {
    this.players.flag1.addEventListener("click", this.#giveUpGame.bind(this));
    this.players.flag2.addEventListener("click", this.#giveUpGame.bind(this));
  }

  #addBlackPiecesEventListeners() {
    this.#red = document.querySelectorAll(".red");
    this.#black = document.querySelectorAll(".black");
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
    this.#redAmount = this.#red.length;
    this.#blackAmount = this.#black.length;
    this.#red.forEach((element) => {
      element.addEventListener("click", this.#handleCellClick);
    });
    this.#black.forEach((element) => {
      element.removeEventListener("click", this.#handleCellClick);
    });
  }

  #reloadPiecesEventListeners() {
    this.#turn
      ? this.#addBlackPiecesEventListeners()
      : this.#addRedPiecesEventListeners();
  }

  changeTurn() {
    if (this.#turn) {
      this.#turn = false;
      this.#addRedPiecesEventListeners();
      this.#redCountdown = setInterval(
        this.redCounter.updateRedCountdown.bind(this),
        1000
      );
      this.changeActivePlayerUI();
      clearInterval(this.#blackCountdown);
    } else if (!this.#turn) {
      this.#turn = true;
      this.#addBlackPiecesEventListeners();
      this.#blackCountdown = setInterval(
        this.blackCounter.updateBlackCountdown.bind(this),
        1000
      );
      this.changeActivePlayerUI();
      clearInterval(this.#redCountdown);
    }
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

    if (this.#cellsToJump.length) {
      this.#cellsToJump.forEach((element) =>
        element.element.classList.remove("possibleJump")
      );
    }

    this.#reloadPiecesEventListeners();
    this.#cleanMemoryClick();
    this.#pieceCanJump = [];
    this.#checkIfAnyJumpIsPossible();

    this.#selectedPiece.target = e.target;
    this.#selectedPiece.pickedPiece = this.#selectedPiece.target;
    this.#selectedPiece.index = parseInt(
      this.#selectedPiece.target.getAttribute("data-n"),
      10
    );
    this.#selectedPiece.cell = this.board.cells[this.#selectedPiece.index - 1];
    this.#selectedPiece.target.classList.add("selected");

    this.#selectedPiece.target.classList.contains("blackKing") ||
    this.#selectedPiece.target.classList.contains("redKing")
      ? this.#checkPossibleKingJump(this.#selectedPiece.index)
      : this.#checkPossibleJump(this.#selectedPiece.index);
  };

  #checkIfAnyJumpIsPossible() {
    let piecesToCheck = [];
    this.#turn ? (piecesToCheck = this.#black) : (piecesToCheck = this.#red);

    for (let i = 0; i < piecesToCheck.length; i++) {
      const index = parseInt(piecesToCheck[i].getAttribute("data-n"), 10);
      if (
        piecesToCheck[i].classList.contains("blackKing") ||
        piecesToCheck[i].classList.contains("redKing")
      ) {
        this.#checkPossibleKingJumpHandler(index);
        if (this.#cellsToJump.length) {
          this.#pieceCanJump.push(piecesToCheck[i]);
        }
        this.#cellsToJump = [];
        this.#cellsToClean = [];
        this.#cellsToJumpKing = [];
        this.#cellsToCleanKing = [];
      } else {
        this.#checkIfAnyPossiblePieceJump(index);
        if (this.#cellsToJump.length) {
          this.#pieceCanJump.push(piecesToCheck[i]);
        }
        this.#cellsToJump = [];
        this.#cellsToClean = [];
      }
    }
  }

  #checkPossibleKingJump(index) {
    this.#checkPossibleKingJumpHandler(index);

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
      -19, -28, -37, -46, -55, -15, -22, -29, -36, -43, -50, 13, 20, 27, 34, 41,
      48, 17, 26, 35, 44, 53,
    ];

    const kingCheckBoard = [
      -10, -19, -28, -37, -46, -8, -15, -22, -29, -36, -43, 6, 13, 20, 27, 34,
      41, 8, 17, 26, 35, 44,
    ];

    for (let i = 0; i < kingJumpBoard.length; i++) {
      kingJumpBoard[i] + index > 0 && kingJumpBoard[i] + index < 63
        ? this.#cellsToJumpKing.push(this.board.cells[kingJumpBoard[i] + index])
        : this.#cellsToJumpKing.push(this.board.cells[0]);
    }
    for (let i = 0; i < kingCheckBoard.length; i++) {
      kingCheckBoard[i] + index > 0 && kingCheckBoard[i] + index < 63
        ? this.#cellsToCleanKing.push(
            this.board.cells[kingCheckBoard[i] + index]
          )
        : this.#cellsToCleanKing.push(this.board.cells[0]);
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
    this.#cellsToMoveKing = this.#cellsToCleanKing;
    this.#cellsToMoveKing.splice(5, 0, this.#cellsToJumpKing[4]);
    this.#cellsToMoveKing.splice(12, 0, this.#cellsToJumpKing[10]);
    this.#cellsToMoveKing.splice(19, 0, this.#cellsToJumpKing[16]);
    this.#cellsToMoveKing.push(this.#cellsToJumpKing[21]);

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

  #renderMove(cell, index, pickedPiece, i) {
    this.#cellsToMove[i].hasPiece = true;
    this.#cellsToMove[i].element.appendChild(pickedPiece);
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

  #moveKing(cell, index, target, pickedPiece, e) {
    this.#selectedPiece.option = e.target;

    if (
      this.#pieceCanJump.length &&
      this.#selectedPiece.option != this.#selectedPiece.target
    ) {
      for (let i = 0; i < this.#pieceCanJump.length; i++) {
        this.#pieceCanJump[i].classList.add("canJump");
      }
      if (!this.#popup) {
        this.modalMustCapture.revealCaptureModalPopup();
        this.languageBtn.classList.add("languageButton--hidden");
        this.#popup = !this.#popup;
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
      this.#reloadPiecesEventListeners();
      return;
    }

    for (let i = 0; i < this.#cellsToMove.length; i++) {
      if (this.#selectedPiece.option === this.#cellsToMove[i].element) {
        this.#renderMove(cell, index, pickedPiece, i);
      }
    }

    if (this.#selectedPiece.option === this.#selectedPiece.target) {
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToKingMoveHandler
      );

      this.#cleanMemoryClick();
      this.#reloadPiecesEventListeners();
      return;
    }

    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#cellsToKingMoveHandler
    );
    target.classList.remove("selected");

    this.#cellsToMove.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToKingMoveHandler)
    );
    this.#cellsToMove.forEach((element) =>
      element.element.classList.remove("possibleMove")
    );

    cell.hasPiece = null;

    this.#moveWithoutCapture++;

    this.changeTurn();
    this.checkIfWin();
  }

  #checkColorAndFreeSpot(j) {
    if (
      this.#cellsToMoveKing[j].isBrown &&
      !this.#cellsToMoveKing[j].hasPiece
    ) {
      this.#cellsToKingMoveHelper.push(0);
    } else {
      this.#cellsToKingMoveHelper.push(1);
    }
  }

  #checkMoveLeftTopDirection(i) {
    this.#cellsToKingMoveHelper = [];
    if (
      this.#cellsToMoveKing[i].isBrown &&
      !this.#cellsToMoveKing[i].hasPiece
    ) {
      for (let j = 0; j < i + 1; j++) {
        this.#checkColorAndFreeSpot(j);
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
        this.#checkColorAndFreeSpot(j);
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
        this.#checkColorAndFreeSpot(j);
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
        this.#checkColorAndFreeSpot(j);
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
    if (
      this.#cellsToCleanKing[j].isBrown &&
      this.#cellsToCleanKing[j].hasPiece &&
      ((this.#turn && this.#cellsToCleanKing[j].hasRed) ||
        (!this.#turn && this.#cellsToCleanKing[j].hasBlack))
    ) {
      this.#cellsToKingJumpHelper.push(1);
    } else if (
      this.#cellsToCleanKing[j].isBrown &&
      this.#cellsToCleanKing[j].hasPiece &&
      ((this.#turn && this.#cellsToCleanKing[j].hasBlack) ||
        (!this.#turn && this.#cellsToCleanKing[j].hasRed))
    ) {
      this.#cellsToKingJumpHelper.push(2);
    } else this.#cellsToKingJumpHelper.push(0);
  }

  #selectPossibleKingJumpSpots(i) {
    this.#sum = 0;
    if (this.#cellsToKingJumpHelper.length) {
      for (let k = 0; k < this.#cellsToKingJumpHelper.length; k++) {
        this.#sum += this.#cellsToKingJumpHelper[k];
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

        this.#cellsToClean.push(this.#cellsToCleanKing[cleanIndex]);
      }
      this.#cellsToKingJumpHelper = [];
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
        this.#cellsToJump.push(this.board.cells[pieceJumpBoard[i] + index]);
        this.#cellsToClean.push(this.board.cells[pieceCheckBoard[i] + index]);
      }
    }

    for (let i = 0; i < this.#cellsToJump.length; i++) {
      if (
        !(
          this.#cellsToJump[i].isBrown &&
          this.#cellsToClean[i].isBrown &&
          this.#cellsToClean[i].hasPiece &&
          !this.#cellsToJump[i].hasPiece &&
          ((this.#turn && this.#cellsToClean[i].hasRed) ||
            (!this.#turn && this.#cellsToClean[i].hasBlack))
        )
      ) {
        const index = this.#cellsToJump.indexOf(this.#cellsToJump[i]);
        this.#cellsToJump.splice(index, 1);
        this.#cellsToClean.splice(index, 1);
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
        this.#cellsToJump.push(this.board.cells[pieceJumpBoard[i] + index]);
        this.#cellsToClean.push(this.board.cells[pieceCheckBoard[i] + index]);
      }
    }

    for (let i = 0; i < this.#cellsToJump.length; i++) {
      if (
        this.#cellsToJump[i].isBrown &&
        this.#cellsToClean[i].isBrown &&
        this.#cellsToClean[i].hasPiece &&
        !this.#cellsToJump[i].hasPiece &&
        ((this.#turn && this.#cellsToClean[i].hasRed) ||
          (!this.#turn && this.#cellsToClean[i].hasBlack))
      ) {
        this.#cellsToJump[i].element.classList.add("possibleJump");
      } else {
        const index = this.#cellsToJump.indexOf(this.#cellsToJump[i]);
        this.#cellsToJump.splice(index, 1);
        this.#cellsToClean.splice(index, 1);
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
        this.#renderJump(cell, index, pickedPiece, i);
      }
    }

    if (this.#selectedPiece.option === this.#selectedPiece.target) {
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToJumpHandler
      );

      this.#cleanMemoryClick();
      this.#reloadPiecesEventListeners();
      return;
    }
    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#cellsToJumpHandler
    );
    cell.hasPiece = null;
    target.classList.remove("selected");

    this.#cellsToJump.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToJumpHandler)
    );
    this.#cellsToJump.forEach((element) =>
      element.element.classList.remove("possibleJump")
    );

    this.#moveWithoutCapture = 0;

    this.#updateAmountOfPieces();

    this.#checkIfNextKingJumpIsPossible(pickedPiece);

    this.checkIfWin();
  }

  #renderJump(cell, index, pickedPiece, i) {
    console.log(this.#cellsToJump[i], this.#cellsToClean[i]);
    this.#cellsToJump[i].hasPiece = true;
    this.#cellsToJump[i].element.appendChild(pickedPiece);
    this.#cellsToClean[i].hasPiece = false;
    this.#cellsToClean[i].element.firstChild.remove();

    if (this.#turn) {
      cell.hasBlack = null;
      this.#cellsToClean[i].hasRed = null;
      this.#cellsToJump[i].hasBlack = true;
      this.#cellsToJump[i].hasPiece = true;
    } else {
      cell.hasRed = null;
      this.#cellsToClean[i].hasBlack = null;
      this.#cellsToJump[i].hasRed = true;
      this.#cellsToJump[i].hasPiece = true;
    }
    index = this.#cellsToJump[i].n;
    pickedPiece.setAttribute("data-n", index);
  }

  #jumpPiece(cell, index, target, pickedPiece, e) {
    this.#selectedPiece.option = e.target;
    for (let i = 0; i < this.#cellsToJump.length; i++) {
      if (this.#selectedPiece.option === this.#cellsToJump[i].element) {
        this.#renderJump(cell, index, pickedPiece, i);
      }

      if (this.#selectedPiece.option === this.#selectedPiece.target) {
        this.#selectedPiece.target.removeEventListener(
          "click",
          this.#cellsToJumpHandler
        );

        this.#cleanMemoryClick();
        this.#reloadPiecesEventListeners();
        return;
      }

      this.#updateAmountOfPieces();

      console.log(this.#redAmount, this.#blackAmount);
    }

    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#cellsToJumpHandler
    );
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

    this.checkIfWin();
  }

  #checkIfNextKingJumpIsPossible(pickedPiece) {
    this.#cleanMemoryClick();
    this.#selectedPiece.target = pickedPiece;
    this.#selectedPiece.pickedPiece = pickedPiece;
    this.#selectedPiece.index = parseInt(
      this.#selectedPiece.target.getAttribute("data-n"),
      10
    );

    this.#selectedPiece.cell = this.board.cells[this.#selectedPiece.index - 1];
    this.#selectedPiece.target.classList.add("selected");

    this.#checkPossibleNextKingJump(this.#selectedPiece.index);
  }

  #checkPossibleNextKingJump(index) {
    this.#checkPossibleKingJumpHandler(index);

    this.#cellsToJump.forEach((element) =>
      element.element.classList.add("possibleJump")
    );

    if (!this.#cellsToJump.length) {
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToJumpHandler
      );
      this.#cleanMemoryClick();
      this.changeTurn();
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

    this.#selectedPiece.cell = this.board.cells[this.#selectedPiece.index - 1];
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
      this.changeTurn();
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
    this.#turn
      ? (this.#cellsToCleanMove = [index - 8, index - 10])
      : (this.#cellsToCleanMove = [index + 6, index + 8]);

    this.#cellsToCleanMove.forEach((cellIndex) =>
      cellIndex > 0 &&
      cellIndex < 63 &&
      this.board.cells[cellIndex].isBrown &&
      !this.board.cells[cellIndex].hasPiece
        ? this.#cellsToMove.push(this.board.cells[cellIndex]) &&
          this.board.cells[cellIndex].element.classList.add("possibleMove")
        : null
    );

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
      for (let i = 0; i < this.#pieceCanJump.length; i++) {
        this.#pieceCanJump[i].classList.add("canJump");
      }
      if (!this.#popup) {
        this.modalMustCapture.revealCaptureModalPopup();
        this.languageBtn.classList.add("languageButton--hidden");
        this.#popup = !this.#popup;
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
      this.#reloadPiecesEventListeners();
      return;
    }

    for (let i = 0; i < this.#cellsToMove.length; i++) {
      if (this.#selectedPiece.option === this.#cellsToMove[i].element) {
        this.#renderMove(cell, index, pickedPiece, i);
      }
    }

    if (this.#selectedPiece.option === this.#selectedPiece.target) {
      this.#selectedPiece.target.removeEventListener(
        "click",
        this.#cellsToKingMoveHandler
      );

      this.#cleanMemoryClick();
      this.#reloadPiecesEventListeners();
      return;
    }

    this.#checkIfMoveCreatesKing(
      this.#selectedPiece.option,
      this.#selectedPiece.pickedPiece
    );

    this.#selectedPiece.target.removeEventListener(
      "click",
      this.#cellsToKingMoveHandler
    );
    this.#selectedPiece.target.classList.remove("selected");

    this.#cellsToMove.forEach((element) =>
      element.element.removeEventListener("click", this.#cellsToKingMoveHandler)
    );
    this.#cellsToMove.forEach((element) =>
      element.element.classList.remove("possibleMove")
    );

    cell.hasPiece = null;

    this.#moveWithoutCapture++;

    this.changeTurn();
    this.checkIfWin();
  }

  #checkIfMoveCreatesKing(option, pickedPiece) {
    this.#cleanMemoryClick();

    if (
      this.board.cells[option.getAttribute("data-n") - 1].createBlackKing &&
      pickedPiece.classList.contains("black")
    ) {
      pickedPiece.classList.add("blackKing");
      pickedPiece.isBlackKing = true;
    } else if (
      this.board.cells[option.getAttribute("data-n") - 1].createRedKing &&
      pickedPiece.classList.contains("red")
    ) {
      pickedPiece.classList.add("redKing");
      pickedPiece.isRedKing = true;
    }
  }

  #updateAmountOfPieces() {
    if (this.#turn) {
      this.#redAmount--;
    } else if (!this.#turn) {
      this.#blackAmount--;
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

    this.#cellsToMove = [];
    this.#cellsToJump = [];
    this.#cellsToClean = [];
    this.#cellsToClean = [];
    this.#cellsToCleanKing = [];
    this.#cellsToJumpKing = [];
    this.#cellsToKingJumpHelper = [];
    this.#cellsToKingMoveHelper = [];
    this.#cellsToCleanMove = [];
    this.#sum = 0;
  }

  changeActivePlayerUI() {
    if (this.#turn) {
      this.players.blackTurn();
    } else {
      this.players.redTurn();
    }
  }

  checkIfWin() {
    if (this.#redAmount === 0) {
      this.endGame();
      this.#winner = "black";
      this.english
        ? (this.#endgameModalText.textContent = `${this.player1Name} WINS!`)
        : (this.#endgameModalText.textContent = `${this.player1Name} WYGRYWA!`);
    } else if (this.#blackAmount === 0) {
      this.endGame();
      this.#winner = "red";
      this.english
        ? (this.#endgameModalText.textContent = `${this.player2Name} WINS!`)
        : (this.#endgameModalText.textContent = `${this.player2Name} WYGRYWA!`);
    } else if (this.#moveWithoutCapture === 15) {
      this.endGame();
      this.english
        ? (this.#endgameModalText.textContent =
            "TOO MANY MOVES WITHOUT CAPTURE. NOBODY WINS!")
        : (this.#endgameModalText.textContent =
            "ZBYT DUŻO RUCHÓW BEZ WYKONANEGO BICIA. REMIS!");
    } else if (this.redCounter.time == 0) {
      this.endGame();
      this.#winner = "black";
      this.english
        ? (this.#endgameModalText.textContent = `${this.player1Name} WINS!`)
        : (this.#endgameModalText.textContent = `${this.player1Name} WYGRYWA!`);
    } else if (this.blackCounter.time == 0) {
      this.endGame();
      this.#winner = "red";
      this.english
        ? (this.#endgameModalText.textContent = `${this.player2Name} WINS!`)
        : (this.#endgameModalText.textContent = `${this.player2Name} WYGRYWA!`);
    }
  }

  #giveUpGame(e) {
    this.languageBtn.classList.add("languageButton--hidden");
    if (e.target === this.players.flag1) {
      this.endGame();
      this.#winner = "black";
      this.english
        ? (this.#endgameModalText.textContent = `${this.player1Name} WINS!`)
        : (this.#endgameModalText.textContent = `${this.player1Name} WYGRYWA!`);
    } else if (e.target === this.players.flag2) {
      this.endGame();
      this.#winner = "red";
      this.english
        ? (this.#endgameModalText.textContent = `${this.player2Name} WINS!`)
        : (this.#endgameModalText.textContent = `${this.player2Name} WYGRYWA!`);
    }
  }

  endGame() {
    this.#endgameModal.classList.remove("endgame__modal--hidden");
    this.languageBtn.classList.add("languageButton--hidden");
    clearInterval(this.#blackCountdown);
    clearInterval(this.#redCountdown);
    this.#cleanMemoryClick();
  }

  changeLanguage() {
    console.log("click");
    this.english = !this.english;
    this.changeText();
  }

  changeText() {
    if (this.english) {
      this.modalMustCapture.modalTextInEnglish();
      this.#starterBtn.innerText = "START GAME!";
      this.starterPlayer1.placeholder = "First player's name";
      this.starterPlayer2.placeholder = "Second player's name";
      this.#starterHeader.innerText = "CHECKERS";
      this.#endgameModalBtn.innerText = "PLAY AGAIN!";
      this.#moveWithoutCapture === 15
        ? (this.#endgameModalText.textContent =
            "TOO MANY MOVES WITHOUT CAPTURE. NOBODY WINS!")
        : this.#winner === "black"
        ? (this.#endgameModalText.textContent = `${this.player1Name} WINS!`)
        : (this.#endgameModalText.textContent = `${this.player2Name} WINS!`);
    } else {
      this.modalMustCapture.modalTextInPolish();
      this.#starterBtn.innerText = "ROZPOCZNIJ GRĘ!";
      this.starterPlayer1.placeholder = "Imię gracza nr 1";
      this.starterPlayer2.placeholder = "Imię gracza nr 2";
      this.#starterHeader.innerText = "WARCABY";
      this.#endgameModalBtn.innerText = "ZAGRAJ PONOWNIE!";
      this.#moveWithoutCapture === 15
        ? (this.#endgameModalText.textContent =
            "ZBYT DUŻO RUCHÓW BEZ WYKONANEGO BICIA. REMIS!")
        : this.#winner === "black"
        ? (this.#endgameModalText.textContent = `${this.player1Name} WYGRYWA!`)
        : (this.#endgameModalText.textContent = `${this.player2Name} WYGRYWA!`);
    }
  }
}
window.onload = function () {
  const game = new Game();

  game.initializeGame();
};
