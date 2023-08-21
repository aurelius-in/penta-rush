import { SHAPES_COLORS, generateStraightShape, generateAShape, generateSquareShape, generateBShape, generateCShape, generateDShape, generateEShape, generateFShape, generateGShape, generateTShape, generateZShape, generateSShape, generateUShape, generateRandomShape } from './shapes.js';
import {
  SQUARE_COLOR_INDEX,
STRAIGHT_COLOR_INDEX,
  T_SHAPE_COLOR_INDEX,
  A_SHAPE_COLOR_INDEX,
  B_SHAPE_COLOR_INDEX,
  C_SHAPE_COLOR_INDEX,
  D_SHAPE_COLOR_INDEX,
  E_SHAPE_COLOR_INDEX,
  F_SHAPE_COLOR_INDEX,
  G_SHAPE_COLOR_INDEX,
  Z_SHAPE_COLOR_INDEX,
  S_SHAPE_COLOR_INDEX,
  U_SHAPE_COLOR_INDEX
} from './shapes.js';

const COLS = 20;
const ROWS = 35;
const canvas = document.getElementById('board');
const gameContainer = document.getElementById('game-container');
const BLOCK_SIZE = gameContainer.offsetWidth / COLS;
canvas.width = gameContainer.offsetWidth; // 95% of the screen width
canvas.height = ROWS * BLOCK_SIZE; // Adjusted based on the number of rows
const INITIAL_DROP_INTERVAL = 1000; // Example value for the drop interval
const SEGMENT_SIZE = BLOCK_SIZE; // Example value for the segment size
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
let lastTime = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let timerInterval; // Declare a variable to hold the timer interval
let currentShapeIndex = 0; // Add this line to keep track of the current shape index

const playPauseButton = document.getElementById('playPause');

let timer = 180; // 3 minutes

playPauseButton.addEventListener('click', () => {
  if (isPaused) {
    // Resume the game
    gameLoop();
    playPauseButton.textContent = '⏸️';
    timerInterval = setInterval(decrementTimer, 1000); // Resume the timer
  } else {
    // Pause the game
    cancelAnimationFrame(requestId);
    playPauseButton.textContent = '▶️';
    clearInterval(timerInterval); // Pause the timer
  }
  isPaused = !isPaused; // Corrected line
});

  function startTimer() {
  timerInterval = setInterval(decrementTimer, 1000); // Assign the interval to the variable
}

function decrementTimer() {
  let minutes = parseInt(timer / 60, 10);
  let seconds = parseInt(timer % 60, 10);
  seconds = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById('timer').textContent = minutes + ':' + seconds;
  if (timer >= 0) timer--;
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
  let linesCleared = 0;

  for (let row = 0; row < ROWS; row++) {
    if (board[row].every(segment => segment)) {
      // Call the animation function for the cleared row
      animateClearedLine(row);

      // Increment the number of lines cleared
      linesCleared++;
    }
  }

  if (linesCleared > 0) {
    // Increase the level number
    level++;

    // Update the score based on the level points and lines cleared
    score += level * linesCleared + 11;

    // Update the level and score display on the screen
    document.getElementById('level').innerText = `Level: ${level}`;
    document.getElementById('score').innerText = `Score: ${score}`;

    // TO DO: add logic to increase the game speed based on the new level
  }
}


function handleTouchTap() {
    rotateShape(); // Rotate the shape
}

function getRandomSegment() {
    return Math.floor(Math.random() * SHAPES_COLORS.length);
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
  startTimer(); // Start the timer with a duration of 3 minutes
  playPauseButton.textContent = '⏸️';
}

function togglePause() {
    isPaused = !isPaused;
    if (!isPaused) {
        gameLoop();
    }
}
function drawSegment(x, y, colorIndex) {
  const color = SHAPES_COLORS[colorIndex]; // Get the color from the SHAPES_COLORS array
  ctx.fillStyle = color;
  ctx.fillRect(x * SEGMENT_SIZE, y * SEGMENT_SIZE, SEGMENT_SIZE, SEGMENT_SIZE);

  // Add a thicker grey outline
  ctx.strokeStyle = "#808080";
  ctx.lineWidth = 3; // Thicker line width
  ctx.strokeRect(x * SEGMENT_SIZE, y * SEGMENT_SIZE, SEGMENT_SIZE, SEGMENT_SIZE);
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

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
window.onload = startGame;
