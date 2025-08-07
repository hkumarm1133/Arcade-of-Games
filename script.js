class Minesweeper {
    constructor() {
        this.board = [];
        this.gameBoard = document.getElementById('game-board');
        this.mineCountDisplay = document.getElementById('mine-count');
        this.timerDisplay = document.getElementById('timer');
        this.resetBtn = document.getElementById('reset-btn');
        this.difficultySelect = document.getElementById('difficulty');
        this.gameStatus = document.getElementById('game-status');
        this.statusText = document.getElementById('status-text');
        this.playAgainBtn = document.getElementById('play-again-btn');
        
        this.gameState = 'waiting'; // waiting, playing, won, lost
        this.timer = 0;
        this.timerInterval = null;
        this.firstClick = true;
        
        // Difficulty settings
        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 30, mines: 99 }
        };
        
        this.currentDifficulty = 'beginner';
        this.rows = 9;
        this.cols = 9;
        this.totalMines = 10;
        this.flaggedCount = 0;
        this.revealedCount = 0;
        
        this.initEventListeners();
        this.initGame();
    }
    
    initEventListeners() {
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.difficultySelect.addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.resetGame();
        });
        this.playAgainBtn.addEventListener('click', () => {
            this.hideGameStatus();
            this.resetGame();
        });
    }
    
    initGame() {
        const difficulty = this.difficulties[this.currentDifficulty];
        this.rows = difficulty.rows;
        this.cols = difficulty.cols;
        this.totalMines = difficulty.mines;
        this.flaggedCount = 0;
        this.revealedCount = 0;
        this.firstClick = true;
        this.gameState = 'waiting';
        
        this.updateMineCount();
        this.resetTimer();
        this.createBoard();
        this.renderBoard();
        this.updateResetButton();
    }
    
    createBoard() {
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = {
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0
                };
            }
        }
    }
    
    placeMines(excludeRow, excludeCol) {
        let minesPlaced = 0;
        while (minesPlaced < this.totalMines) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            
            // Don't place mine on first click or if already has mine
            if ((row === excludeRow && col === excludeCol) || this.board[row][col].isMine) {
                continue;
            }
            
            this.board[row][col].isMine = true;
            minesPlaced++;
        }
        
        this.calculateNeighborMines();
    }
    
    calculateNeighborMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.board[row][col].isMine) {
                    this.board[row][col].neighborMines = this.countNeighborMines(row, col);
                }
            }
        }
    }
    
    countNeighborMines(row, col) {
        let count = 0;
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    if (this.board[r][c].isMine) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
    
    renderBoard() {
        this.gameBoard.innerHTML = '';
        
        // Responsive cell sizing
        const isMobile = window.innerWidth <= 480;
        const isTablet = window.innerWidth <= 768;
        
        let cellSize, gap;
        if (isMobile) {
            cellSize = '24px';
            gap = '1px';
        } else if (isTablet) {
            cellSize = '30px';
            gap = '2px';
        } else {
            cellSize = '37px';
            gap = '2px';
        }
        
        this.gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, ${cellSize})`;
        this.gameBoard.style.gridTemplateRows = `repeat(${this.rows}, ${cellSize})`;
        this.gameBoard.style.display = 'grid';
        this.gameBoard.style.gap = gap;
        this.gameBoard.style.justifyContent = 'center';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', (e) => this.handleCellClick(e, row, col));
                cell.addEventListener('contextmenu', (e) => this.handleRightClick(e, row, col));
                
                this.gameBoard.appendChild(cell);
            }
        }
    }
    
    handleCellClick(e, row, col) {
        e.preventDefault();
        
        if (this.gameState === 'won' || this.gameState === 'lost') {
            return;
        }
        
        const cell = this.board[row][col];
        
        if (cell.isFlagged || cell.isRevealed) {
            return;
        }
        
        // First click - place mines
        if (this.firstClick) {
            this.placeMines(row, col);
            this.startTimer();
            this.gameState = 'playing';
            this.firstClick = false;
        }
        
        this.revealCell(row, col);
        this.updateDisplay();
        this.checkWinCondition();
    }
    
    handleRightClick(e, row, col) {
        e.preventDefault();
        
        if (this.gameState === 'won' || this.gameState === 'lost') {
            return;
        }
        
        const cell = this.board[row][col];
        
        if (cell.isRevealed) {
            return;
        }
        
        if (cell.isFlagged) {
            cell.isFlagged = false;
            this.flaggedCount--;
        } else {
            cell.isFlagged = true;
            this.flaggedCount++;
        }
        
        this.updateDisplay();
        this.updateMineCount();
    }
    
    revealCell(row, col) {
        const cell = this.board[row][col];
        
        if (cell.isRevealed || cell.isFlagged) {
            return;
        }
        
        cell.isRevealed = true;
        this.revealedCount++;
        
        if (cell.isMine) {
            this.gameOver(false);
            return;
        }
        
        // If cell has no neighboring mines, reveal all neighbors
        if (cell.neighborMines === 0) {
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                        this.revealCell(r, c);
                    }
                }
            }
        }
    }
    
    updateDisplay() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const cell = this.board[row][col];
                
                cellElement.className = 'cell';
                cellElement.textContent = '';
                
                if (cell.isFlagged) {
                    cellElement.classList.add('flagged');
                } else if (cell.isRevealed) {
                    cellElement.classList.add('revealed');
                    
                    if (cell.isMine) {
                        cellElement.classList.add('mine');
                        if (this.gameState === 'lost') {
                            cellElement.classList.add('mine-triggered');
                        }
                    } else if (cell.neighborMines > 0) {
                        cellElement.textContent = cell.neighborMines;
                        cellElement.classList.add(`num-${cell.neighborMines}`);
                    }
                }
            }
        }
    }
    
    checkWinCondition() {
        const totalCells = this.rows * this.cols;
        const nonMineCells = totalCells - this.totalMines;
        
        if (this.revealedCount === nonMineCells) {
            this.gameOver(true);
        }
    }
    
    gameOver(won) {
        this.gameState = won ? 'won' : 'lost';
        this.stopTimer();
        
        if (!won) {
            // Reveal all mines
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    if (this.board[row][col].isMine) {
                        this.board[row][col].isRevealed = true;
                    }
                }
            }
        }
        
        this.updateDisplay();
        this.updateResetButton();
        
        setTimeout(() => {
            this.showGameStatus(won);
        }, 500);
    }
    
    showGameStatus(won) {
        this.statusText.textContent = won ? '🎉 You Won!' : '💥 Game Over!';
        this.statusText.className = won ? 'win-message' : 'lose-message';
        this.gameStatus.classList.remove('hidden');
    }
    
    hideGameStatus() {
        this.gameStatus.classList.add('hidden');
    }
    
    resetGame() {
        this.stopTimer();
        this.hideGameStatus();
        this.initGame();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimerDisplay();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    resetTimer() {
        this.timer = 0;
        this.updateTimerDisplay();
    }
    
    updateTimerDisplay() {
        this.timerDisplay.textContent = this.timer.toString().padStart(3, '0');
    }
    
    updateMineCount() {
        const remainingMines = this.totalMines - this.flaggedCount;
        this.mineCountDisplay.textContent = remainingMines.toString();
    }
    
    updateResetButton() {
        switch (this.gameState) {
            case 'playing':
                this.resetBtn.textContent = '😐 Reset';
                break;
            case 'won':
                this.resetBtn.textContent = '😎 New Game';
                break;
            case 'lost':
                this.resetBtn.textContent = '😵 New Game';
                break;
            default:
                this.resetBtn.textContent = '🙂 New Game';
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});
