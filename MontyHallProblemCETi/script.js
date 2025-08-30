let prizeDoor;
let chosenDoor = null;
let revealedDoor = null;
let phase = 'picking'; // 'picking' | 'decide' | 'ended'
let gameOver = false;

const doors = document.querySelectorAll(".door");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const instruction = document.getElementById("instruction");

// Criar elementos de áudio
const winSound = new Audio();
winSound.src = "sons/ganhou.mp3"; // Altere para o caminho do seu arquivo de som
winSound.volume = 0.7; // Ajuste o volume (0.0 a 1.0)

const loseSound = new Audio();
loseSound.src = "sons/perdeu.mp3"; // Altere para o caminho do seu arquivo de som
loseSound.volume = 0.7; // Ajuste o volume (0.0 a 1.0)

// Inicializa o jogo
function startGame() {
  prizeDoor = Math.floor(Math.random() * 3);
  chosenDoor = null;
  revealedDoor = null;
  phase = 'picking';
  gameOver = false;

  message.textContent = "";
  instruction.textContent = "Escolha uma porta clicando nela!";
  restartBtn.style.display = "none";

  doors.forEach((door, i) => {
    door.style.backgroundColor = "white";
    door.querySelector("img").src = "imagens/porta.png";
    door.style.pointerEvents = "auto";
    door.style.border = "3px solid transparent";
    // garante dataset.index existente (caso não tenha no HTML)
    if (door.dataset.index === undefined) door.dataset.index = i;
  });
}

// Handler único para cliques nas portas (faz as duas fases dependendo de `phase`)
function onDoorClick(e) {
  const door = e.currentTarget;
  const i = parseInt(door.dataset.index, 10);

  if (gameOver) return;

  // Fase 1: escolha inicial
  if (phase === 'picking') {
    chosenDoor = i;

    // destaca escolha do jogador
    doors[chosenDoor].style.backgroundColor = "#a0e6a0";

    // escolhe porta para revelar (cabra), diferente da escolhida e do prêmio
    do {
      revealedDoor = Math.floor(Math.random() * 3);
    } while (revealedDoor === chosenDoor || revealedDoor === prizeDoor);

    doors[revealedDoor].style.backgroundColor = "#f28c8c";
    doors[revealedDoor].querySelector("img").src = "imagens/cabra.png";
    doors[revealedDoor].style.pointerEvents = "none"; // não clicável

    // porta restante (a outra que não foi escolhida nem revelada)
    const remainingDoor = [0, 1, 2].find(idx => idx !== chosenDoor && idx !== revealedDoor);
    doors[remainingDoor].style.backgroundColor = "#a0e6a0";

    instruction.textContent = `Você escolheu a porta ${chosenDoor + 1}`;
    message.textContent = `O apresentador abriu a porta ${revealedDoor + 1}! Clique na sua porta para manter ou na outra para trocar.`;

    // indica visualmente as duas portas possíveis (sua + a restante)
    doors[chosenDoor].style.border = "3px solid #1e90ff";
    doors[remainingDoor].style.border = "3px solid #1e90ff";

    // garante que apenas sua porta e a restante sejam clicáveis (revelada já foi desabilitada)
    doors.forEach((d, idx) => {
      d.style.pointerEvents = (idx === chosenDoor || idx === remainingDoor) ? "auto" : "none";
    });

    // passa para a fase de decisão
    phase = 'decide';
    return;
  }

  // Fase 2: decisão final (manter ou trocar)
  if (phase === 'decide') {
    // se o usuário clicar na porta revelada (improvável, pois pointerEvents = none), ignoramos
    if (i === revealedDoor) return;

    const finalChoice = i;
    endGame(finalChoice);
    return;
  }

  // Se chegou aqui, estamos em 'ended' ou estado inválido -> nada a fazer
}

// Finaliza o jogo mostrando ganhos/perdas
function endGame(finalChoice) {
  phase = 'ended';
  gameOver = true;

  // revela todas as portas: carro na prizeDoor, cabra nas outras
  doors.forEach((door, idx) => {
    const img = door.querySelector("img");
    if (idx === prizeDoor) {
      img.src = "imagens/carro.png";
    } else {
      img.src = "imagens/cabra.png";
    }
    door.style.pointerEvents = "none";
    door.style.border = "3px solid transparent";
  });

  if (finalChoice === prizeDoor) {
    message.textContent = "🎉 Você ganhou o CARRO!";
    
    // Tocar som de vitória (3 segundos)
    playWinSound();
  } else {
    message.textContent = `🐐 Você ficou na porta ${finalChoice + 1}. O carro estava na porta ${prizeDoor + 1}.`;
    
    // Tocar som de derrota (3 segundos)
    playLoseSound();
  }

  restartBtn.style.display = "inline-block";
}

// Função para tocar som de vitória (3 segundos)
function playWinSound() {
  try {
    // Para qualquer som que esteja tocando
    stopAllSounds();
    
    // Configurar para tocar
    winSound.play();
    
    // Parar após 3 segundos
    setTimeout(() => {
      winSound.pause();
      winSound.currentTime = 0;
    }, 3000); // 3000 ms = 3 segundos
    
  } catch (error) {
    console.log("Erro ao reproduzir som de vitória:", error);
  }
}

// Função para tocar som de derrota (3 segundos)
function playLoseSound() {
  try {
    // Para qualquer som que esteja tocando
    stopAllSounds();
    
    // Configurar para tocar
    loseSound.play();
    
    // Parar após 3 segundos
    setTimeout(() => {
      loseSound.pause();
      loseSound.currentTime = 0;
    }, 4000); // 3000 ms = 3 segundos
    
  } catch (error) {
    console.log("Erro ao reproduzir som de derrota:", error);
  }
}

// Função para parar todos os sons
function stopAllSounds() {
  winSound.pause();
  winSound.currentTime = 0;
  loseSound.pause();
  loseSound.currentTime = 0;
}

// liga o handler único nas portas (apenas uma vez)
doors.forEach(door => door.addEventListener("click", onDoorClick));

restartBtn.addEventListener("click", startGame);

// start
startGame();