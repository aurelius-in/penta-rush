// Constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const DROP_INTERVAL_INITIAL = 1000;
const DROP_MULTIPLIER = 0.95;
const CANVAS_WIDTH = COLS * BLOCK_SIZE;
const CANVAS_HEIGHT = ROWS * BLOCK_SIZE;

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const pauseButton = document.getElementById('pauseButton');
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');

// Game Variables
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentShape;
let currentPos = { x: 0, y: 0 };
let dropInterval = DROP_INTERVAL_INITIAL;
let score = 0;
let linesCleared = 0;
let level = 1;
let isPaused = false;

// Drawing Functions
function drawBlock(x, y, image) {
    ctx.drawImage(image, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                drawBlock(currentPos.x + x, currentPos.y + y, blockImages[currentShape[y][x]]);
            }
        }
    }
}

function drawBoard() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(x, y, blockImages[board[y][x]]);
            }
        }
    }
}

// Helper Functions
function resetBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomShape() {
    const shapes = [
        [[1, 1, 1, 1]],
        [[1, 1], [1, 1]],
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1, 1], [1, 1]],
        [[1, 1, 1], [0, 1, 0]],
        [[1, 1, 1], [1, 0, 0]],
        [[1, 1, 1], [0, 0, 1]]
    ];
    return shapes[getRandomInt(0, shapes.length - 1)];
}

function spawnShape() {
    currentShape = getRandomShape();
    currentPos.y = 0;
    currentPos.x = Math.floor((COLS - currentShape[0].length) / 2);
}

function handleKeyDown(e) {
    switch (e.keyCode) {
        case 37: // Left Arrow
            moveShape(-1, 0);
            break;
        case 39: // Right Arrow
            moveShape(1, 0);
            break;
        case 40: // Down Arrow
            moveShape(0, 1);
            break;
        case 38: // Up Arrow
            rotateShape();
            break;
    }
}

// Shapes Generation
function generateStraightShape() {
    const segment = getRandomSegment();
    return [[segment, segment, segment, segment]];
}

function generateSquareShape() {
    const segment = getRandomSegment();
    return [
        [segment, segment],
        [segment, segment]
    ];
}

function generateZShape() {
    const segments = Array(3).fill(0).map(_ => getRandomSegment());
    return [
        [segments[0], segments[1], 0],
        [0, segments[1], segments[2]]
    ];
}


const shapeGenerators = [generateLShape, ...]; // list all your shape generating functions


function dropShape() {
    while (!isCollision(board, currentShape, currentPos.x, currentPos.y + 1)) {
        currentPos.y++;
    }
    mergeBoard(board, currentShape, currentPos.x, currentPos.y);
    checkForLines();
    spawnShape();
    if (isCollision(board, currentShape, currentPos.x, currentPos.y)) {
        console.log("Game Over");
    }
}

function getRandomSegment() {
    const randomIndex = Math.floor(Math.random() * blockImages.length) + 1;
    return randomIndex;
}

function generateStraightShape() {
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [segments[0], 0, 0, 0, 0],
        [segments[1], 0, 0, 0, 0],
        [segments[2], 0, 0, 0, 0],
        [segments[3], 0, 0, 0, 0],
        [segments[4], 0, 0, 0, 0]
    ];
}

function generateLShape() {
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [segments[0], 0, 0, 0, 0],
        [segments[1], 0, 0, 0, 0],
        [segments[2], 0, 0, 0, 0],
        [segments[3], 0, 0, 0, 0],
        [segments[4], segments[4], 0, 0, 0]
    ];
}

function generateJShape() {
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [0, 0, 0, 0, segments[0]],
        [0, 0, 0, 0, segments[1]],
        [0, 0, 0, 0, segments[2]],
        [0, 0, 0, 0, segments[3]],
        [0, 0, 0, segments[4], segments[4]]
    ];
}

function generateTShape() {
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [segments[0], segments[1], segments[2], 0, 0],
        [0, segments[3], 0, 0, 0],
        [0, segments[4], 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateZShape() {
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [segments[0], segments[1], 0, 0, 0],
        [0, segments[2], 0, 0, 0],
        [0, segments[3], segments[4], 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateSShape() {
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [0, segments[0], segments[1], 0, 0],
        [0, segments[2], 0, 0, 0],
        [segments[3], segments[4], 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

// Shapes Generation (continued from Section 2)
function generateUShape() {
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [segments[0], 0, segments[1], 0, 0],
        [segments[2], segments[3], segments[4], 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateRandomShape() {
    const shapeGenerators = [
        generateStraightShape, 
        generateSquareShape, 
        generateZShape, 
        // ... Add other shape generation functions here ...
        generateUShape
    ];
    const randomIndex = Math.floor(Math.random() * shapeGenerators.length);
    return shapeGenerators[randomIndex]();
}

// Game Logic
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
                levelElement.textContent = "Level: " + level;
            }
            scoreElement.textContent = "Score: " + score;
        }
    }
}

function isCollision(board, shape, posX, posY) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] && (board[y + posY] && board[y + posY][x + posX]) !== 0) {
                console.log('Collision detected at:', x + posX, y + posY);  // Debugging line
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
        console.log('Shape moved to:', currentPos.x, currentPos.y);  // Debugging line
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
            moveShape(0, 1); // This will try to move the shape down
            lastTime = timestamp;
        }
    
        drawBoard();
        drawShape();
    }
    requestAnimationFrame(gameLoop);
}

function startGame() {
    resetBoard();
    spawnShape();
    if (!isPaused) gameLoop();
}

// Event Listeners (continue from Section 2)
pauseButton.addEventListener('click', togglePause);
startButton.addEventListener('click', startGame);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleTouchStart(e);
});
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('dblclick', rotateShape);
document.addEventListener('keydown', handleKeyDown);

function togglePause() {
    isPaused = !isPaused;
    pauseButton.innerText = isPaused ? "Resume" : "Pause";
}

// Don't auto-start the game
// startGame();
