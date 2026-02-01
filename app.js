let score = 0;
let timeLeft = 10; 
let gameInterval;
let animationId;
let isPlaying = false;

let playerPos = 0;
let moveSpeed = 10; 
let keys = {};

let ballY = -100;
let ballX = 0;
let ballSpeed = 6;

const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const player = document.getElementById('player');
const ball = document.getElementById('falling-obj');
const overlay = document.getElementById('overlay');
const feedback = document.getElementById('feedback');
const container = document.querySelector('.game-container');
const bgMusic = document.getElementById('bg-music');

// ইনপুট লিসেনার
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

// মোবাইল টাচ কন্ট্রোল
container.addEventListener('touchmove', (e) => {
    if (!isPlaying) return;
    e.preventDefault();
    let touch = e.touches[0];
    let rect = container.getBoundingClientRect();
    let x = touch.clientX - rect.left - (player.offsetWidth / 2);
    
    if (x >= 0 && x <= rect.width - player.offsetWidth) {
        playerPos = x;
        player.style.left = playerPos + 'px';
    }
}, { passive: false });

function handleMovement() {
    if (!isPlaying) return;
    let containerWidth = container.offsetWidth;
    let playerWidth = player.offsetWidth;

    if (keys['ArrowLeft'] && playerPos > 0) {
        playerPos -= moveSpeed;
    }
    if (keys['ArrowRight'] && playerPos < containerWidth - playerWidth) {
        playerPos += moveSpeed;
    }
    player.style.left = playerPos + 'px';
}

function startGame() {
    score = 0; timeLeft = 10; ballSpeed = 6; isPlaying = true;
    scoreEl.innerText = score; timeEl.innerText = timeLeft;
    overlay.style.display = 'none';
    
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
    
    playerPos = (container.offsetWidth / 2) - (player.offsetWidth / 2);
    player.style.left = playerPos + 'px';

    resetBall();
    gameLoop();
    
    gameInterval = setInterval(() => {
        timeLeft--;
        timeEl.innerText = timeLeft;
        if(timeLeft % 2 === 0) ballSpeed += 1.5; 
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    cancelAnimationFrame(animationId);
    bgMusic.pause();
    
    document.getElementById('final-message').innerHTML = 
        `<span style="color:#4caf50; font-size:1.8rem;">ঋণ খেলাপিকে থামাতে সফল!</span><br>
         <span style="font-size:1.4rem;"Score: ${score} </span>`;
    
    overlay.style.display = 'flex';
}

function resetBall() {
    ballY = -100;
    ballX = Math.floor(Math.random() * (container.offsetWidth - ball.offsetWidth));
    ball.style.left = ballX + 'px';
}

function gameLoop() {
    if (!isPlaying) return;
    handleMovement();
    ballY += ballSpeed;
    ball.style.top = ballY + 'px';
    checkCollision();
    if (ballY > container.offsetHeight) resetBall();
    animationId = requestAnimationFrame(gameLoop);
}

function checkCollision() {
    const pRect = player.getBoundingClientRect();
    const bRect = ball.getBoundingClientRect();

    if (
        bRect.bottom >= pRect.top + 20 && 
        bRect.top < pRect.bottom &&
        bRect.right >= pRect.left + 20 &&
        bRect.left <= pRect.right - 20
    ) {
        score += 10;
        scoreEl.innerText = score;
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 200);
        resetBall();
    }
}
