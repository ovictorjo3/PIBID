let prizeDoor;
let chosenDoor = null;
let revealedDoor = null;
let gameOver = false;

const doors = document.querySelectorAll(".door");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const controls = document.getElementById("controls");
const stayBtn = document.getElementById("stay");
const switchBtn = document.getElementById("switch");
const instruction = document.getElementById("instruction");

function startGame() {
  prizeDoor = Math.floor(Math.random() * 3);
  chosenDoor = null;
  revealedDoor = null;
  gameOver = false;

  message.textContent = "";
  instruction.textContent = "Escolha uma porta clicando nela!";
  restartBtn.style.display = "none";
  controls.style.display = "none";

  doors.forEach(door => {
    door.style.backgroundColor = "white";
    door.querySelector("img").src = "imagens/porta.png";
    door.style.pointerEvents = "auto";
  });
}

// Escolha do jogador
doors.forEach(door => {
  door.addEventListener("click", () => {
    if (gameOver || chosenDoor !== null) return;

    chosenDoor = parseInt(door.dataset.index);

    // Porta escolhida em verde
    doors[chosenDoor].style.backgroundColor = "#a0e6a0";

    // Escolher porta para revelar (cabra, diferente da escolhida e do carro)
    do {
      revealedDoor = Math.floor(Math.random() * 3);
    } while (revealedDoor === chosenDoor || revealedDoor === prizeDoor);

    doors[revealedDoor].style.backgroundColor = "#f28c8c"; // vermelho
    doors[revealedDoor].querySelector("img").src = "imagens/cabra.png";
    doors[revealedDoor].style.pointerEvents = "none";

    // Porta restante
    const remainingDoor = [0,1,2].find(i => i !== chosenDoor && i !== revealedDoor);
    doors[remainingDoor].style.backgroundColor = "#a0e6a0";

    instruction.textContent = `Você escolheu a porta ${chosenDoor + 1}`;
    message.textContent = `O apresentador abriu a porta ${revealedDoor + 1} (cabra)! Quer trocar ou manter?`;
    controls.style.display = "block";
  });
});

// Manter
stayBtn.addEventListener("click", () => endGame(chosenDoor));

// Trocar
switchBtn.addEventListener("click", () => {
  const newChoice = [0,1,2].find(i => i !== chosenDoor && i !== revealedDoor);
  endGame(newChoice);
});

function endGame(finalChoice) {
  gameOver = true;
  controls.style.display = "none";

  if (finalChoice === prizeDoor) {
    doors[finalChoice].querySelector("img").src = "imagens/carro.png";
    message.textContent = "🎉 Você ganhou o CARRO!";
  } else {
    // jogador não ganhou
    doors[finalChoice].querySelector("img").src = "imagens/cabra.png";
    message.textContent = `🐐 Você estava na porta ${finalChoice + 1}. O carro estava na porta ${prizeDoor + 1}.`;

    // abrir todas as portas restantes
    doors.forEach((door, i) => {
      if (i !== finalChoice) {
        door.querySelector("img").src = (i === prizeDoor) ? "imagens/carro.png" : "imagens/cabra.png";
      }
    });
  }

  // desabilitar todas as portas
  doors.forEach(door => door.style.pointerEvents = "none");
  restartBtn.style.display = "inline-block";
}

restartBtn.addEventListener("click", startGame);

startGame();
