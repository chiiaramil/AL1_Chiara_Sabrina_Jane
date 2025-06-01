// Spielvariablen
let score = 0;
let timeLeft = 30;
let gameInterval;
let fruitInterval;
let isGameRunning = false;
let basketPosition = 50; // Startposition in Prozent
let moveSpeed = 1; // Erhöhte Geschwindigkeit der Korbbewegung

// Elemente
const gameArea = document.getElementById('game_area');
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startButton = document.querySelector('.start_game');

// Tastatursteuerung
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;

    const gameAreaWidth = gameArea.offsetWidth;
    const basketWidth = basket.offsetWidth;

    switch (e.key) {
        case 'ArrowLeft':
            basketPosition = Math.max(0, basketPosition - moveSpeed);
            basket.style.left = `${basketPosition}%`;
            break;
        case 'ArrowRight':
            basketPosition = Math.min(100, basketPosition + moveSpeed);
            basket.style.left = `${basketPosition}%`;
            break;
    }
});

// Kontinuierliche Bewegung bei gedrückter Taste
let keysPressed = {};
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

// Animationsschleife für flüssigere Bewegung
function updateBasketPosition() {
    if (!isGameRunning) return;

    if (keysPressed['ArrowLeft']) {
        basketPosition = Math.max(0, basketPosition - moveSpeed);
    }
    if (keysPressed['ArrowRight']) {
        basketPosition = Math.min(100, basketPosition + moveSpeed);
    }

    basket.style.left = `${basketPosition}%`;
    requestAnimationFrame(updateBasketPosition);
}

// Spiel starten
startButton.addEventListener('click', () => {
    if (isGameRunning) return;

    // Spielstatus zurücksetzen
    score = 0;
    timeLeft = 30;
    isGameRunning = true;
    basketPosition = 50; // Korposition zurücksetzen
    basket.style.left = '50%'; // Korposition visuell zurücksetzen
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    startButton.textContent = 'Spiel läuft...';
    startButton.disabled = true;

    // Bestehende Früchte entfernen
    const existingFruits = document.querySelectorAll('.fruit');
    existingFruits.forEach(fruit => fruit.remove());

    // Spielschleifen starten
    gameInterval = setInterval(updateTimer, 1000);
    fruitInterval = setInterval(createFruit, 1000);
    updateBasketPosition(); // Starte die Animationsschleife
});

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

function createFruit() {
    const fruit = document.createElement('div');
    const isGood = Math.random() < 0.7;
    fruit.className = `fruit ${isGood ? 'good' : 'bad'}`;

    if (isGood) {
        // Zufällig zwischen Tomate und Lauch wählen
        let randomNumber = Math.random();

        if (randomNumber < 0.25) {
            fruit.style.backgroundImage = "url('images/Biosafari_Tomate.png')";
        } else if (randomNumber < 0.5) {
            fruit.style.backgroundImage = "url('images/Biosafari_Lauch.png')";
        } else if (randomNumber < 0.75) {
            fruit.style.backgroundImage = "url('images/Biosafari_Radiesli.png')";
        } else {
            fruit.style.backgroundImage = "url('images/Biosafari_Paprika.png')";
        }
    }

    // Zufällige Position am oberen Rand des Spielbereichs
    const x = Math.random() * (gameArea.offsetWidth - 50);
    fruit.style.left = `${x}px`;
    fruit.style.top = '0px';

    gameArea.appendChild(fruit);

    // Frucht fallen lassen
    let posY = 0;
    const fallSpeed = 2 + Math.random() * 2;

    function animateFruit() {
        if (!isGameRunning) return;

        posY += fallSpeed;
        fruit.style.top = `${posY}px`;

        // Kollisionserkennung mit Korb
        const fruitRect = fruit.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        if (posY >= gameArea.offsetHeight - 50) {
            fruit.remove();
            return;
        }

        if (isColliding(fruitRect, basketRect)) {
            fruit.remove();
            if (isGood) {
                score += 1;
            } else {
                score = Math.max(0, score - 3);
                showBombHitEffect(); // Show effects when bomb is hit
            }
            scoreDisplay.textContent = score;
            return;
        }

        requestAnimationFrame(animateFruit);
    }

    requestAnimationFrame(animateFruit);
}

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
}

function showBombHitEffect() {
    // Add warning class to score container
    document.querySelector('.score').classList.add('warning');
    // Add wiggle class to basket
    basket.classList.add('wiggle');

    // Remove wiggle class after animation
    setTimeout(() => {
        basket.classList.remove('wiggle');
    }, 300);

    // Remove warning class after 2 seconds
    setTimeout(() => {
        document.querySelector('.score').classList.remove('warning');
    }, 2000);
}

function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(fruitInterval);

    // Endpunktedialog anzeigen
    const dialog = document.createElement('div');
    dialog.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    z-index: 1000;
    text-align: center;
  `;

    dialog.innerHTML = `
    <h3 style="margin-bottom: 0;">Spiel beendet!</h3>
    <p style="margin-bottom: 0; margin-top: 1vh;">Deine Punkte: ${score}</p>
    <p style="font-style: italic; margin-top: 0.5vh; font-size: 2vh;">Diese Punkte werden deinen Treuepunkten gutgeschrieben, <br> wenn du dich bei BioTiful registrierst.</p>
    <button class="start_game"; onclick="this.parentElement.remove(); document.querySelector('.game_container').style.display = 'none'; document.querySelector('.collect_points').classList.remove('hidden');">Konto erstellen</button>
  `;


    document.body.appendChild(dialog);
}
