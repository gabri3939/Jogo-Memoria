const input = document.querySelector('.login__input');
const button = document.querySelector('.login__button');
const form = document.querySelector('.login-form');

const validateInput = ({ target }) => {
  if (target.value.length > 3) {
    button.removeAttribute('disabled');
    return; // <-- Não 'retornar', mas 'return' (consistência de idioma)
  }

  button.setAttribute('disabled', '');
}

const handleSubmit = (event) => {
  event.preventDefault(); // Impede o recarregamento padrão da página

  // SALVA O NOME DO JOGADOR USANDO A CHAVE 'player'
  localStorage.setItem('player', input.value); // <-- CHAVE: 'player'
  window.location = 'pages/game.html'; // Redireciona para a página do jogo
}

input.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);