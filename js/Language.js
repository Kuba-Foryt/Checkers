import { UI } from "./UI.js";
import { game } from "./Game.js";
import { modalEndgame } from "./ModalEndgame.js";
import { modalMustCapture } from "./ModalMustCapture.js";
import { modalStarter } from "./ModalStarter.js";

export class Language extends UI {
  english = true;
  languageBtn = null;

  handleElements() {
    this.languageBtn = this.getElement(this.UISelectors.languageBtn);
  }

  addEventListeners() {
    this.languageBtn.addEventListener("click", this.changeLanguage.bind(this));
  }

  showLanguageButton() {
    this.languageBtn.classList.remove("languageButton--hidden");
  }

  hideLanguageButton() {
    this.languageBtn.classList.add("languageButton--hidden");
  }

  init() {
    this.handleElements();
  }

  changeLanguage() {
    this.english = !this.english;
    this.changeText();
  }

  changeText() {
    if (this.english) {
      modalMustCapture.modalTextInEnglish();
      modalStarter.starterBtn.innerText = "START GAME!";
      modalStarter.starterPlayer1.placeholder = "First player's name";
      modalStarter.starterPlayer2.placeholder = "Second player's name";
      modalStarter.starterHeader.innerText = "CHECKERS";
      modalEndgame.againBtnInEnglish();
      modalEndgame.showBoardBtnInEnglish();
      game.moveWithoutCapture === 15
        ? modalEndgame.drawTextInEnglish()
        : game.winner === "black"
        ? modalEndgame.player1WinsInEnglish()
        : modalEndgame.player2WinsInEnglish();
    } else {
      modalMustCapture.modalTextInPolish();
      modalStarter.starterBtn.innerText = "ROZPOCZNIJ GRĘ!";
      modalStarter.starterPlayer1.placeholder = "Imię gracza nr 1";
      modalStarter.starterPlayer2.placeholder = "Imię gracza nr 2";
      modalStarter.starterHeader.innerText = "WARCABY";
      modalEndgame.againBtnInPolish();
      modalEndgame.showBoardBtnInPolish();
      game.moveWithoutCapture === 15
        ? modalEndgame.drawTextInPolish()
        : game.winner === "black"
        ? modalEndgame.player1WinsInPolish()
        : modalEndgame.player2WinsInPolish();
    }
  }
}

const language = new Language();
language.init();

export { language };
