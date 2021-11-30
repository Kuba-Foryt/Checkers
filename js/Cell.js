import { UI } from "./UI.js";

export class Cell extends UI {
  constructor(number) {
    super();
    this.n = number;
    this.selector = `[data-n="${this.n}"]`;
    this.hasPiece = null;
    this.hasRed = null;
    this.hasBlack = null;
    this.createRedKing = null;
    this.createBlackKing = null;
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
}
