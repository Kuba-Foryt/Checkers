import { UI } from "./UI.js";

export class Timer extends UI {
  constructor() {
    super();
    this.startingTime = 5;
    this.time = this.startingTime * 60;
    this.minutes = Math.floor(this.time / 60);
    this.seconds = this.time % 60;
  }

  createElement() {
    const element = `<span data-counter></span>`;
    return element;
  }

  updateRedCountdown() {
    this.redCounter.time--;
    this.redCounter.minutes = Math.floor(this.redCounter.time / 60);
    this.redCounter.time % 60 > 9
      ? (this.redCounter.seconds = this.redCounter.time % 60)
      : (this.redCounter.seconds = `0${this.redCounter.time % 60}`);
    this.redPlayer.firstChild.innerHTML = `${this.redCounter.minutes}
  : ${this.redCounter.seconds}`;
    this.redCounter.time < 60
      ? (this.redPlayer.firstChild.style.color = "red")
      : (this.redPlayer.firstChild.style.color = "black");
    this.checkIfWin();
  }

  updateBlackCountdown() {
    this.blackCounter.time--;
    this.blackCounter.minutes = Math.floor(this.blackCounter.time / 60);
    this.blackCounter.time % 60 > 9
      ? (this.blackCounter.seconds = this.blackCounter.time % 60)
      : (this.blackCounter.seconds = `0${this.blackCounter.time % 60}`);
    this.blackPlayer.firstChild.innerHTML = `${this.blackCounter.minutes}
  : ${this.blackCounter.seconds}`;
    this.blackCounter.time < 60
      ? (this.blackPlayer.firstChild.style.color = "red")
      : (this.blackPlayer.firstChild.style.color = "black");
    this.checkIfWin();
  }

  renderTimers() {
    this.name1.innerHTML = "PLAYER 2";
    this.name2.innerHTML = "PLAYER 1";
    this.redPlayer.firstChild.innerHTML = `${this.redCounter.minutes}
    : 0${this.redCounter.seconds}`;
    this.blackPlayer.firstChild.innerHTML = `${this.blackCounter.minutes}
    : 0${this.blackCounter.seconds}`;
    this.blackPlayer.firstChild.style.color = "black";
    this.redPlayer.firstChild.style.color = "black";
  }

  updateNames() {
    this.player1Name = this.starterPlayer1.value.toUpperCase();
    !this.player1Name ? (this.player1Name = "PLAYER 1") : this.player1Name;
    this.player2Name = this.starterPlayer2.value.toUpperCase();
    !this.player2Name ? (this.player2Name = "PLAYER 2") : this.player2Name;
    this.name2.innerHTML = this.player1Name;
    this.name1.innerHTML = this.player2Name;
  }
}
