// DOM Elements
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');

const pauseButton = document.createElement('button');
document.body.appendChild(pauseButton);
pauseButton.innerText = "Pause";
pauseButton.className = 'pause-button';

// Constants
const BLOCK_SIZE = 20;
const COLS = 12;
const ROWS = 24;
const DROP_MULTIPLIER = 0.95;
let dropInterval = 1000; // 1 second

// Game State
let score = 0;
let level = 1;
let linesCleared = 0;
let isPaused = false;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentShape;
let currentPos = { x: COLS / 2 - 2, y: 0 };

// Loading Images
const blockImages = [];
for (let i = 1; i <= 14; i++) {
    const img = new Image();
    img.src = `assets/images/block${String(i).padStart(2, '0')}.png`;
    blockImages.push(img);
}

const pentaShapes = [
    // 5-long
    [[1, 1, 1, 1, 1]],

    // L-shape variations
    [[1, 1, 1, 1, 0], [1, 0, 0, 0, 0]],
    [[0, 1, 1, 1, 1], [0, 0, 0, 0, 1]],
    [[1, 0, 0, 0, 0], [1, 1, 1, 1, 0]],
    [[0, 0, 0, 0, 1], [0, 1, 1, 1, 1]],

    // T-shape variations
    [[1, 1, 1, 1, 0], [0, 1, 0, 0, 0]],
    [[1, 1, 1, 1, 0], [0, 0, 0, 1, 0]],
    [[0, 1, 0, 0, 0], [1, 1, 1, 1, 0]],
    [[0, 0, 0, 1, 0], [1, 1, 1, 1, 0]],

    // Z-shape variations
    [[1, 1, 1, 0, 0], [0, 0, 1, 1, 0]],
    [[0, 0, 0, 1, 1], [1, 1, 1, 0, 0]],
    [[0, 0, 1, 1, 0], [1, 1, 1, 0, 0]],
    [[1, 1, 1, 0, 0], [0, 0, 0, 1, 1]],

// U-shape
    [[1, 0, 0, 1, 0], [1, 1, 1, 1, 0]],

];
    
// Event Listeners
pauseButton.addEventListener('click', togglePause);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('dblclick', rotateShape);

function togglePause() {
    isPaused = !isPaused;
    pauseButton.innerText = isPaused ? "Resume" : "Pause";
}

let touchStartX = 0;
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const canvasRect = canvas.getBoundingClientRect();

    if (touchEndX < canvasRect.left + canvasRect.width / 2) moveShape(-1, 0);
    else moveShape(1, 0);

    if (touchEndX - touchStartX < -100) moveShape(-1, 0);
    else if (touchEndX - touchStartX > 100) moveShape(1, 0);
}

function handleTouchMove(event) {
    const touchY = event.touches[0].clientY;
    const canvasRect = canvas.getBoundingClientRect();

    if (touchY > canvasRect.bottom) {
        dropShape();
    }
}

function resetBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function drawBlock(x, y, imageIndex) {
    ctx.drawImage(blockImages[imageIndex], BLOCK_SIZE * x, BLOCK_SIZE * y, BLOCK_SIZE, BLOCK_SIZE);
}

function drawShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                drawBlock(currentPos.x + x, currentPos.y + y, currentShape[y][x] - 1);
            }
        }
    }
}

function spawnShape() {
    currentShape = pentaShapes[Math.floor(Math.random() * pentaShapes.length)];
    currentPos = { x: COLS / 2 - 2, y: 0 };
}

function dropShape() {
    if (!isCollision(board, currentShape, currentPos.x, currentPos.y + 1)) {
        currentPos.y++;
    } else {
        mergeBoard(board, currentShape, currentPos.x, currentPos.y);
        checkForLines();
        spawnShape();
        if (isCollision(board, currentShape, currentPos.x, currentPos.y)) {
            console.log("Game Over");
        }
    }
}

function checkForLines() {
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            y++;
            score += 100;
            linesCleared++;

            if (linesCleared % 5 === 0) {
                level++;
                dropInterval *= DROP_MULTIPLIER;
            }
            scoreElement.textContent = "Score: " + score;
            levelElement.textContent = "Level: " + level;
        }
    }
}

function isCollision(board, shape, posX, posY) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] && (board[y + posY] && board[y + posY][x + posX]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function moveShape(dx, dy) {
    if (!isCollision(board, currentShape, currentPos.x + dx, currentPos.y + dy)) {
        currentPos.x += dx;
        currentPos.y += dy;
    }
}

function mergeBoard(board, shape, posX, posY) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                board[y + posY][x + posX] = shape[y][x];
            }
        }
    }
}

function rotateShape() {
    const oldShape = currentShape;
    currentShape = currentShape[0].map((_, index) => currentShape.map(row => row[index])).reverse();
    if (isCollision(board, currentShape, currentPos.x, currentPos.y)) {
        currentShape = oldShape;
    }
}

let lastTime = 0;
function gameLoop(timestamp) {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (timestamp - lastTime > dropInterval) {
            dropShape();
            lastTime = timestamp;
        }
        drawShape();
    }
    requestAnimationFrame(gameLoop);
}

function startGame() {
    resetBoard();
    spawnShape();
    gameLoop();
}

startGame();
