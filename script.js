// Board Initialization
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let level = 1;
let linesCleared = 0;
let dropInterval = 1000;
const DROP_MULTIPLIER = 0.9;
let isPaused = false;

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
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [0, segments[0], 0, 0, 0],
        [segments[1], segments[2], segments[3], 0, 0],
        [0, segments[4], 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateZShape() {
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [segments[0], segments[1], 0, 0, 0],
        [0, segments[2], segments[3], 0, 0],
        [0, 0, segments[4], 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

function generateSShape() {
    const segments = Array(5).fill(0).map(_ => getRandomSegment());
    return [
        [0, segments[0], segments[1], 0, 0],
        [segments[2], segments[3], 0, 0, 0],
        [0, segments[4], 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];
}

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
        generateTShape, 
        generateZShape, 
        generateSShape, 
        generateUShape
    ];
    const randomIndex = Math.floor(Math.random() * shapeGenerators.length);
    return shapeGenerators[randomIndex]();
}

function resetBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function spawnShape() {
    currentShape = generateRandomShape();
    currentPos = { x: Math.floor(COLS / 2) - 2, y: 0 };

    if (isCollision(board, currentShape, currentPos.x, currentPos.y)) {
        resetBoard();
        score = 0;
        level = 1;
        scoreElement.textContent = "Score: " + score;
        levelElement.textContent = "Level: " + level;
    }
}

function drawBoard() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                ctx.fillStyle = SHAPES_COLORS[board[y][x]];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                ctx.fillStyle = SHAPES_COLORS[currentShape[y][x]];
                ctx.fillRect((x + currentPos.x) * BLOCK_SIZE, (y + currentPos.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect((x + currentPos.x) * BLOCK_SIZE, (y + currentPos.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
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
    } else if (dy === 1) {
        // If collision occurs while moving down
        mergeBoard(board, currentShape, currentPos.x, currentPos.y);
        checkForLines();
        spawnShape();
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

let startingX = 0;
let startingY = 0;
let isTapped = false;  // To detect tap vs swipe

function handleTouchStart(e) {
    // Record the starting touch position
    startingX = e.touches[0].clientX;
    startingY = e.touches[0].clientY;
    isTapped = true;
}

function handleTouchEnd() {
    // If it was just a tap (not a swipe), rotate the shape
    if (isTapped) {
        rotateShape();
        return;
    }

    const deltaX = startingX - e.changedTouches[0].clientX;
    const deltaY = startingY - e.changedTouches[0].clientY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Detected horizontal swipe
        if (deltaX > 0) {
            // Swipe left
            moveShape(-1, 0);
        } else {
            // Swipe right
            moveShape(1, 0);
        }
    } else {
        // Detected vertical swipe
        if (deltaY > 0) {
            // Swipe up
            // Assuming you have a function called nextShape() to change to the next shape in the queue
            nextShape();
        } else {
            // Swipe down
            // Loop to keep moving the shape down until it collides
            while (!isCollision(board, currentShape, currentPos.x, currentPos.y + 1)) {
                moveShape(0, 1);
            }
        }
    }
}

function handleTouchMove(e) {
    // Detecting tap by checking if there's any movement
    const movingX = e.touches[0].clientX;
    const movingY = e.touches[0].clientY;

    if (Math.abs(movingX - startingX) > 10 || Math.abs(movingY - startingY) > 10) {
        isTapped = false;
    }
}

function handleKeyDown(event) {
    switch (event.keyCode) {
        case 37: // Left arrow
            moveShape(-1, 0);
            break;
        case 39: // Right arrow
            moveShape(1, 0);
            break;
        case 40: // Down arrow
            moveShape(0, 1);
            break;
        case 38: // Up arrow
            rotateShape();
            break;
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

pauseButton.addEventListener('click', togglePause);
startButton.addEventListener('click', startGame);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('dblclick', rotateShape);
document.addEventListener('keydown', handleKeyDown);

function drawBoard() {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x]) {
                ctx.fillStyle = COLORS[board[y][x]];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                ctx.fillStyle = COLORS[currentShape[y][x]];
                ctx.fillRect((x + currentPos.x) * BLOCK_SIZE, (y + currentPos.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect((x + currentPos.x) * BLOCK_SIZE, (y + currentPos.y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function spawnShape() {
    currentShape = generateRandomShape();
    currentPos = { x: Math.floor(COLS / 2) - Math.floor(currentShape[0].length / 2), y: 0 };

    // Check for game over condition - if new shape collides right when it spawns
    if (isCollision(board, currentShape, currentPos.x, currentPos.y)) {
        gameOver();
    }
}

function gameOver() {
    alert("Game Over!");
    resetBoard();
    score = 0;
    linesCleared = 0;
    level = 1;
    dropInterval = INITIAL_DROP_INTERVAL;
    levelElement.textContent = "Level: 1";
    scoreElement.textContent = "Score: 0";
}

// Now, initialize the game, but don't start it immediately:
resetBoard();

