// Game
let basket = document.getElementById('basket');
let game_area = document.getElementById('game_area');
let score_display = document.getElementById('score');
let start_button = document.getElementById('start_button');

let basket_position = 250; // Anfangsposition des Korbs
let game_width = game_area.offsetWidth;
let game_height = game_area.offsetHeight;
let basket_width = basket.offsetWidth;
let fruit_fall_speed = 2;
let score = 0;
let game_running = false; // Steuert, ob das Spiel läuft

let is_dragging = false; // Steuert, ob die Maus gedrückt wird, um den Korb zu bewegen
let offset_x = 0; // Abstand zwischen Mausposition und Korbposition

// Funktion zum Steuern des Korbs mit der Maus (wird beim Bewegen ausgeführt)
function move_basket(event) {
    let mouse_x = event.clientX || event.touches[0].clientX; // Koordinaten der Maus oder des ersten Touches
    let basket_center = mouse_x - offset_x; // Berechne den Mittelpunkt des Korbs

    // Verhindere, dass der Korb aus dem Spielfeld herausgeht
    if (basket_center >= 0 && basket_center <= game_width - basket_width) {
        basket_position = basket_center;
        basket.style.left = basket_position + 'px';
    }
}

// EventListener für das Drücken der Maus (Bewegung des Korbs starten)
basket.addEventListener('mousedown', (e) => {
    if (game_running) {
        is_dragging = true;
        offset_x = e.clientX - basket_position; // Berechne den Abstand zwischen Maus und Korb
    }
});

// EventListener für das Loslassen der Maus (Bewegung des Korbs stoppen)
document.addEventListener('mouseup', () => {
    is_dragging = false;
});

// EventListener für die Mausbewegung
document.addEventListener('mousemove', (e) => {
    if (is_dragging) {
        move_basket(e);
    }
});

// Funktion um das Obst fallen zu lassen
function drop_fruit() {
    if (!game_running) return; // Stoppe das Spiel, wenn es nicht läuft

    let fruit_x = Math.random() * (game_width - 30); // Zufällige x-Position
    let fruit_y = 0; // Start y-Position (oben)

    let fruit = document.createElement('div');
    fruit.classList.add('fruit');
    fruit.style.left = fruit_x + 'px';
    fruit.style.top = fruit_y + 'px';
    game_area.appendChild(fruit);
    fruit.style.display = 'block';

    let fruit_fall_interval = setInterval(() => {
        if (fruit_y < game_height - 30) {
            fruit_y += fruit_fall_speed;
            fruit.style.top = fruit_y + 'px';
        } else {
            // Wenn die Frucht den Korb berührt
            if (fruit_y >= game_height - 30 && fruit_x > basket_position && fruit_x < basket_position + basket_width) {
                score++; // Punktestand erhöhen
                score_display.textContent = "Punkte: " + score;
                fruit.style.display = 'none'; // Obst verschwindet nach dem Fang
                clearInterval(fruit_fall_interval); // Stoppe das Fallen der Frucht
            }
            // Wenn die Frucht den Boden erreicht und nicht gefangen wurde
            if (fruit_y >= game_height - 30) {
                fruit.style.display = 'none'; // Obst verschwinden lassen, wenn es den Boden erreicht
                clearInterval(fruit_fall_interval); // Stoppe das Fallen der Frucht
            }
        }
    }, 10);

    // Überprüfen, ob 20 Punkte erreicht wurden
    if (score >= 20) {
        end_game(); // Beende das Spiel, wenn 20 Punkte erreicht wurden
    }
}

// Funktion, um das Spiel zu beenden
function end_game() {
    game_running = false; // Stoppe das Spiel
    start_button.style.display = 'block'; // Start-Button wird wieder sichtbar
    start_button.textContent = 'Neues Spiel starten'; // Text des Start-Buttons ändern
    alert('Spiel beendet! Du hast 20 Punkte erreicht!'); // Pop-up Nachricht
}

// Funktion, um das Spiel zu starten
function start_game() {
    score = 0;
    score_display.textContent = "Punkte: " + score;
    game_running = true;
    start_button.style.display = 'none'; // Start-Button nach Spielstart verstecken
    setInterval(drop_fruit, 2000); // Alle 2 Sekunden fällt eine neue Frucht
}

// EventListener für den Start-Button
start_button.addEventListener('click', start_game);


// Passwortvalidierung für das Anmeldeformular
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirm_password");
  
  confirmPasswordField.addEventListener("input", function () {
    if (passwordField.value !== confirmPasswordField.value) {
      confirmPasswordField.setCustomValidity("Passwörter stimmen nicht überein");
    } else {
      confirmPasswordField.setCustomValidity("");
    }
  });
