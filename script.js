import { SHAPES, BLOCK_IMAGES } from './shapes.js';

const INITIAL_DROP_INTERVAL = 999;
const COLS = 20;
const ROWS = 30;
const canvas = document.getElementById('game-canvas');
const BLOCK_SIZE = canvas.width / COLS; // Moved up
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const startButton = document.getElementById("start");

const blockImages = [];
let imagesLoaded = 0;
BLOCK_IMAGES.forEach((src, index) => {
  const img = new Image(); // Create a new Image object
  img.src = src;
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === BLOCK_IMAGES.length) {
      startButton.disabled = false; // Enable the start button
    }
  };
  blockImages[index] = img; // Store the image object in the array
});

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

function startTimer(duration) {
  setInterval(countDown, 1000); 
  var timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    // Update the timer display here
    if (--timer < 0) {
      timer = duration;
    }
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
}
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

function getRandomSegment() {
    return Math.floor(Math.random() * SHAPES_COLORS.length);
}

// Shapes Generation
function generateRandomShape() {
    const shape = SHAPES[currentShapeIndex];
    currentShapeIndex = (currentShapeIndex + 1) % SHAPES.length; // Cycle through the shapes iteratively
    return shape;
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
                const blockImage = BLOCK_IMAGES[shape[i][j]]; // Get the block image for the shape
                drawSegment(x + j, y + i, blockImage); // Use the block image to draw the segment
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
    currentPos = { x: Math.floor(COLS / 2) - 2, y: 2 }; // Keep this initialization
    drawBoard();
    drawShape(currentShape, currentPos.x, currentPos.y);
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
    requestAnimationFrame(gameLoop);
}

function startGame() {
    init();
    gameLoop();
  updateGameArea(); 
  startTimer();
}

const pauseButton = document.getElementById("pause"); // Get the pause button

function togglePause() {
    isPaused = !isPaused;
    if (!isPaused) {
        gameLoop();
    }
}

// Draw Segment Function
function drawSegment(x, y, colorIndex) {
  if (imagesLoaded === BLOCK_IMAGES.length) { // Check if all images are loaded
    const img = blockImages[board[y][x]];
    if (img) {
      ctx.drawImage(img, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      return; // Exit if image is drawn
    }
  }

  // Fallback to drawing a rectangle if the image is not loaded
  ctx.fillStyle = SHAPES_COLORS[colorIndex]; // Use the color index directly
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

document.addEventListener('keydown', handleKeyDown);

canvas.focus(); // Ensure that the canvas is focused to receive key events

init(); // Initialize the game

pauseButton.addEventListener('click', togglePause); // Add event listener
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
