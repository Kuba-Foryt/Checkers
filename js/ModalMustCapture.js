import { UI } from "./UI.js";

export class ModalMustCapture extends UI {
  #captureModal = null;
  #captureModalText = null;
  #captureModalBtn = null;

  handleElements() {
    this.#captureModal = this.getElement(this.UISelectors.captureModal);
    this.#captureModalText = this.getElement(this.UISelectors.captureModalText);
    this.#captureModalBtn = this.getElement(this.UISelectors.captureModalBtn);
  }

  addEventListeners() {
    this.#captureModalBtn.addEventListener(
      "click",
      this.hideCapturePopup.bind(this)
    );
  }

  hideCapturePopup(e) {
    e.preventDefault();
    this.#captureModal.classList.add("mustCapture__modal--hidden");
  }

  revealCaptureModalPopup() {
    this.#captureModal.classList.remove("mustCapture__modal--hidden");
  }

  modalTextInEnglish() {
    this.#captureModalText.innerText =
      "Capture is obligatory! Pieces with possible capture move are marked with blue color";
    this.#captureModalBtn.innerText = "GOT IT!";
  }

  modalTextInPolish() {
    this.#captureModalText.innerText =
      "Bicie jest obowiązkowe! Piony, które mogą wykonać bicie zaznaczono na niebiesko";
    this.#captureModalBtn.innerText = "OK!";
  }

  init() {
    this.handleElements();
  }
}

const modalMustCapture = new ModalMustCapture();
modalMustCapture.init();

export { modalMustCapture };
