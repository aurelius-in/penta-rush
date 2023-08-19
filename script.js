// Board Initialization
const INITIAL_DROP_INTERVAL = 999;
const COLS = 15;
const ROWS = 25;
const BLOCK_SIZE = 20;
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const startButton = document.getElementById("start");
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let level = 1;
let linesCleared = 0;
let dropInterval = INITIAL_DROP_INTERVAL;
let isPaused = false;
let currentShape = null;
let currentPos = { x: Math.floor(COLS / 2) - 2, y: 2 };
const SHAPES_COLORS = [null, "#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f", "#f90"];
let lastTime = 0;



// Shape Colors
const SHAPES_COLORS = [null, "#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f", "#f90"];

// Current Shape Info
let currentShape = null;
let currentPos = { x: 0, y: 0 };

// Shape Colors
const SHAPES_COLORS = [null, "#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f", "#f90"];

function getRandomSegment() {
    return Math.floor(Math.random() * SHAPES_COLORS.length);
}

// Shapes Generation
function generateStraightShape() {
    const segment = getRandomSegment();
    return [
        [0, 0, segment, 0, 0],
        [0, 0, segment, 0, 0],
        [0, 0, segment, 0, 0],
        [0, 0, segment, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateSquareShape() {
    const segment = getRandomSegment();
    return [
        [0, 0, segment, segment, 0],
        [0, 0, segment, segment, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateTShape() {
    const segment = getRandomSegment();
    return [
        [0, segment, 0, 0, 0],
        [segment, segment, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateZShape() {
    const segment = getRandomSegment();
    return [
        [segment, segment, 0, 0, 0],
        [0, segment, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateSShape() {
    const segment = getRandomSegment();
    return [
        [0, segment, segment, 0, 0],
        [segment, segment, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateUShape() {
    const segment = getRandomSegment();
    return [
        [segment, 0, segment, 0, 0],
        [segment, segment, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateRandomShape() {
    const shapeGenerators = [
        generateStraightShape, 
        generateSquareShape, 
        generateTShape, 
        generateZShape, 
        generateSShape, 
        generateUShape
    ];
    const randomIndex = Math.floor(Math.random() * shapeGenerators.length);
    return shapeGenerators[randomIndex]();
}

function drawShape(shape, x, y) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                drawSegment(x + j, y + i, SHAPES_COLORS[shape[i][j]]);
            }
        }
    }
}

function moveShapeDown() {
    if (!checkCollision(currentShape, currentPos.x, currentPos.y + 1)) {
        currentPos.y += 1;
    } else {
        mergeShape();
        currentShape = generateRandomShape();
        currentPos = { x: Math.floor(COLS / 2) - 2, y: 0 };
        if (checkCollision(currentShape, currentPos.x, currentPos.y)) {
            // End of the game
            alert("Game Over!");
            init();
        }
    }
}

function moveShapeLeft() {
    if (!checkCollision(currentShape, currentPos.x - 1, currentPos.y)) {
        currentPos.x -= 1;
    }
}

function moveShapeRight() {
    if (!checkCollision(currentShape, currentPos.x + 1, currentPos.y)) {
        currentPos.x += 1;
    }
}

function rotateShape() {
    const rotatedShape = [];
    for (let x = 0; x < currentShape[0].length; x++) {
        rotatedShape[x] = [];
        for (let y = 0; y < currentShape.length; y++) {
            rotatedShape[x][y] = currentShape[y][x];
        }
    }
    if (!checkCollision(rotatedShape, currentPos.x, currentPos.y)) {
        currentShape = rotatedShape;
    }
}

function checkCollision(shape, x, y) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                if (y + i < 0 || y + i >= ROWS || x + j < 0 || x + j >= COLS || board[y + i][x + j] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mergeShape() {
    for (let i = 0; i < currentShape.length; i++) {
        for (let j = 0; j < currentShape[i].length; j++) {
            if (currentShape[i][j]) {
                board[currentPos.y + i][currentPos.x + j] = currentShape[i][j];
            }
        }
    }
}

function init() {
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    level = 1;
    linesCleared = 0;
    dropInterval = INITIAL_DROP_INTERVAL;
    isPaused = false;
    currentShape = generateRandomShape();
    currentPos = { x: Math.floor(COLS / 2) - 2, y: 2 };

    drawBoard();
    drawShape(currentShape, currentPos.x, currentPos.y); // Updated drawShape call
}


function gameLoop(timestamp) {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (timestamp - lastTime > dropInterval) {
            moveShapeDown();
            lastTime = timestamp;
        }

        drawBoard();
        drawShape();
    }
    requestAnimationFrame(gameLoop);
}


function startGame() {
    init();
    gameLoop();
}


function togglePause() {
    isPaused = !isPaused;
    if (!isPaused) {
        gameLoop();
    }
}

// Draw Segment Function
function drawSegment(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw Board Function
function drawBoard() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        drawSegment(x, y, SHAPES_COLORS[board[y][x]]);
      }
    }
  }
}

// Handle Key Down Function
function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowLeft":
      moveShapeLeft();
      break;
    case "ArrowRight":
      moveShapeRight();
      break;
    case "ArrowDown":
      moveShapeDown();
      break;
    case "ArrowUp":
      rotateShape();
      break;
  }
}

startButton.addEventListener('click', startGame);
canvas.addEventListener('keydown', handleKeyDown);

canvas.focus(); // Ensure that the canvas is focused to receive key events

pauseButton.addEventListener('click', togglePause);
canvas.focus(); // Ensure that the canvas is focused to receive key events

init(); // Initialize the game

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('dblclick', rotateShape);
