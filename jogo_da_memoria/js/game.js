// Seletores principais
const grid = document.querySelector(".grid");
const spanPlayer = document.querySelector(".player");
const timer = document.querySelector(".timer");
const scoreSpan = document.querySelector(".Score");

const modal = document.getElementById("question-modal");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const feedbackText = document.getElementById("question-feedback");
const submitBtn = document.getElementById("submit-answer");

// Sons
const flipSound = new Audio("../sounds/carta.mp3");
const correctSound = new Audio("../sounds/Correto.wav");
const wrongSound = new Audio("../sounds/Incorreto.wav");

// Lista de personagens (nomes das imagens)
const characters = [
  "imagem1",
  "imagem2",
  "imagem3",
  "imagem4",
  "imagem5",
  "imagem6",
];

// Perguntas e alternativas
const questions = [
  {
    question: "A planta urbana de Quersoneso revela principalmente:",
    options: {
      A: "Prioridade para agricultura",
      B: "Sociedade militarizada",
      C: "Planejamento social",
      D: "Crescimento caótico",
    },
    answer: "C",
  },
  {
    question: "Pesos de argila e selos de chumbo em Quersoneso serviam para:",
    options: { A: "Decoração", B: "Comércio", C: "Religião", D: "Escrita" },
    answer: "B",
  },
  {
    question: "A Ágora de Atenas era o centro:",
    options: {
      A: "Religioso",
      B: "Militar",
      C: "Político/social/comercial",
      D: "Residencial",
    },
    answer: "C",
  },
  {
    question: "Termas Romanas ofereciam além do banho:",
    options: {
      A: "Arenas de luta",
      B: "Teatros",
      C: "Mercados",
      D: "Ginásios e bibliotecas",
    },
    answer: "D",
  },
  {
    question: "O Panteão de Roma é notável por:",
    options: {
      A: "Esculturas externas",
      B: "Altar interno",
      C: "Óculo no topo",
      D: "Tamanho da porta",
    },
    answer: "C",
  },
  {
    question: "A pirâmide de Gizé servia como:",
    options: { A: "Templo", B: "Tumba para faraó", C: "Palácio", D: "Armazém" },
    answer: "B",
  },
  {
    question: "Deuses adorados na Grécia antiga incluíam:",
    options: { A: "Zeus", B: "Afrodite", C: "Atena", D: "Todos acima" },
    answer: "D",
  },
  {
    question: "Principais generais gregos eram chamados:",
    options: { A: "Hoplitas", B: "Estratégos", C: "Filósofos", D: "Senadores" },
    answer: "B",
  },
];

// Variáveis do jogo
let firstCard = null;
let secondCard = null;
let canPlay = true;
let loopInterval;
let score = 0;
let askedQuestions = [];

// Criar elementos
const createElement = (tag, className) => {
  const el = document.createElement(tag);
  el.className = className;
  return el;
};

// Mostrar modal de pergunta
const showQuestion = (callback) => {
  if (askedQuestions.length === questions.length) askedQuestions = [];

  let qIndex;
  do {
    qIndex = Math.floor(Math.random() * questions.length);
  } while (askedQuestions.includes(qIndex));

  askedQuestions.push(qIndex);
  const q = questions[qIndex];

  questionText.textContent = q.question;
  answersContainer.innerHTML = "";
  feedbackText.textContent = "";
  feedbackText.classList.add("hidden");
  submitBtn.classList.add("hidden");

  Object.entries(q.options).forEach(([letter, text]) => {
    const btn = createElement("button", "answer-btn");
    btn.textContent = `${letter}) ${text}`;
    btn.addEventListener("click", () => {
      if (letter === q.answer) {
        score += 10;
        scoreSpan.textContent = score;
        feedbackText.textContent = "Correto! +10 pontos";
        feedbackText.classList.remove("hidden");
        correctSound.play();
      } else {
        feedbackText.textContent = `Incorreto! Resposta: ${q.answer}`;
        feedbackText.classList.remove("hidden");
        wrongSound.play();
      }
      submitBtn.classList.remove("hidden");
      // Ao clicar "Continuar"
      submitBtn.onclick = () => {
        modal.classList.add("hidden");
        canPlay = true;
        resetCards();
        submitBtn.onclick = null;
      };
    });
    answersContainer.appendChild(btn);
  });

  modal.classList.remove("hidden");
  canPlay = false;
};

// Criar carta
const createCard = (character) => {
  const card = createElement("div", "card");
  const front = createElement("div", "face front");
  const back = createElement("div", "face back");
  front.style.backgroundImage = `url('../images/${character}.png')`;
  card.setAttribute("data-character", character);
  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", (e) => {
    if (!canPlay) return;
    if (card.classList.contains("reveal-card")) return;

    card.classList.add("reveal-card");
    flipSound.play();

    if (!firstCard) firstCard = card;
    else {
      secondCard = card;
      checkCards();
    }
  });

  return card;
};

// Reset cartas
const resetCards = () => {
  firstCard = null;
  secondCard = null;
};

// Checar cartas
const checkCards = () => {
  const c1 = firstCard.getAttribute("data-character");
  const c2 = secondCard.getAttribute("data-character");

  if (c1 === c2) {
    firstCard.firstChild.classList.add("disabled-card");
    secondCard.firstChild.classList.add("disabled-card");
    resetCards();
    checkEndGame();
  } else {
    canPlay = false;
    setTimeout(() => {
      firstCard.classList.remove("reveal-card");
      secondCard.classList.remove("reveal-card");
      flipSound.play(); // som ao virar de volta
      showQuestion();
    }, 800);
  }
};

// Checar fim de jogo
const checkEndGame = () => {
  const disabledCards = document.querySelectorAll(".disabled-card");
  if (disabledCards.length === characters.length * 2) {
    clearInterval(loopInterval);
    questionText.textContent = `Parabéns ${spanPlayer.innerHTML}! Tempo: ${timer.textContent}s | Pontuação: ${score}`;
    answersContainer.innerHTML = "";
    modal.classList.remove("hidden");
    canPlay = false;
  }
};

// Carregar jogo
const loadGame = () => {
  const duplicated = [...characters, ...characters].sort(
    () => Math.random() - 0.5
  );
  duplicated.forEach((c) => {
    const card = createCard(c);
    grid.appendChild(card);
  });
};

// Timer
const startTimer = () => {
  loopInterval = setInterval(() => {
    timer.textContent = +timer.textContent + 1;
  }, 1000);
};

// Inicialização
window.onload = () => {
  spanPlayer.textContent = localStorage.getItem("player") || "Jogador";
  scoreSpan.textContent = score;
  startTimer();
  loadGame();
};
