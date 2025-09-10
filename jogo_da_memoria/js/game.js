const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

const characters = [
    'imagem1',
    'imagem2',
    'imagem3',
    'imagem4',
    'imagem5',
    'imagem6'
];

const questions = [
    'A planta urbana de Quersoneso é notável por seu sistema de ruas e quadrantes. O que a organização desse layout revela principalmente sobre a sociedade que a construiu?A) A prioridade para a agricultura, com grandes espaços para plantações.B) Uma sociedade militarizada com defesa como prioridade máxima.C) Um planejamento meticuloso para a distribuição equitativa de lotes de terra e a organização social.D) Um crescimento orgânico e caótico, sem planejamento central.',
    'Muitas descobertas em Quersoneso incluem pesos de argila e selos de chumbo. Qual era a principal função desses artefatos?'
];

const answers = [
    'C',
    'Pesos para comércio'
];

let loopInterval;
let score = 0;
let canPlay = true;

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

let firstCard = '';
let secondCard = '';

const validateAnswer = (questionIndex, playerAnswer) => {
    const normalizedAnswer = playerAnswer.toUpperCase();
    const normalizedCorrectAnswer = answers[questionIndex].toUpperCase();

    if (normalizedAnswer === normalizedCorrectAnswer) {
        score += 10;
        alert(`Resposta correta! Você ganhou 10 pontos. Pontuação atual: ${score}`);
        canPlay = true;
    } else {
        alert(`Resposta incorreta! A resposta correta era: ${answers[questionIndex]}`);
        canPlay = false;
    }
}

const showQuestion = () => {
    const questionIndex = Math.floor(Math.random() * questions.length);

    const playerAnswer = prompt(questions[questionIndex]);

    if (playerAnswer) {
        validateAnswer(questionIndex, playerAnswer);
    } else {
        canPlay = false;
        alert("Você deve responder a pergunta para continuar!");
    }
}

const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');

    if (disabledCards.length === 12) {
        clearInterval(loopInterval);
        alert(`Parabéns, ${spanPlayer.innerHTML}! Seu tempo foi de: ${timer.innerHTML} segundos! Sua pontuação final: ${score}`);
    }
}

const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');

    if (firstCharacter === secondCharacter) {
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');

        firstCard = '';
        secondCard = '';

        canPlay = true;
        checkEndGame();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('reveal-card');
            secondCard.classList.remove('reveal-card');

            firstCard = '';
            secondCard = '';

            canPlay = false;
            setTimeout(() => {
                showQuestion();
            }, 500);
        }, 500);
    }
}

const revealCard = ({ target }) => {
    if (!canPlay) {
        alert("Responda à pergunta para continuar a jogada!");
        return;
    }

    if (target.parentNode.className.includes('reveal-card')) {
        return;
    }

    if (firstCard === '') {
        target.parentNode.classList.add('reveal-card');
        firstCard = target.parentNode;
    } else if (secondCard === '') {
        target.parentNode.classList.add('reveal-card');
        secondCard = target.parentNode;
        checkCards();
    }
}

const createCard = (character) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url('../images/${character}.png')`;
    card.setAttribute('data-character', character);

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener('click', revealCard);

    return card;
}

const loadGame = () => {
    const duplicatedCharacters = [...characters, ...characters];
    const shuffledArray = duplicatedCharacters.sort(() => Math.random() - 0.5);

    shuffledArray.forEach((character) => {
        const card = createCard(character);
        grid.appendChild(card);
    });
}

const startTimer = () => {
    loopInterval = setInterval(() => {
        const currentTime = +timer.innerHTML;
        timer.innerHTML = currentTime + 1;
    }, 1000);
}

window.onload = () => {
    spanPlayer.innerHTML = localStorage.getItem('player');
    startTimer();
    loadGame();
}
    //