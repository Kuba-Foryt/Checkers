import { UI } from "./UI.js";

class ModalRules extends UI {
  #rulesModal = null;
  #rulesModalHeader = null;
  #rulesModalBtn = null;
  #rulesModalRule1 = null;
  #rulesModalRule2 = null;
  #rulesModalRule3 = null;
  #rulesModalRule4 = null;
  #rulesModalRule5 = null;
  #rulesModalRule6 = null;
  #rulesModalRule7 = null;
  rulesBtn = null;

  addEventListeners() {
    this.#rulesModalBtn.addEventListener(
      "click",
      this.hideRulesModal.bind(this)
    );
    this.rulesBtn.addEventListener("click", this.toggleRulesModal.bind(this));
  }

  handleElements() {
    this.#rulesModal = this.getElement(this.UISelectors.rulesModal);
    this.#rulesModalHeader = this.getElement(this.UISelectors.rulesModalHeader);
    this.#rulesModalRule1 = this.getElement(this.UISelectors.rulesModalRule1);
    this.#rulesModalRule2 = this.getElement(this.UISelectors.rulesModalRule2);
    this.#rulesModalRule3 = this.getElement(this.UISelectors.rulesModalRule3);
    this.#rulesModalRule4 = this.getElement(this.UISelectors.rulesModalRule4);
    this.#rulesModalRule5 = this.getElement(this.UISelectors.rulesModalRule5);
    this.#rulesModalRule6 = this.getElement(this.UISelectors.rulesModalRule6);
    this.#rulesModalRule7 = this.getElement(this.UISelectors.rulesModalRule7);
    this.#rulesModalBtn = this.getElement(this.UISelectors.rulesModalBtn);
    this.rulesBtn = this.getElement(this.UISelectors.rulesBtn);
  }

  hideRulesModal(e) {
    e.preventDefault();
    this.#rulesModal.classList.add("rules__modal--hidden");
  }

  toggleRulesModal() {
    this.#rulesModal.classList.toggle("rules__modal--hidden");
  }

  modalTextInEnglish() {
    this.#rulesModalHeader.innerText = "Game rules";
    this.#rulesModalRule1.innerText =
      "The player with the black pieces makes the first move. The two players make moves alternately";
    this.#rulesModalRule2.innerText =
      "Ordinary pieces move forward one square diagonally to a square that is not occupied by another piece and capture an opponent's piece by moving two consecutive steps forwards or backwards in the same line, jumping over the piece on the first step";
    this.#rulesModalRule3.innerText = `Multiple enemy pieces can be captured in a single turn provided by successive jumps made by a single piece. The jumps do not need to be in the same line and may "zigzag"`;
    this.#rulesModalRule4.innerText =
      "Jumping is always mandatory: if a player has the option to jump, he/she must take it, even if doing so results in disadvantage for the jumping player";
    this.#rulesModalRule5.innerText =
      "If a man moves into the last row on the opponent's side of the board, it is crowned as a king and gains the ability to move any distance along unblocked diagonals, and may capture an opposing man any distance away by jumping to any of the unoccupied squares immediately beyond it";
    this.#rulesModalRule6.innerText =
      "If a man moves into the kings row and continues to capture pieces, it doesn't become king";
    this.#rulesModalRule7.innerText =
      "Game ends when all enemy's pieces are eliminated, time for game passes, enemy can't make a move or he/she surrenders by clicking on white flag";
    this.#rulesModalBtn.innerText = "GOT IT!";
  }

  modalTextInPolish() {
    this.#rulesModalHeader.innerText = "Zasady gry";
    this.#rulesModalRule1.innerText =
      "Gracz z czarnymi pionami wykonuje ruch jako pierwszy. Gracze wykonują ruchy na zmianę";
    this.#rulesModalRule2.innerText =
      "Piony wykonują ruch do przodu po przekątnej na pole nie zajęte przez innego piona i biją poprzez ruch na dwa pola w tej samej do przodu lub do tyłu, przeskakując nad pionem przeciwnika znajdującym się na pierwszym z pól";
    this.#rulesModalRule3.innerText =
      "Możliwe jest zbicie wielu pionów przeciwnika poprzez kolejne bicia wykonywane przez ten sam pion w ramach jednego ruchu. Bicia nie muszą odbywać się w linii prostej i mogą zmieniać kierunek";
    this.#rulesModalRule4.innerText =
      "Bicie jest zawsze obowiązkowe: jeżeli pion ma szansę na bicie to zawsze musi ją wykorzystać, nawet jeżeli będzie to z niekorzyścią dla niego";
    this.#rulesModalRule5.innerText =
      "Jeżeli pion dociera do ostatniego rzędu po stronie przeciwnika przemienia się w damkę i uzyskuje umiejętność poruszania się na dowolną odległość po niezablokowanych przekątnych i mozę dokonać bicia piona przeciwnika w dowolnej odległości poprzez przeskoczenie na dowolne niezajęte pole za bitym pionem";
    this.#rulesModalRule6.innerText =
      "Jeżeli pion dociera do królewskiego rzędu po stronie przeciwnika i kontynuuje bicie w tej samej turze, nie staje się damką";
    this.#rulesModalRule7.innerText =
      "Gra kończy się gdy zostaną wyeliminowane wszystkie piony przeciwnika, czas na grę minie, przeciwnik nie ma ruchu lub poddał się  poprzez kliknięcie w białą flagę";
    this.#rulesModalBtn.innerText = "OK!";
  }

  init() {
    this.handleElements();
  }
}

const modalRules = new ModalRules();
modalRules.init();

export { modalRules };
