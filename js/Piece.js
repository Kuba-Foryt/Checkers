import { UI } from "./UI.js";

export class Piece extends UI {
  constructor(number) {
    super();
    this.n = number;
    this.element = null;
    this.isRed = null;
    this.isBlack = null;
    this.isRedKing = null;
    this.isBlackKing = null;
  }

  createRedPieceElement() {
    const element = `<div class="piece red" data-n="${this.n}"></div>`;
    return element;
  }

  createBlackPieceElement() {
    const element = `<div class="piece black" data-n="${this.n}"></div>`;
    return element;
  }
}
