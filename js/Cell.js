import { UI } from "./UI.js";

export class Cell extends UI {
  constructor(number) {
    super();
    this.n = number;
    this.selector = `[data-n="${this.n}"]`;
    this.hasPiece = null;
    this.hasKing = null;
    this.hasRed = null;
    this.hasBlack = null;
    this.isBrown = false;
    this.element = null;
  }

  createElement() {
    const element = `<div class="cell white" data-cell data-n="${this.n}"></div>`;
    return element;
  }

  brownCell() {
    this.isBrown = true;
    this.element.classList.remove("white");
    this.element.classList.add("brown");
  }

  // addPiece() {
  //   const element = `<div class="piece black" data-n="${this.n}"></div>`;
  //   // this.appendChild(element);
  //   return element;
  // }

  // createPieceElement() {
  //   const element = `<div class="piece black" data-n="${this.n}"></div>`;
  //   return element;
  // }
}
