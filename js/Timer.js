import { UI } from "./UI.js";

export class Timer extends UI {
  constructor() {
    super();
    this.startingTime = 5;
    // this.selector = `[data-n="${this.n}"]`;
    this.selector1 = `[data-n="${this.n}"]`;
    this.selector1 = `[data-n="${this.n}"]`;
    this.time = this.startingTime * 60;
    this.minutes = Math.floor(this.time / 60);
    this.seconds = this.time % 60;
  }

  createElement() {
    const element = `<span data-counter></span>`;
    return element;
  }

  // updateRedCountdown() {
  //   // console.log(this.time);
  //   // console.log(this.startingTime);
  //   this.time--;
  //   this.minutes = Math.floor(this.time / 60);
  //   this.seconds = this.time % 60;
  //   // console.log(this.time);
  // }
}
