// DOM Elements
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Constants
const BLOCK_SIZE = 20;
const COLS = 12;
const ROWS = 24;

// Game Variables
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let currentShape;
let currentPos = { x: COLS / 2 - 2, y: 0 }; // Center the shape at the top


// Penta-shapes
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

// Rest of your code...

function resetBoard() {
function resetBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function drawBlock(x, y) {
    ctx.fillRect(BLOCK_SIZE * x, BLOCK_SIZE * y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeRect(BLOCK_SIZE * x, BLOCK_SIZE * y, BLOCK_SIZE, BLOCK_SIZE);
}

function drawShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                drawBlock(currentPos.x + x, currentPos.y + y);
            }
        }
    }
}

function spawnShape() {
    currentShape = pentaShapes[Math.floor(Math.random() * pentaShapes.length)];
    currentPos = { x: COLS / 2 - 2, y: 0 };
}

function dropShape() {
    // Check if moving down causes a collision
    if (!isCollision(board, currentShape, currentPos.x, currentPos.y + 1)) {
        currentPos.y++;
    } else {
        // Merge the current shape into the board because it can't move down anymore
        mergeBoard(board, currentShape, currentPos.x, currentPos.y);

        // Check for line clears here (if implemented)

        // Spawn a new shape at the top
        spawnShape();

        // Optionally: Check if the new shape immediately collides, signaling a Game Over
        if (isCollision(board, currentShape, currentPos.x, currentPos.y)) {
            // Handle game over (e.g., stop game loop, show game over message)
            console.log("Game Over");
            // Here you can stop the game loop and provide other feedback to the player.
            return;
        }
    }
}

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, false);

canvas.addEventListener('touchend', (e) => {
    let deltaX = e.changedTouches[0].clientX - touchStartX;
    let deltaY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            moveShape(1, 0);
        } else {
            moveShape(-1, 0);
        }
    } else {
        if (deltaY > 0) {
            while (!isCollision(board, currentShape, currentPos.x, currentPos.y + 1)) {
                currentPos.y++;
            }
        } else {
            spawnShape();
        }
    }
}, false);

canvas.addEventListener('click', () => {
    rotateShape();
});

let lastTime = 0;
const dropInterval = 1000;

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timestamp - lastTime > dropInterval) {
        dropShape();
        lastTime = timestamp;
    }

    drawShape();
    requestAnimationFrame(gameLoop);
}

function displayAllShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pentaShapes.forEach((shape, index) => {
        let x = index * 6;
        let y = 5;

        shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value) {
                    drawBlock(x + colIndex, y + rowIndex);
                }
            });
        });
    });
}

function startGame() {
    displayAllShapes();

    setTimeout(() => {
        resetBoard();
        spawnShape();
        gameLoop();
    }, 5000);
}

startGame();

