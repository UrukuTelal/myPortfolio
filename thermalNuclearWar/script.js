const board = document.getElementById('game-board');
const restartButton = document.getElementById('restart');
const xWinsDisplay = document.getElementById('x-wins');
const oWinsDisplay = document.getElementById('o-wins');
const drawsDisplay = document.getElementById('draws');
const gamesPlayedDisplay = document.getElementById('games-played'); // New reference

let currentPlayer = 'X'; // Player is 'X'
let playerActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let drawCount = 0; // To track the number of draws
let xWins = 0; // Count of X wins
let oWins = 0; // Count of O wins
let gameCount = 0; // Track the number of completed games


// Create the game board
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-cell-index', i);
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
}

// Handle cell click
function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-cell-index');

    if (gameState[cellIndex] !== '' || !isGameActive || currentPlayer === 'O' || playerActive == false) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    cell.innerText = currentPlayer;
    checkResult();

    if (isGameActive) {
        currentPlayer = 'O'; // Switch to AI
        aiMove();
    }
}

// AI Move
function aiMove() {
    let bestMove = findBestMove();
    if (bestMove !== -1) {
        gameState[bestMove] = currentPlayer;
        document.querySelector(`[data-cell-index="${bestMove}"]`).innerText = currentPlayer;
        checkResult();
        currentPlayer = 'X'; // Switch back to player
    }
}

// Function to find the best move for the AI
function findBestMove() {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Check if AI can win
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] === 'O' && gameState[b] === 'O' && gameState[c] === '') return c;
        if (gameState[a] === 'O' && gameState[c] === 'O' && gameState[b] === '') return b;
        if (gameState[b] === 'O' && gameState[c] === 'O' && gameState[a] === '') return a;
    }

    // Check if player can win and block them
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] === 'X' && gameState[b] === 'X' && gameState[c] === '') return c;
        if (gameState[a] === 'X' && gameState[c] === 'X' && gameState[b] === '') return b;
        if (gameState[b] === 'X' && gameState[c] === 'X' && gameState[a] === '') return a;
    }

    // Take center if available
    if (gameState[4] === '') return 4;

    // Take a corner if available
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (gameState[corner] === '') return corner;
    }

    // Take any available cell
    return gameState.indexOf('') !== -1 ? gameState.indexOf('') : -1;
}

// Check for game result
function checkResult() {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Check for a winner
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            isGameActive = false; // Stop the game
            if (gameState[a] === 'X') {
                xWins++;
                xWinsDisplay.innerText = xWins;
            } else {
                oWins++;
                oWinsDisplay.innerText = oWins;
            }
            gameCount++;
            gamesPlayedDisplay.innerText = gameCount; // Update games played display
            resetGame();
            return; // Exit the function
        }
    }

    // If there's no winner and the board is full, it's a draw
    if (!gameState.includes('')) {
        drawCount++; // Increment draw count
        isGameActive = false; // Set game to inactive
        drawsDisplay.innerText = drawCount; // Update draw count


        gameCount++;
        gamesPlayedDisplay.innerText = gameCount; // Update games played display
        resetGame(); // Reset the game for the next round




    }
}



// Resets the game state for the next round
function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true; // Ensure the game is set to active for the new game
    currentPlayer = 'X'; // Reset to player
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = '';
    });
}


// Restart button functionality
restartButton.addEventListener('click', resetGame);
