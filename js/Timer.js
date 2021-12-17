import { UI } from "./UI.js";
import { language } from "./Language.js";
import { modalStarter } from "./ModalStarter.js";
import { game } from "./Game.js";

export class Timer extends UI {
  constructor() {
    super();
    this.startingTime = 5;
    this.timeRed = this.startingTime * 60;
    this.minutesRed = Math.floor(this.timeRed / 60);
    this.secondsRed = this.timeRed % 60;
    this.timeBlack = this.startingTime * 60;
    this.minutesBlack = Math.floor(this.timeBlack / 60);
    this.secondsBlack = this.timeBlack % 60;
  }

  redTimer = null;
  blackTimer = null;

  player1Name = null;
  player2Name = null;

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

  generateTimers() {
    this.generateRedTimer();
    this.generateBlackTimer();
  }

  updateRedCountdown() {
    this.timeRed--;
    this.minutesRed = Math.floor(this.timeRed / 60);
    this.timeRed % 60 > 9
      ? (this.secondsRed = this.timeRed % 60)
      : (this.secondsRed = `0${this.timeRed % 60}`);
    this.redTimer.firstChild.innerHTML = `${this.minutesRed}
  : ${this.secondsRed}`;
    this.timeRed < 60
      ? (this.redTimer.firstChild.style.color = "red")
      : (this.redTimer.firstChild.style.color = "black");
    game.checkIfWin();
  }

  updateBlackCountdown() {
    this.timeBlack--;
    this.minutesBlack = Math.floor(this.timeBlack / 60);
    this.timeBlack % 60 > 9
      ? (this.secondsBlack = this.timeBlack % 60)
      : (this.secondsBlack = `0${this.timeBlack % 60}`);
    this.blackTimer.firstChild.innerHTML = `${this.minutesBlack}
  : ${this.secondsBlack}`;
    this.timeBlack < 60
      ? (this.blackTimer.firstChild.style.color = "red")
      : (this.blackTimer.firstChild.style.color = "black");
    game.checkIfWin();
  }

  renderTimers() {
    game.name1.innerHTML = "PLAYER 2";
    game.name2.innerHTML = "PLAYER 1";
    this.restartTimers();
    this.redTimer.firstChild.innerHTML = `${this.minutesRed}
    : 0${this.secondsRed}`;
    this.blackTimer.firstChild.innerHTML = `${this.minutesBlack}
  : 0${this.secondsBlack}`;
    this.blackTimer.firstChild.style.color = "black";
    this.redTimer.firstChild.style.color = "black";
  }

  updateNames() {
    this.player1Name = modalStarter.starterPlayer1.value.toUpperCase();
    !this.player1Name
      ? language.english
        ? (this.player1Name = "PLAYER 1")
        : (this.player1Name = "GRACZ 1")
      : this.player1Name;
    this.player2Name = modalStarter.starterPlayer2.value.toUpperCase();
    !this.player2Name
      ? language.english
        ? (this.player2Name = "PLAYER 2")
        : (this.player2Name = "GRACZ 2")
      : this.player2Name;
    game.name2.innerHTML = this.player1Name;
    game.name1.innerHTML = this.player2Name;
    console.log(this.player1Name, this.player2Name);
  }

  restartTimers() {
    this.timeRed = this.startingTime * 60;
    this.minutesRed = Math.floor(this.timeRed / 60);
    this.secondsRed = this.timeRed % 60;
    this.timeBlack = this.startingTime * 60;
    this.minutesBlack = Math.floor(this.timeBlack / 60);
    this.secondsBlack = this.timeBlack % 60;
  }
}

const timer = new Timer();
export { timer };
