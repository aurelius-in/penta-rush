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

    // And so on for other pentomino shapes...
];

// Rest of your code...

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

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShape();
    dropShape();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    resetBoard();
    spawnShape();
    gameLoop();
}

startGame();
