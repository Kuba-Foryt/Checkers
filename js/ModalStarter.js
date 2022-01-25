import { UI } from "./UI.js";
import { game } from "./Game.js";

class ModalStarter extends UI {
  starterModal = null;
  starterBtn = null;
  starterHeader = null;

  starterPlayer1 = null;
  starterPlayer2 = null;

  handleElements() {
    this.starterModal = this.getElement(this.UISelectors.starterModal);
    this.starterHeader = this.getElement(this.UISelectors.starterModalHeader);
    this.starterPlayer1 = this.getElement(this.UISelectors.starterModalPlayer1);
    this.starterPlayer2 = this.getElement(this.UISelectors.starterModalPlayer2);
    this.starterBtn = this.getElement(this.UISelectors.starterModalBtn);
  }

  addEventListeners() {
    this.starterBtn.addEventListener("click", game.startGame.bind(game));
  }

  hideModal() {
    this.starterModal.classList.add("starter__modal--hidden");
  }

  init() {
    this.handleElements();
  }
}

const modalStarter = new ModalStarter();
modalStarter.init();

export { modalStarter };
