import { UI } from "./UI.js";

export class Timer extends UI {
  constructor() {
    super();
    this.startingTime = 5;
    this.time = this.startingTime * 60;
    this.minutes = Math.floor(this.time / 60);
    this.seconds = this.time % 60;
  }

  redTimer = null;
  blackTimer = null;

  createElement() {
    const element = `<span data-counter></span>`;
    return element;
  }

  generateRedTimer() {
    this.redTimer = this.getElement(this.UISelectors.counter1);
    this.redTimer.insertAdjacentHTML("beforeend", this.createElement());
  }

  generateBlackTimer() {
    this.blackTimer = this.getElement(this.UISelectors.counter2);
    this.blackTimer.insertAdjacentHTML("beforeend", this.createElement());
  }

  updateRedCountdown() {
    this.redCounter.time--;
    this.redCounter.minutes = Math.floor(this.redCounter.time / 60);
    this.redCounter.time % 60 > 9
      ? (this.redCounter.seconds = this.redCounter.time % 60)
      : (this.redCounter.seconds = `0${this.redCounter.time % 60}`);
    this.redTimer.firstChild.innerHTML = `${this.redCounter.minutes}
  : ${this.redCounter.seconds}`;
    this.redCounter.time < 60
      ? (this.redTimer.firstChild.style.color = "red")
      : (this.redTimer.firstChild.style.color = "black");
    this.checkIfWin();
  }

  updateBlackCountdown() {
    this.blackCounter.time--;
    this.blackCounter.minutes = Math.floor(this.blackCounter.time / 60);
    this.blackCounter.time % 60 > 9
      ? (this.blackCounter.seconds = this.blackCounter.time % 60)
      : (this.blackCounter.seconds = `0${this.blackCounter.time % 60}`);
    this.blackTimer.firstChild.innerHTML = `${this.blackCounter.minutes}
  : ${this.blackCounter.seconds}`;
    this.blackCounter.time < 60
      ? (this.blackTimer.firstChild.style.color = "red")
      : (this.blackTimer.firstChild.style.color = "black");
    this.checkIfWin();
  }

  renderTimers() {
    this.name1.innerHTML = "PLAYER 2";
    this.name2.innerHTML = "PLAYER 1";
    this.redTimer.firstChild.innerHTML = `${this.redCounter.minutes}
    : 0${this.redCounter.seconds}`;
    this.blackTimer.firstChild.innerHTML = `${this.blackCounter.minutes}
    : 0${this.blackCounter.seconds}`;
    this.blackTimer.firstChild.style.color = "black";
    this.redTimer.firstChild.style.color = "black";
  }

  updateNames() {
    this.player1Name = this.starterPlayer1.value.toUpperCase();
    !this.player1Name
      ? this.english
        ? (this.player1Name = "PLAYER 1")
        : (this.player1Name = "GRACZ 1")
      : this.player1Name;
    this.player2Name = this.starterPlayer2.value.toUpperCase();
    !this.player2Name
      ? this.english
        ? (this.player2Name = "PLAYER 2")
        : (this.player2Name = "GRACZ 2")
      : this.player2Name;
    this.name2.innerHTML = this.player1Name;
    this.name1.innerHTML = this.player2Name;
  }
  // updateNames() {
  //   this.player1Name = this.starterPlayer1.value.toUpperCase();
  //   !this.player1Name ? (this.player1Name = "PLAYER 1") : this.player1Name;
  //   this.player2Name = this.starterPlayer2.value.toUpperCase();
  //   !this.player2Name ? (this.player2Name = "PLAYER 2") : this.player2Name;
  //   this.name2.innerHTML = this.player1Name;
  //   this.name1.innerHTML = this.player2Name;
  // }
}
