// Estado do jogo (memória da partida)
// shortcut: streak e gems ficam apenas em memória RAM; migrar para localStorage ao implementar salvamento de progresso
let secretNumber = Math.floor(Math.random() * 100) + 1;
let lives = 5;
let streak = 0;
let gems = 1420;
let gameOver = false;

// elementos da tela (DOM)
const guessInput = document.getElementById('guess-input');
const btnSubmit = document.getElementById('btn-submit');
const btnReset = document.getElementById('btn-reset');
const stepButtons = document.querySelectorAll('.btn-step');

const robotTip = document.getElementById('robot-tip');
const robotSub = document.getElementById('robot-sub');
const mysteryDisplay = document.getElementById('mystery-display');
const thermoPin = document.getElementById('thermo-pin');
const thermoStatus = document.getElementById('thermo-status');
const historyChips = document.getElementById('history-chips');

const hearts =  document.querySelectorAll('.heart');
const livesCounter = document.getElementById('lives-counter');
const streakCounter = document.getElementById('streak-counter');
const gemsCounter = document.getElementById('gems-counter');

// Atualizar termômetro e botões de ajuste (-10, -1, +1, +10)
// shortcut: usa o valor 1-100 direto como porcentagem (left: N%); se mudar o limite máximo do jogo, calcular ((clamped - min) / (max - min)) * 100
function updatePin(value) {
    const clamped = Math.min(100, Math.max(1, value));
    guessInput.value = clamped;
    thermoPin.textContent = clamped;
    thermoPin.style.left = clamped + '%';
}

stepButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        if(gameOver) return;
        const current = Number(guessInput.value) || 50;
        const step = Number(btn.dataset.step);
        updatePin(current + step);
    });
});

guessInput.addEventListener('input', () => {
    updatePin(Number(guessInput.value));
});

// Histórico de Palpites dinâmico
historyChips.innerHTML = '';

function addHistoryChip(guess, direction) {
    const chip = document.createElement('span');
    chip.className = direction === 'up' ? 'chip chip-up' : 'chip chip-down';
    chip.textContent = direction === 'up' ? `${guess} ▲` : `${guess} ▼`;
    historyChips.appendChild(chip);
}

// Verificar o palpite do jogador
function checkGuess() {
    if(gameOver) return;

    const guess = Number(guessInput.value);
    updatePin(guess);

    // Caso 1: Acertou o número!
    if(guess === secretNumber) {
        gameOver = true;
        mysteryDisplay.textContent = secretNumber;
        robotTip.textContent = "VOCÊ ACERTOU! 🏆";
        robotSub.textContent = "Parabéns! Você abriu o cofre!";
        thermoStatus.textContent = "CRAVADO! 🎯";

        streak++;
        gems += 50;
        streakCounter.textContent = `${streak}x COMBO`;
        gemsCounter.textContent = gems;
        return;
    }

    // Caso 2: Errou o palpite (perde 1 vida)
    // Decrementa lives antes de acessar hearts[lives] pois a NodeList é base 0 (índices 0 a 4), apagando da direita para a esquerda
    lives--;
    hearts[lives].classList.remove('active');
    livesCounter.textContent = `${lives}/5`;

    const isHigher = secretNumber > guess;
    addHistoryChip(guess, isHigher ? 'up' : 'down');

    //Se acabaram as vidas (Game Over)
    if(lives === 0) {
        gameOver = true;
        streak = 0;
        streakCounter.textContent = '0x COMBO';
        mysteryDisplay.textContent = secretNumber;
        robotTip.textContent = 'FIM DE JOGO! 💔';
        robotSub.textContent = `O número secreto era ${secretNumber}`;
        thermoStatus.textContent = 'DERROTA 💀';
        return;
    }

    // Dica de Maior/Menor e Quente/Frio
    const distance = Math.abs(secretNumber - guess);
    thermoStatus.textContent = distance <= 10 ? 'QUENTE! 🔥' : 'FRIO! ❄️';
    robotTip.textContent = isHigher ? 'O número é MAIOR! ▲' : 'O número é MENOR! ▼';
    robotSub.textContent = distance <= 10 ? 'Você está muito perto!' : 'Ajuste seu chute e tente de novo';
}

btnSubmit.addEventListener('click', checkGuess);

// Reiniciar a partida (mantém streak e gems intencionalmente para acumular pontuação na sessão)
function resetGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    lives = 5;
    gameOver = false;

    hearts.forEach((heart) =>
    heart.classList.add('active'));
    livesCounter.textContent = '5/5';
    mysteryDisplay.textContent = '?';
    robotTip.textContent = 'Faça seu primeiro chute!';
    robotSub.textContent = 'Escolha um número entre 1 e 100';
    thermoStatus.textContent = 'NEUTRO';
    historyChips.innerHTML = '';
    updatePin(50);
}

btnReset.addEventListener('click', resetGame);