import { SHAPES, BLOCK_IMAGES } from './shapes.js';

const INITIAL_DROP_INTERVAL = 999;
const COLS = 20;
const ROWS = 30;
const canvas = document.getElementById('board');
const BLOCK_SIZE = canvas.width / COLS; // Moved up
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
let requestId;
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
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let currentShapeIndex = 0; // Add this line to keep track of the current shape index
const SQUARE_COLOR_INDEX = 1;
const T_SHAPE_COLOR_INDEX = 2;
const Z_SHAPE_COLOR_INDEX = 3;
const A_SHAPE_COLOR_INDEX = 4;
const B_SHAPE_COLOR_INDEX = 5;
const C_SHAPE_COLOR_INDEX = 6;
const D_SHAPE_COLOR_INDEX = 7;
const E_SHAPE_COLOR_INDEX = 8;
const F_SHAPE_COLOR_INDEX = 9;
const G_SHAPE_COLOR_INDEX = 10;

const playPauseButton = document.getElementById('playPause');

playPauseButton.addEventListener('click', () => {
  if (isPaused) {
    // Resume the game
    gameLoop();
    playPauseButton.textContent = '⏸️'; // Update the symbol to pause
  } else {
    // Pause the game
    cancelAnimationFrame(requestId);
    playPauseButton.textContent = '▶️'; // Update the symbol to play
  }
  isPaused = !isPaused; // Toggle the pause state
});


function startTimer(duration) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        document.getElementById('timer').textContent = minutes + ':' + seconds;
        if (timer >= 0) timer--; // Decrement the timer value only if it's non-negative
    }, 1000);
}

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchStartTime = new Date().getTime(); // Record the touch start time
}

function handleTouchEnd(event) {
    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - touchStartTime;
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Check if the touch event is a tap (short duration and small movement)
    if (touchDuration < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        rotateShape(); // Rotate the shape
        return; // Exit the function to avoid handling as a swipe
    }

    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            moveShapeRight(); // Swipe right
        } else {
            moveShapeLeft(); // Swipe left
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
    // Swipe down
    while (!checkCollision(currentShape, currentPos.x, currentPos.y + 1) && currentPos.y < ROWS - 1) {
        currentPos.y += 1; // Drop to the bottom
    }
    mergeShape();
    currentShape = generateRandomShape();
    currentPos = { x: Math.floor(COLS / 2) - 2, y: 0 }; 
            } else {
            // Swipe up
            currentShape = generateRandomShape(); // Change to the next shape
        }
    }
}

function clearLines() {
    for (let y = 0; y < ROWS; y++) {
        let isLineFull = true;
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] === 0) {
                isLineFull = false;
                break;
            }
        }
        if (isLineFull) {
            // Remove the line and add a new empty line at the top
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            // Increment score or perform other actions as needed
        }
    }
}

function handleTouchTap() {
    rotateShape(); // Rotate the shape
}

function generateAShape() {
    const segment = A_SHAPE_COLOR_INDEX;
    return [
        [segment, segment, segment, segment, 0],
        [0, segment, 0, 0, 0],
        [0, , 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function getRandomSegment() {
    return Math.floor(Math.random() * SHAPES_COLORS.length);
}

function generateSquareShape() {
    const segment = SQUARE_COLOR_INDEX;
    return [
        [0, 0, segment, segment, 0],
        [0, 0, segment, segment, 0],
        [0, 0, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateBShape() {
    const segment = B_SHAPE_COLOR_INDEX;
    return [
        [segment, segment, segment, 0, 0],
        [0, 0, segment, 0, 0],
        [0, 0, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateCShape() {
    const segment = C_SHAPE_COLOR_INDEX;
    return [
        [0, 0, segment, segment, 0],
        [0, 0, segment, segment, 0],
        [0, 0, 0, segment, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateDShape() {
    const segment = D_SHAPE_COLOR_INDEX;
    return [
        [0, segment, 0, 0, 0],
        [segment, segment, segment, 0, 0],
        [0, segment, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateEShape() {
    const segment = E_SHAPE_COLOR_INDEX;
    return [
        [segment, 0, 0, 0, 0],
        [segment, 0, 0, 0, 0],
        [segment, segment, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateFShape() {
    const segment = F_SHAPE_COLOR_INDEX;
    return [
        [0, 0, segment, 0, 0],
        [0, 0, segment, 0, 0],
        [segment, segment, segment, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateGShape() {
    const segment = G_SHAPE_COLOR_INDEX;
    return [
        [segment, segment, 0, 0, 0],
        [segment, 0, 0, 0, 0],
        [segment, 0, 0, 0, 0],
        [segment, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}


function generateTShape() {
    const segment = T_SHAPE_COLOR_INDEX;
    return [
        [0, segment, 0, 0, 0],
        [segment, segment, segment, 0, 0],
        [segment, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateZShape() {
    const segment = Z_SHAPE_COLOR_INDEX;
    return [
        [segment, segment, 0, 0, 0],
        [0, segment, 0, 0, 0],
        [0, segment, 0, 0, 0],
        [0, segment, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}


function generateSShape() {
    const segment = S_SHAPE_COLOR_INDEX;
    return [
        [0, segment, segment, 0, 0],
        [segment, segment, 0, 0, 0],
        [0, segment, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateUShape() {
    const segment = U_SHAPE_COLOR_INDEX;
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
generateAShape, 
generateBShape, 
generateCShape, 
generateDShape, 
generateEShape, 
generateFShape, 
generateGShape, 
        generateUShape
    ];
    const randomIndex = Math.floor(Math.random() * shapeGenerators.length);
    return shapeGenerators[randomIndex]();
}

function drawShape(shape, x, y) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j]) {
                drawSegment(x + j, y + i, shape[i][j]); // Pass the color index
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

// Add missing generateStraightShape function
function generateStraightShape() {
    const segment = getRandomSegment();
    return [
        [segment, segment, segment, segment, segment],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
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
    const rotatedShape = currentShape[0].map((_, index) =>
        currentShape.map(row => row[index])
    );
    rotatedShape.forEach(row => row.reverse());
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
    clearLines(); // Add this line to clear full lines
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
    drawBoard();
    drawShape(currentShape, currentPos.x, currentPos.y);
    currentPos = { x: Math.floor(COLS / 2) - 2, y: 3 }; // Start 3 blocks from the top
   
}


function gameLoop(timestamp) {
    lastTime = lastTime || timestamp;
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (timestamp - lastTime > dropInterval) {
            moveShapeDown();
            lastTime = timestamp;
        }
        drawBoard();
        drawShape(currentShape, currentPos.x, currentPos.y); // Add arguments
    }
    requestId = requestAnimationFrame(gameLoop); // Update requestId
}

function startGame() {
  init();
  gameLoop();
  startTimer(60); // Start the timer with a duration of 60 seconds
  playPauseButton.textContent = '⏸️'; // Set the initial symbol to pause since the game starts automatically
}

const pauseButton = document.getElementById("pause"); // Get the pause button

function togglePause() {
    isPaused = !isPaused;
    if (!isPaused) {
        gameLoop();
    }
}
function drawSegment(x, y, colorIndex) {
  ctx.fillStyle = SHAPES_COLORS[colorIndex]; // Use the correct color from the array
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw Board Function
function drawBoard() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        drawSegment(x, y, board[y][x]); // Pass the color index
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

document.addEventListener('keydown', handleKeyDown);

canvas.focus(); // Ensure that the canvas is focused to receive key events

// Initialize the game
// init();

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);

window.onload = startGame;
