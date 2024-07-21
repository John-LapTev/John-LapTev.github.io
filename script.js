const gameBoard = document.getElementById('game-board');
const timer = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const autoBtn = document.getElementById('auto-btn');
const startOverlay = document.getElementById('start-overlay');

let startTime;
let timerInterval;
let gameStarted = false;
let selectedBlock = null;

const EMPTY = 'E';
const RED = 'R';
const GREEN = 'G';
const KEY = 'K';

const initialBoard = [
    [EMPTY, RED, EMPTY, RED, GREEN, GREEN],
    [RED, RED, EMPTY, RED, RED, EMPTY],
    [RED, RED, KEY, KEY, RED, EMPTY],
    [GREEN, GREEN, RED, EMPTY, RED, EMPTY],
    [RED, EMPTY, RED, GREEN, GREEN, RED],
    [RED, GREEN, GREEN, EMPTY, EMPTY, RED]
];

let currentBoard = JSON.parse(JSON.stringify(initialBoard));

if (resetBtn) {
    resetBtn.addEventListener('click', resetGame);
}
if (autoBtn) {
    autoBtn.addEventListener('click', autoPlay);
}

function createBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gameBoard.appendChild(cell);
        }
    }
    const exit = document.createElement('div');
    exit.classList.add('exit');
    gameBoard.appendChild(exit);
    gameBoard.appendChild(startOverlay);
    updateBlocks();
}

function updateBlocks() {
    const blocks = gameBoard.querySelectorAll('.block');
    blocks.forEach(block => block.remove());

    const visited = Array(6).fill().map(() => Array(6).fill(false));

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (currentBoard[i][j] !== EMPTY && !visited[i][j]) {
                const block = document.createElement('div');
                block.classList.add('block', currentBoard[i][j].toLowerCase());
                let width = 1, height = 1;
                
                if (currentBoard[i][j] === GREEN || currentBoard[i][j] === KEY) {
                    while (j + width < 6 && currentBoard[i][j + width] === currentBoard[i][j]) {
                        width++;
                    }
                } else if (currentBoard[i][j] === RED) {
                    while (i + height < 6 && currentBoard[i + height][j] === RED) {
                        height++;
                    }
                }
                
                block.style.width = `${width * 58 - 4}px`;
                block.style.height = `${height * 58 - 4}px`;
                block.style.left = `${j * 58 + 2}px`;
                block.style.top = `${i * 58 + 2}px`;
                block.dataset.row = i;
                block.dataset.col = j;
                block.dataset.width = width;
                block.dataset.height = height;
                block.addEventListener('mousedown', startDrag);
                block.addEventListener('touchstart', startDrag, { passive: false });
                if (currentBoard[i][j] === KEY) {
                    block.innerHTML = '🔑';
                }
                gameBoard.appendChild(block);

                for (let k = i; k < i + height; k++) {
                    for (let l = j; l < j + width; l++) {
                        visited[k][l] = true;
                    }
                }
            }
        }
    }
}

function startDrag(e) {
    if (!gameStarted) return;
    e.preventDefault();
    e.stopPropagation();
    selectedBlock = e.target.closest('.block');
    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    const startLeft = parseInt(selectedBlock.style.left);
    const startTop = parseInt(selectedBlock.style.top);
    const isHorizontal = selectedBlock.classList.contains('g') || selectedBlock.classList.contains('k');

    function drag(e) {
        e.preventDefault();
        e.stopPropagation();
        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const dx = currentX - startX;
        const dy = currentY - startY;
        if (isHorizontal) {
            const newLeft = Math.round((startLeft + dx - 2) / 58) * 58 + 2;
            if (canMove(selectedBlock, newLeft, startTop)) {
                selectedBlock.style.left = `${newLeft}px`;
            }
        } else {
            const newTop = Math.round((startTop + dy - 2) / 58) * 58 + 2;
            if (canMove(selectedBlock, startLeft, newTop)) {
                selectedBlock.style.top = `${newTop}px`;
            }
        }
    }

    function endDrag() {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', endDrag);
        updateBoardState();
        checkWin();
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', endDrag);
}

function canMove(block, newLeft, newTop) {
    const blockType = block.classList.contains('r') ? RED : block.classList.contains('g') ? GREEN : KEY;
    const newCol = Math.round((newLeft - 2) / 58);
    const newRow = Math.round((newTop - 2) / 58);
    const width = parseInt(block.dataset.width);
    const height = parseInt(block.dataset.height);

    const oldCol = Math.round((parseInt(block.style.left) - 2) / 58);
    const oldRow = Math.round((parseInt(block.style.top) - 2) / 58);

    if (newRow < 0 || newRow + height > 6 || newCol < 0 || newCol + width > 6) {
        return false;
    }

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (currentBoard[newRow + i][newCol + j] !== EMPTY &&
                !(oldRow <= newRow + i && newRow + i < oldRow + height &&
                  oldCol <= newCol + j && newCol + j < oldCol + width)) {
                return false;
            }
        }
    }
    return true;
}

function updateBoardState() {
    currentBoard = Array(6).fill().map(() => Array(6).fill(EMPTY));
    const blocks = gameBoard.querySelectorAll('.block');
    blocks.forEach(block => {
        const col = Math.round((parseInt(block.style.left) - 2) / 58);
        const row = Math.round((parseInt(block.style.top) - 2) / 58);
        const type = block.classList.contains('r') ? RED : block.classList.contains('g') ? GREEN : KEY;
        const width = parseInt(block.dataset.width);
        const height = parseInt(block.dataset.height);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                currentBoard[row + i][col + j] = type;
            }
        }
    });
}

function checkWin() {
    if (currentBoard[2][5] === KEY) {
        const keyBlock = gameBoard.querySelector('.k');
        keyBlock.style.transition = 'all 1s ease';
        keyBlock.style.left = '348px';
        setTimeout(() => {
            endGame();
        }, 1000);
    }
}

function startGame() {
    gameStarted = true;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    startOverlay.style.opacity = '0';
    setTimeout(() => {
        startOverlay.style.display = 'none';
    }, 500);
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
}

function endGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    alert(`Поздравляем! Вы прошли игру за ${timer.textContent}`);
    resetGame();
}

function resetGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    timer.textContent = '00:00';
    currentBoard = JSON.parse(JSON.stringify(initialBoard));
    updateBlocks();
    startOverlay.style.display = 'flex';
    startOverlay.style.opacity = '1';
}

function autoPlay() {
    alert('Функция автоматической игры пока не реализована');
}

createBoard();
startOverlay.addEventListener('click', startGame);
gameBoard.addEventListener('touchstart', (e) => {
    if (e.target === startOverlay) {
        startGame();
    }
}, { passive: false });

// Предотвращение прокрутки страницы при перетаскивании блоков
document.body.addEventListener('touchmove', (e) => {
    if (gameStarted) {
        e.preventDefault();
    }
}, { passive: false });

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth <= 400) {
        gameBoard.style.transform = `scale(${window.innerWidth / 400})`;
    } else {
        gameBoard.style.transform = 'scale(1)';
    }
});

// Вызов обработчика изменения размера при загрузке страницы
window.dispatchEvent(new Event('resize'));
