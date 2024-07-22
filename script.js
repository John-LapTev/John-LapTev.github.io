const gameBoard = document.getElementById('game-board');
const timer = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const autoBtn = document.getElementById('auto-btn');
const startOverlay = document.getElementById('start-overlay');
const languageSwitcher = document.getElementById('language-switcher');
const currentLang = document.getElementById('current-lang');
const startBtn = document.getElementById('start-btn');

let startTime;
let timerInterval;
let gameStarted = false;
let selectedBlock = null;
let isRussian = true;

const EMPTY = 'E';
const RED = 'R';
const GREEN = 'G';
const KEY = 'K';

const initialBoard = [
    [GREEN, GREEN, RED, GREEN, GREEN, EMPTY],
    [RED, RED, RED, EMPTY, RED, RED],
    [RED, RED, KEY, KEY, RED, RED],
    [EMPTY, EMPTY, EMPTY, RED, EMPTY, RED],
    [EMPTY, EMPTY, EMPTY, RED, GREEN, GREEN],
    [EMPTY, EMPTY, EMPTY, RED, EMPTY, EMPTY]
];

let currentBoard = JSON.parse(JSON.stringify(initialBoard));

const translations = {
    ru: {
        start: 'СТАРТ',
        reset: 'СБРОС',
        autoPlay: 'АВТО ИГРА',
        playHamsterKombat: 'Играть в Hamster Kombat',
        congratulations: 'Поздравляем! Вы прошли игру за',
        autoPlayNotImplemented: 'Функция автоматической игры пока не реализована'
    },
    en: {
        start: 'START',
        reset: 'RESET',
        autoPlay: 'AUTO PLAY',
        playHamsterKombat: 'Play Hamster Kombat',
        congratulations: 'Congratulations! You completed the game in',
        autoPlayNotImplemented: 'Auto play function is not implemented yet'
    }
};

function switchLanguage() {
    isRussian = !isRussian;
    currentLang.textContent = isRussian ? 'RU' : 'EN';
    updateTexts();
}

function updateTexts() {
    const lang = isRussian ? 'ru' : 'en';
    startBtn.textContent = translations[lang].start;
    resetBtn.textContent = translations[lang].reset;
    autoBtn.textContent = translations[lang].autoPlay;
    document.getElementById('hamster-kombat-link').textContent = translations[lang].playHamsterKombat;
}

languageSwitcher.addEventListener('click', switchLanguage);

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

    const cellSize = gameBoard.clientWidth / 6;

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
                
                block.style.width = `${width * cellSize - 4}px`;
                block.style.height = `${height * cellSize - 4}px`;
                block.style.left = `${j * cellSize + 2}px`;
                block.style.top = `${i * cellSize + 2}px`;
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

function preventDefault(e) {
    e.preventDefault();
}

function disableScroll() {
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
    gameBoard.addEventListener('touchmove', preventDefault, { passive: false });
}

function enableScroll() {
    document.body.removeEventListener('touchmove', preventDefault);
    gameBoard.removeEventListener('touchmove', preventDefault);
}

function startDrag(e) {
    if (!gameStarted) return;
    e.preventDefault();
    e.stopPropagation();
    selectedBlock = e.target.closest('.block');
    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    const startLeft = parseFloat(selectedBlock.style.left);
    const startTop = parseFloat(selectedBlock.style.top);
    const isHorizontal = selectedBlock.classList.contains('g') || selectedBlock.classList.contains('k');
    const cellSize = gameBoard.clientWidth / 6;

    disableScroll();

    function drag(e) {
        e.preventDefault();
        e.stopPropagation();
        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const dx = currentX - startX;
        const dy = currentY - startY;
        if (isHorizontal) {
            const newLeft = Math.round((startLeft + dx) / cellSize) * cellSize;
            if (canMove(selectedBlock, newLeft, startTop)) {
                selectedBlock.style.left = `${newLeft}px`;
            }
        } else {
            const newTop = Math.round((startTop + dy) / cellSize) * cellSize;
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
        enableScroll();
        updateBoardState();
        checkWin();
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', endDrag);
}

function canMove(block, newLeft, newTop) {
    const cellSize = gameBoard.clientWidth / 6;
    const newCol = Math.round(newLeft / cellSize);
    const newRow = Math.round(newTop / cellSize);
    const width = parseInt(block.dataset.width);
    const height = parseInt(block.dataset.height);

    const oldCol = Math.round(parseFloat(block.style.left) / cellSize);
    const oldRow = Math.round(parseFloat(block.style.top) / cellSize);

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
    const cellSize = gameBoard.clientWidth / 6;
    blocks.forEach(block => {
        const col = Math.round(parseFloat(block.style.left) / cellSize);
        const row = Math.round(parseFloat(block.style.top) / cellSize);
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
        const cellSize = gameBoard.clientWidth / 6;
        keyBlock.style.transition = 'all 1s ease';
        keyBlock.style.left = `${6 * cellSize}px`;
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
    const lang = isRussian ? 'ru' : 'en';
    alert(`${translations[lang].congratulations} ${timer.textContent}`);
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
    const lang = isRussian ? 'ru' : 'en';
    alert(translations[lang].autoPlayNotImplemented);
}

createBoard();
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
autoBtn.addEventListener('click', autoPlay);
gameBoard.addEventListener('touchstart', (e) => {
    if (e.target === startBtn) {
        startGame();
    }
}, { passive: false });

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    updateBlocks();
});

// Вызов обработчика изменения размера при загрузке страницы
window.dispatchEvent(new Event('resize'));

// Вызываем updateTexts() при загрузке страницы
updateTexts();
