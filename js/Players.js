import { UI } from "./UI.js";
import { Cell } from "./Cell.js";
import { Piece } from "./Piece.js";
import { Timer } from "./Timer.js";

export class Players extends UI {
  redTimer = null;
  blackTimer = null;
  name1 = null;
  name2 = null;
  fas1 = null;
  fas2 = null;
  flag1 = null;
  flag2 = null;
  languageBtn = null;

  handleElements() {
    this.redTimer = this.getElement(this.UISelectors.counter1);
    this.blackTimer = this.getElement(this.UISelectors.counter2);
    this.name1 = this.getElement(this.UISelectors.name1);
    this.name2 = this.getElement(this.UISelectors.name2);
    this.fas1 = this.getElement(this.UISelectors.fas1);
    this.fas2 = this.getElement(this.UISelectors.fas2);
    this.flag1 = this.getElement(this.UISelectors.flag1);
    this.flag2 = this.getElement(this.UISelectors.flag2);
    this.languageBtn = this.getElement(this.UISelectors.languageBtn);
  }

  blackTurn() {
    this.fas1.classList.add("player1__fas--hidden");
    this.fas2.classList.remove("player2__fas--hidden");
    this.flag1.classList.add("player1__fas--hidden");
    this.flag2.classList.remove("player2__fas--hidden");
  }

  redTurn() {
    this.fas1.classList.remove("player1__fas--hidden");
    this.fas2.classList.add("player2__fas--hidden");
    this.flag1.classList.remove("player1__fas--hidden");
    this.flag2.classList.add("player2__fas--hidden");
  }

  launchPlayers() {
    this.handleElements();
  }
}
