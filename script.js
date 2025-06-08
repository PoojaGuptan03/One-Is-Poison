let board = document.getElementById("gameBoard");
let message = document.getElementById("message");
let poisonIndex;
let gameOver = false;
let currentDifficulty = 12;
    
// Stats tracking
let stats = {
  gamesPlayed: parseInt(localStorage.getItem('gamesPlayed') || '0'),
  gamesWon: parseInt(localStorage.getItem('gamesWon') || '0'),
  currentStreak: parseInt(localStorage.getItem('currentStreak') || '0')
};

function updateStats() {
  document.getElementById('gamesPlayed').textContent = stats.gamesPlayed;
  document.getElementById('gamesWon').textContent = stats.gamesWon;
  document.getElementById('winRate').textContent = 
    stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) + '%' : '0%';
  document.getElementById('streak').textContent = stats.currentStreak;
  
  localStorage.setItem('gamesPlayed', stats.gamesPlayed);
  localStorage.setItem('gamesWon', stats.gamesWon);
  localStorage.setItem('currentStreak', stats.currentStreak);
}

function setDifficulty(num) {
  currentDifficulty = num;
  document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  createGame(num);
}

function createGame(num = currentDifficulty) {
  board.innerHTML = "";
  board.className = `game-board grid-${num}`;
  poisonIndex = Math.floor(Math.random() * num);
  gameOver = false;
  message.textContent = "Choose your cups wisely... ☠️";
  message.className = "message";

  for (let i = 0; i < num; i++) {
    const cup = document.createElement("div");
    cup.classList.add("cup");
    cup.dataset.index = i;

    cup.addEventListener("click", () => handleClick(i, cup));
    board.appendChild(cup);
    
    setTimeout(() => {
      cup.style.animation = `slideInRight 0.5s ease-out ${i * 0.05}s both`;
    }, 100);
  }
}

function handleClick(index, element) {
  if (gameOver || element.classList.contains("safe") || element.classList.contains("poison")) return;

  if (index == poisonIndex) {
    element.classList.add("poison");
    message.textContent = "💀 You found the poison! Game Over!";
    message.className = "message lose";
    gameOver = true;
    stats.gamesPlayed++;
    stats.currentStreak = 0;
    updateStats();
    
    // Reveal all cups after a delay
    setTimeout(() => {
      revealAllCups();
    }, 1000);
  } else {
    element.classList.add("safe");
    checkWin();
  }
}

function checkWin() {
  const safeClicked = document.querySelectorAll(".cup.safe").length;
  if (safeClicked === board.children.length - 1) {
    message.textContent = "🎉 Congratulations! You avoided the poison!";
    message.className = "message win";
    gameOver = true;
    stats.gamesPlayed++;
    stats.gamesWon++;
    stats.currentStreak++;
    updateStats();
    
    // Celebration effect
    setTimeout(() => {
      createConfetti();
    }, 500);
  }
}

function revealAllCups() {
  document.querySelectorAll('.cup').forEach((cup, index) => {
    if (!cup.classList.contains('safe') && !cup.classList.contains('poison')) {
      if (index == poisonIndex) {
        cup.classList.add('poison');
      } else {
        cup.classList.add('safe');
      }
    }
  });
}

function createConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.innerHTML = ['🎉', '✨', '🎊', '⭐'][Math.floor(Math.random() * 4)];
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.fontSize = '2rem';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1000';
    confetti.style.animation = `fall ${2 + Math.random() * 3}s linear forwards`;
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 5000);
  }
}

function resetGame() {
  createGame(currentDifficulty);
}

// Add falling animation for confetti
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

updateStats();
createGame();