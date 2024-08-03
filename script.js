// Глобальные переменные
const gameBoard = document.getElementById('game-board');
const timer = document.getElementById('timer');
const movesCounter = document.getElementById('moves-counter');
const resetBtn = document.getElementById('reset-btn');
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');
const hintBtn = document.getElementById('hint-btn');
const levelBtn = document.getElementById('level-btn');
const settingsBtn = document.getElementById('settings-btn');
const usernameModal = document.getElementById('username-modal');
const usernameInput = document.getElementById('username-input');
const submitUsernameBtn = document.getElementById('submit-username');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings');
const languageToggle = document.getElementById('language-toggle');
const themeToggle = document.getElementById('theme-toggle-switch').querySelector('input');
const levelModal = document.getElementById('level-modal');
const levelSelect = document.getElementById('level-select');
const confirmLevelBtn = document.getElementById('confirm-level');
const currentLevelDisplay = document.getElementById('current-level');
const winModal = document.getElementById('win-modal');
const nextLevelBtn = document.getElementById('next-level-btn');
const hintModal = document.getElementById('hint-modal');
const hintText = document.getElementById('hint-text');
const closeHintBtn = document.getElementById('close-hint');
const tasksBtn = document.getElementById('tasks-btn');
const tasksModal = document.getElementById('tasks-modal');
const closeTasksBtn = document.getElementById('close-tasks');
const mainTaskList = document.getElementById('main-task-list');
const sideTaskList = document.getElementById('side-task-list');
const coinCounter = document.getElementById('coin-counter');
const coinCount = document.getElementById('coin-count');

let startTime;
let timerInterval;
let gameStarted = false;
let selectedBlock = null;
let isRussian = true;
let currentLevel = 1;
let currentUser = null;
let isDarkTheme = true;
let moves = 0;
let completedLevels = [];
let completedSideTasks = [];
let coins = 0;

const CELL_SIZE = 60; // Размер ячейки в пикселях
const BOARD_SIZE = 6; // Размер игрового поля (6x6)

const statsBtn = document.getElementById('stats-btn');
const statsModal = document.getElementById('stats-modal');
const closeStatsBtn = document.getElementById('close-stats');

const showLeaderboardBtn = document.getElementById('show-leaderboard');
const leaderboardModal = document.getElementById('leaderboard-modal');
const closeLeaderboardBtn = document.getElementById('close-leaderboard');
const leaderboardBody = document.getElementById('leaderboard-body');

const EMPTY = 'E';
const RED = 'R';
const BLUE = 'B';
const GREEN = 'G';
const KEY = 'K';
const SPECIAL_T1 = 'T1';
const SPECIAL_T2 = 'T2';

// Уровни игры
const levels = [
    [
        [EMPTY, RED, EMPTY, RED, GREEN, GREEN],
        [RED, RED, EMPTY, RED, RED, EMPTY],
        [RED, RED, KEY, KEY, RED, EMPTY],
        [GREEN, GREEN, RED, EMPTY, RED, EMPTY],
        [RED, EMPTY, RED, GREEN, GREEN, RED],
        [RED, GREEN, GREEN, EMPTY, EMPTY, RED]
    ],
    [
        [RED, GREEN, GREEN, EMPTY, GREEN, GREEN],
        [RED, EMPTY, RED, GREEN, GREEN, RED],
        [KEY, KEY, RED, RED, EMPTY, RED],
        [EMPTY, RED, EMPTY, RED, GREEN, GREEN],
        [EMPTY, RED, EMPTY, RED, RED, EMPTY],
        [EMPTY, RED, GREEN, GREEN, RED, EMPTY]
    ],
    [
        [EMPTY, RED, EMPTY, EMPTY, GREEN, GREEN],
        [EMPTY, RED, GREEN, GREEN, RED, EMPTY],
        [KEY, KEY, RED, EMPTY, RED, EMPTY],
        [GREEN, GREEN, RED, GREEN, GREEN, RED],
        [RED, GREEN, GREEN, RED, EMPTY, RED],
        [RED, EMPTY, EMPTY, RED, EMPTY, RED]
    ],
    [
         [RED, EMPTY, EMPTY, RED, GREEN, GREEN],
         [RED, RED, EMPTY, RED, RED, EMPTY],
         [RED, RED, KEY, KEY, RED, RED],
         [GREEN, GREEN, GREEN, EMPTY, RED, RED],
         [EMPTY, EMPTY, RED, EMPTY, GREEN, GREEN],
         [EMPTY, EMPTY, RED, EMPTY, GREEN, GREEN]
    ],
    [
         [GREEN, GREEN, EMPTY, EMPTY, EMPTY, RED],
         [EMPTY, GREEN, GREEN, GREEN, RED, RED],
         [RED, KEY, KEY, EMPTY, RED, EMPTY],
         [RED, RED, RED, EMPTY, RED, RED],
         [EMPTY, RED, RED, GREEN, GREEN, RED],
         [EMPTY, RED, EMPTY, GREEN, GREEN, GREEN]
    ],
    [
         [EMPTY, GREEN, GREEN, GREEN, EMPTY, RED],
         [EMPTY, EMPTY, RED, RED, RED, RED],
         [KEY, KEY, RED, RED, RED, EMPTY],
         [EMPTY, EMPTY, RED+'2', RED, GREEN, GREEN],
         [EMPTY, EMPTY, RED+'2', GREEN, GREEN, RED],
         [EMPTY, GREEN, GREEN, EMPTY, EMPTY, RED]
    ],   
    [
         [GREEN, GREEN, EMPTY, EMPTY, RED, RED],
         [EMPTY, RED, GREEN, GREEN, RED, RED],
         [EMPTY, RED, KEY, KEY, RED, EMPTY],
         [EMPTY, EMPTY, RED, EMPTY, GREEN, GREEN],
         [GREEN, GREEN, RED, RED, EMPTY, EMPTY],
         [GREEN, GREEN, GREEN, RED, EMPTY, EMPTY]
    ],
    [
         [RED, EMPTY, EMPTY, GREEN, GREEN, EMPTY],
         [RED, GREEN, GREEN, GREEN, RED, RED],
         [KEY, KEY, RED, EMPTY, RED, RED],
         [EMPTY, EMPTY, RED, GREEN, GREEN, RED],
         [GREEN, GREEN, RED, RED, GREEN, GREEN],
         [GREEN, GREEN, GREEN, RED, EMPTY, EMPTY]
    ],
    [
         [RED, RED, EMPTY, EMPTY, GREEN, GREEN],
         [RED, RED, GREEN, GREEN, GREEN, RED],
         [KEY, KEY, RED, EMPTY, EMPTY, RED],
         [EMPTY, EMPTY, RED, GREEN, GREEN, RED],
         [EMPTY, EMPTY, RED, RED, GREEN, GREEN],
         [GREEN, GREEN, GREEN, RED, EMPTY, EMPTY]
    ],
    [
         [EMPTY, EMPTY, RED, EMPTY, GREEN, GREEN],
         [GREEN, GREEN, RED, EMPTY, RED, RED+'2'],
         [GREEN, GREEN, KEY, KEY, RED, RED+'2'],
         [EMPTY, RED, RED, GREEN, GREEN, RED],
         [EMPTY, RED, RED, EMPTY, EMPTY, RED],
         [EMPTY, RED, GREEN, GREEN, GREEN, RED]
    ],
    [
         [RED, EMPTY, EMPTY, GREEN, GREEN, EMPTY],
         [RED, EMPTY, EMPTY, RED, EMPTY, RED],
         [RED, KEY, KEY, RED, EMPTY, RED],
         [EMPTY, EMPTY, RED, RED, GREEN, GREEN],
         [RED, EMPTY, RED, GREEN, GREEN, RED],
         [RED, GREEN, GREEN, EMPTY, EMPTY, RED]
    ],
    [
         [EMPTY, RED, GREEN, GREEN, RED, EMPTY],
         [EMPTY, RED, GREEN, GREEN, RED, EMPTY],
         [KEY, KEY, RED, EMPTY, RED, RED],
         [RED, EMPTY, RED, GREEN, GREEN, RED],
         [RED, GREEN, GREEN, RED, EMPTY, RED],
         [RED, EMPTY, EMPTY, RED, GREEN, GREEN]
    ],    
];

let currentBoard = JSON.parse(JSON.stringify(levels[0]));

// Замочек в ячейке
function addLockAndHighlight() {
    const lockCell = document.querySelector(`.cell[data-row="2"][data-col="5"]`);
    if (lockCell) {
        // Добавляем подсвеченную правую стенку
        const highlight = document.createElement('div');
        highlight.className = 'highlight-right';
        lockCell.appendChild(highlight);

        // Добавляем замочек
        const lock = document.createElement('div');
        lock.className = 'lock';
        lock.textContent = '🔒';
        lockCell.appendChild(lock);
    }
}

// Создание игрового поля
function createBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.width = '100%';
    gameBoard.style.aspectRatio = '1 / 1';
    gameBoard.style.position = 'relative';
    
    // Создание сетки
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.style.position = 'absolute';
            cell.style.width = `${100 / BOARD_SIZE}%`;
            cell.style.height = `${100 / BOARD_SIZE}%`;
            cell.style.left = `${j * (100 / BOARD_SIZE)}%`;
            cell.style.top = `${i * (100 / BOARD_SIZE)}%`;
            cell.style.boxSizing = 'border-box';
            gameBoard.appendChild(cell);
        }
    }
    
    updateBlocks();
    addLockAndHighlight();
    
    // Добавляем startOverlay в конце, чтобы он был поверх всех элементов
    gameBoard.appendChild(startOverlay);
}

// Обновление блоков на поле
function updateBlocks() {
    const existingBlocks = gameBoard.querySelectorAll('.block');
    existingBlocks.forEach(block => block.remove());

    let blockId = 1; // Уникальный идентификатор для каждого блока

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (currentBoard[i][j] !== EMPTY && !isPartOfLargerBlock(i, j)) {
                const block = createBlock(i, j, blockId);
                gameBoard.appendChild(block);
                blockId++;
            }
        }
    }
}

// Проверка, является ли ячейка частью большего блока
function isPartOfLargerBlock(row, col) {
    const currentCell = currentBoard[row][col];
    const [type, number] = splitTypeAndNumber(currentCell);
    
    if (type === GREEN || type === KEY) {
        return col > 0 && isSameBlock(currentBoard[row][col-1], currentCell);
    } else if (type === RED || type === BLUE) {
        return row > 0 && isSameBlock(currentBoard[row-1][col], currentCell);
    }
    return false;
}

// Разделение типа и номера блока
function splitTypeAndNumber(cell) {
    const match = cell.match(/([RGBKT])(\d+|t1|t2)?/);
    return match ? [match[1], match[2] || ''] : [cell, ''];
}

// Проверка, являются ли две ячейки частью одного блока
function isSameBlock(cell1, cell2) {
    const [type1, number1] = splitTypeAndNumber(cell1);
    const [type2, number2] = splitTypeAndNumber(cell2);
    return type1 === type2 && number1 === number2;
}

// Создание блока
function createBlock(row, col, blockId) {
    const block = document.createElement('div');
    const [type, number] = splitTypeAndNumber(currentBoard[row][col]);
    block.classList.add('block', type.toLowerCase());
    if (number) block.classList.add(`n${number}`);
    
    let width = 1, height = 1;
    
    // Определение размеров блока
    if (type === GREEN || type === KEY || (type === BLUE && number) || type === 'T') {
        while (col + width < BOARD_SIZE && isSameBlock(currentBoard[row][col + width], currentBoard[row][col])) {
            width++;
        }
    }
    
    if (type === RED || (type === BLUE && (number || width === 1)) || type === 'T') {
        while (row + height < BOARD_SIZE && isSameBlock(currentBoard[row + height][col], currentBoard[row][col])) {
            height++;
        }
    }
    
    const cellSize = 100 / BOARD_SIZE;
    block.style.width = `${width * cellSize - (4 / BOARD_SIZE)}%`;
    block.style.height = `${height * cellSize - (4 / BOARD_SIZE)}%`;
    
    block.dataset.row = row;
    block.dataset.col = col;
    block.dataset.width = width;
    block.dataset.height = height;
    block.dataset.type = type;
    block.dataset.number = number || blockId;
    
    updateBlockPosition(block, col, row);
    
    block.addEventListener('mousedown', startDrag);
    block.addEventListener('touchstart', startDrag, { passive: false });
    if (type === KEY) {
        block.innerHTML = '🔑';
    }

    // Добавляем смещение для специальных блоков
    if (number === 't1' || number === 't2') {
        const offset = number === 't1' ? -0.5 : 0.5;
        if (type === RED) {
            block.style.left = `calc(${parseFloat(block.style.left)} + ${offset * cellSize}%)`;
        } else if (type === GREEN) {
            block.style.top = `calc(${parseFloat(block.style.top)} + ${offset * cellSize}%)`;
        }
    }

    return block;
}

// Начало перетаскивания блока
function startDrag(e) {
    if (!gameStarted) return;
    e.preventDefault();
    selectedBlock = e.target.closest('.block');
    if (selectedBlock) {
        isMovingBlock = true;
        const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        const startCol = parseInt(selectedBlock.dataset.col);
        const startRow = parseInt(selectedBlock.dataset.row);

        function drag(e) {
            if (!selectedBlock) return;
            e.preventDefault();
            const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            const dx = Math.round((currentX - startX) / CELL_SIZE);
            const dy = Math.round((currentY - startY) / CELL_SIZE);
            
            const blockType = selectedBlock.dataset.type;
            let newCol = startCol;
            let newRow = startRow;

            if (blockType === GREEN || blockType === KEY || blockType === BLUE) {
                newCol = startCol + dx;
            }
            if (blockType === RED || blockType === BLUE) {
                newRow = startRow + dy;
            }

            if (canMoveTo(selectedBlock, newCol, newRow)) {
                updateBlockPosition(selectedBlock, newCol, newRow);
                updateBoardState();
            }
        }

        function endDrag() {
            if (!selectedBlock) return;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', endDrag);
            
            const endCol = parseInt(selectedBlock.dataset.col);
            const endRow = parseInt(selectedBlock.dataset.row);
            if (endCol !== startCol || endRow !== startRow) {
                moves++;
                updateMovesCounter();
                if (checkWin()) {
                    endGame();
                }
            }
            isMovingBlock = false;
            selectedBlock = null;
        }

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }
}

// Проверка возможности перемещения блока
function canMoveTo(block, newCol, newRow) {
    const width = parseInt(block.dataset.width);
    const height = parseInt(block.dataset.height);
    const blockType = block.dataset.type;
    const blockNumber = block.dataset.number;
    const oldCol = parseInt(block.dataset.col);
    const oldRow = parseInt(block.dataset.row);

    // Проверка на выход за пределы доски
    if (newCol < 0 || newCol + width > BOARD_SIZE || newRow < 0 || newRow + height > BOARD_SIZE) {
        return false;
    }

    // Определение возможных направлений движения на основе размеров блока
    const canMoveHorizontal = height === 1 || (blockType === 'B' && width === 1);
    const canMoveVertical = width === 1 || (blockType === 'B' && height === 1);

    // Проверка направления движения
    const isMovingHorizontally = newCol !== oldCol;
    const isMovingVertically = newRow !== oldRow;

    if ((isMovingHorizontally && !canMoveHorizontal) || (isMovingVertically && !canMoveVertical)) {
        return false;
    }

    // Проверка пути движения
    const colStep = Math.sign(newCol - oldCol);
    const rowStep = Math.sign(newRow - oldRow);
    let currentCol = oldCol;
    let currentRow = oldRow;

    while (currentCol !== newCol || currentRow !== newRow) {
        if (colStep !== 0) currentCol += colStep;
        if (rowStep !== 0) currentRow += rowStep;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const checkRow = currentRow + i;
                const checkCol = currentCol + j;
                if (checkRow < 0 || checkRow >= BOARD_SIZE || checkCol < 0 || checkCol >= BOARD_SIZE) {
                    return false;
                }
                const cellContent = currentBoard[checkRow][checkCol];
                if (cellContent !== EMPTY && cellContent !== blockType + blockNumber) {
                    // Специальные блоки могут проходить через другие блоки
                    if (!(blockNumber === 't1' || blockNumber === 't2')) {
                        return false;
                    }
                }
            }
        }
    }

    return true;
}

// Обновление позиции блока
function updateBlockPosition(block, col, row) {
    const cellSize = 100 / BOARD_SIZE;
    const width = parseInt(block.dataset.width);
    const height = parseInt(block.dataset.height);
    const blockNumber = block.dataset.number;
    const blockType = block.dataset.type;
    
    let left = col * cellSize;
    let top = row * cellSize;
    let blockWidth = width * cellSize;
    let blockHeight = height * cellSize;

    if (blockType === RED) {
        left += 0.2;
        top += 0.2;
        blockWidth -= 0.4;
        blockHeight -= 0.4;
    } else if (blockType === GREEN) {
        left += 0.2;
        top += 0.2;
        blockWidth -= 0.4;
        blockHeight -= 0.4;
    }

    if (blockNumber === 't1' || blockNumber === 't2') {
        const offset = blockNumber === 't1' ? -0.5 : 0.5;
        if (blockType === RED) {
            left += offset * cellSize;
        } else if (blockType === GREEN) {
            top += offset * cellSize;
        }
    }

    block.style.left = `calc(${left}% + 1px)`;
    block.style.top = `calc(${top}% + 1px)`;
    block.style.width = `calc(${blockWidth}% - 2px)`;
    block.style.height = `calc(${blockHeight}% - 2px)`;
    block.dataset.col = col;
    block.dataset.row = row;
}

// Обновление состояния игрового поля
function updateBoardState() {
    currentBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
    const blocks = gameBoard.querySelectorAll('.block');
    blocks.forEach(block => {
        const col = parseInt(block.dataset.col);
        const row = parseInt(block.dataset.row);
        const type = block.dataset.type;
        const number = block.dataset.number;
        const width = parseInt(block.dataset.width);
        const height = parseInt(block.dataset.height);
        const cellValue = type + number;
        
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (row + i < BOARD_SIZE && col + j < BOARD_SIZE) {
                    currentBoard[row + i][col + j] = cellValue;
                }
            }
        }
    });
}

// Проверка на выигрыш
function checkWin() {
    const keyBlocks = Array.from(gameBoard.querySelectorAll('.block.k'));
    return keyBlocks.every(block => {
        const keyCol = parseInt(block.dataset.col);
        const keyWidth = parseInt(block.dataset.width);
        return keyCol + keyWidth === BOARD_SIZE;
    });
}

// Начало игры
function startGame() {
    gameStarted = true;
    startTime = Date.now();
    moves = 0;
    updateMovesCounter();
    timerInterval = setInterval(updateTimer, 1000);
    startOverlay.classList.add('hidden');
}

// Обновление таймера
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
    timer.classList.add('highlight');
    setTimeout(() => timer.classList.remove('highlight'), 300);
}

// Обновление счетчика ходов
function updateMovesCounter() {
    movesCounter.textContent = isRussian ? `Ходов: ${moves}` : `Moves: ${moves}`;
    movesCounter.classList.remove('hidden');
}

// Завершение игры
function endGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    const finalTime = timer.textContent;
    
    if (!completedLevels.includes(currentLevel)) {
        completedLevels.push(currentLevel);
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        addCoins(5);
    }
    
    updateStats(finalTime);
    updateLeaderboard(finalTime); 
    showWinModal(finalTime, moves);
    updateTasks();
}

// Обновление статистики
function updateStats(finalTime) {
    let totalGames = parseInt(localStorage.getItem('totalGames') || '0') + 1;
    localStorage.setItem('totalGames', totalGames);

    let bestTime = localStorage.getItem('bestTime');
    if (!bestTime || finalTime < bestTime) {
        localStorage.setItem('bestTime', finalTime);
    }

    let totalMoves = parseInt(localStorage.getItem('totalMoves') || '0') + moves;
    localStorage.setItem('totalMoves', totalMoves);
    localStorage.setItem('averageMoves', Math.round(totalMoves / totalGames));

    let levelsCompleted = parseInt(localStorage.getItem('levelsCompleted') || '0') + 1;
    localStorage.setItem('levelsCompleted', levelsCompleted);
}

// Отображение модального окна победы
function showWinModal(finalTime, finalMoves) {
    const winMessage = document.getElementById('win-message');
    winMessage.textContent = isRussian ?
        `Вы прошли уровень за ${finalTime}! Количество ходов: ${finalMoves}` :
        `You completed the level in ${finalTime}! Number of moves: ${finalMoves}`;
    winModal.classList.remove('hidden');
}

// Сброс игры
function resetGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    timer.textContent = '00:00';
    moves = 0;
    updateMovesCounter();
    currentBoard = JSON.parse(JSON.stringify(levels[currentLevel - 1]));
    updateBlocks();
    startOverlay.classList.remove('hidden');
    updateCurrentLevelDisplay();
}

// Отображение модального окна выбора уровня
function showLevelModal() {
    levelModal.classList.remove('hidden');
}

// Скрытие модального окна выбора уровня
function hideLevelModal() {
    levelModal.classList.add('hidden');
}

// Заполнение выпадающего списка уровней
function populateLevelSelect() {
    levelSelect.innerHTML = '';
    for (let i = 1; i <= levels.length; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${isRussian ? 'Уровень' : 'Level'} ${i}`;
        levelSelect.appendChild(option);
    }
    levelSelect.value = currentLevel;
}

// Смена уровня
function changeLevel() {
    const selectedLevel = parseInt(levelSelect.value);
    if (selectedLevel !== currentLevel) {
        currentLevel = selectedLevel;
        resetGame();
    }
    hideLevelModal();
}

// Переключение языка
function toggleLanguage() {
    isRussian = !isRussian;
    updateTexts();
    populateLevelSelect();
    updateMovesCounter();
    updateCurrentLevelDisplay();
    updateTasks();
}

// Обновление текстов интерфейса
function updateTexts() {
    const texts = isRussian ? {
        title: 'UnBlock Me - HK',
        start: 'Начать игру',
        reset: 'Сбросить',
        hint: 'Подсказка',
        level: 'Уровни',
        settings: 'Настройки',
        changeTheme: 'Тёмная тема',
        close: 'Закрыть',
        enterName: 'Введите ваше имя',
        confirm: 'Подтвердить',
        player: 'Игрок',
        congrats: 'Поздравляем! Вы прошли уровень за',
        hintText: 'Горизонтальные блоки: двигаются только влево и вправо\nВертикальные блоки: двигаются только вверх и вниз\nКвадратные блоки: могут двигаться в любом направлении\nКлюч: нужно довести до правого края',
        selectLevel: 'Выберите уровень',
        stats: 'Статистика',
        nextLevel: 'Следующий уровень',
        tasks: 'Задания',
        mainTasks: 'Основные',
        sideTasks: 'Побочные',
        complete: 'Выполнить',
        coins: 'Монеты'
    } : {
        title: 'UnBlock Me - HK',
        start: 'Start Game',
        reset: 'Reset',
        hint: 'Hint',
        level: 'Level',
        settings: 'Settings',
        changeTheme: 'Dark Theme',
        close: 'Close',
        enterName: 'Enter your name',
        confirm: 'Confirm',
        player: 'Player',
        congrats: 'Congratulations! You completed the level in',
        hintText: 'Horizontal blocks: move left and right only\nVertical blocks: move up and down only\nSquare blocks: can move in any direction\nKey: needs to reach the right edge',
        selectLevel: 'Select Level',
        stats: 'Statistics',
        nextLevel: 'Next Level',
        tasks: 'Tasks',
        mainTasks: 'Main',
        sideTasks: 'Side',
        complete: 'Complete',
        coins: 'Coins'
    };

    // Обновление текстов элементов интерфейса
    document.getElementById('game-title').textContent = texts.title;
    startBtn.textContent = texts.start;
    document.querySelector('#reset-btn span').textContent = texts.reset;
    document.querySelector('#hint-btn span').textContent = texts.hint;
    document.querySelector('#level-btn span').textContent = texts.level;
    document.querySelector('#settings-btn span').textContent = texts.settings;
    document.querySelector('#theme-toggle span').textContent = texts.changeTheme;
    closeSettingsBtn.textContent = texts.close;
    document.querySelector('#username-modal h2').textContent = texts.enterName;
    submitUsernameBtn.textContent = texts.confirm;
    document.querySelector('#level-modal h2').textContent = texts.selectLevel;
    confirmLevelBtn.textContent = texts.confirm;
    nextLevelBtn.textContent = texts.nextLevel;
    document.getElementById('settings-title').textContent = texts.settings;
    document.querySelector('#tasks-btn span').textContent = texts.tasks;
    document.querySelector('#tasks-modal h2').textContent = texts.tasks;
    document.querySelector('.tab[data-tab="main"]').textContent = texts.mainTasks;
    document.querySelector('.tab[data-tab="side"]').textContent = texts.sideTasks;
    coinCounter.title = texts.coins;

    updateUserInfo();
}

// Отображение модального окна ввода имени пользователя
function showUsernameModal() {
    usernameModal.classList.remove('hidden');
}

// Скрытие модального окна ввода имени пользователя
function hideUsernameModal() {
    usernameModal.classList.add('hidden');
}

// Установка имени пользователя
function setUsername() {
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = { name: username };
        hideUsernameModal();
        updateUserInfo();
        localStorage.setItem('username', username);
    } else {
        alert(isRussian ? 'Пожалуйста, введите ваше имя' : 'Please enter your name');
    }
}

// Обновление информации о пользователе
function updateUserInfo() {
    const userInfoElement = document.getElementById('user-info');
    if (currentUser) {
        userInfoElement.textContent = `${isRussian ? 'Игрок' : 'Player'}: ${currentUser.name}`;
    } else {
        userInfoElement.textContent = isRussian ? 'Игрок не зарегистрирован' : 'Player not registered';
    }
}

// Переключение модального окна настроек
function toggleSettingsModal() {
    settingsModal.classList.toggle('hidden');
}

// Переключение темы
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme', !isDarkTheme);
    updateThemeColors();
    localStorage.setItem('isDarkTheme', isDarkTheme);
}

// Обновление цветов темы
function updateThemeColors() {
    if (isDarkTheme) {
        document.documentElement.style.setProperty('--bg-color', '#121212');
        document.documentElement.style.setProperty('--text-color', '#e0e0e0');
        document.documentElement.style.setProperty('--modal-bg', '#1a1a1a');
        document.documentElement.style.setProperty('--board-bg', '#1e1e1e');
        document.documentElement.style.setProperty('--cell-border', '#2c2c2c');
        document.body.classList.remove('light-theme');
    } else {
        document.documentElement.style.setProperty('--bg-color', '#f0f0f0');
        document.documentElement.style.setProperty('--text-color', '#333333');
        document.documentElement.style.setProperty('--modal-bg', '#ffffff');
        document.documentElement.style.setProperty('--board-bg', '#e0e0e0');
        document.documentElement.style.setProperty('--cell-border', 'rgba(0, 0, 0, 0.1)');
        document.body.classList.add('light-theme');
    }
}

// Отображение подсказки
function showHint() {
    hintText.textContent = isRussian ? 
        'Горизонтальные блоки: двигаются только влево и вправо\nВертикальные блоки: двигаются только вверх и вниз\nКвадратные блоки: могут двигаться в любом направлении\nКлюч: нужно довести до правого края' : 
        'Horizontal blocks: move left and right only\nVertical blocks: move up and down only\nSquare blocks: can move in any direction\nKey: needs to reach the right edge';
    hintModal.classList.remove('hidden');
}

// Скрытие подсказки
function hideHint() {
    hintModal.classList.add('hidden');
}

// Статистика
function showStats() {
    const stats = {
        totalGames: localStorage.getItem('totalGames') || 0,
        bestTime: localStorage.getItem('bestTime') || 'N/A',
        averageMoves: localStorage.getItem('averageMoves') || 'N/A',
        levelsCompleted: localStorage.getItem('levelsCompleted') || 0
    };

    document.getElementById('total-games').textContent = stats.totalGames;
    document.getElementById('best-time').textContent = stats.bestTime;
    document.getElementById('avg-moves').textContent = stats.averageMoves;
    document.getElementById('levels-completed').textContent = stats.levelsCompleted;

    const statsModal = document.getElementById('stats-modal');
    statsModal.classList.remove('hidden');
}

// Статистика скрыть
function hideStats() {
    const statsModal = document.getElementById('stats-modal');
    statsModal.classList.add('hidden');
}

// Таблица лидеров
function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboardBody.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.level}</td>
            <td>${entry.time}</td>
            <td>${entry.moves}</td>
        `;
        leaderboardBody.appendChild(row);
    });
    leaderboardModal.classList.remove('hidden');
}

// Таблица скрыть
function hideLeaderboard() {
    leaderboardModal.classList.add('hidden');
}

function updateLeaderboard(finalTime) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({
        name: currentUser.name,
        level: currentLevel,
        time: finalTime,
        moves: moves
    });
    leaderboard.sort((a, b) => {
        if (a.level !== b.level) return b.level - a.level;
        if (a.time !== b.time) return a.time.localeCompare(b.time);
        return a.moves - b.moves;
    });
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Обновление отображения текущего уровня
function updateCurrentLevelDisplay() {
    currentLevelDisplay.textContent = isRussian ? `Уровень ${currentLevel}` : `Level ${currentLevel}`;
}

// Переход на следующий уровень
function nextLevel() {
    if (currentLevel < levels.length) {
        currentLevel++;
        resetGame();
    } else {
        alert(isRussian ? 'Вы прошли все уровни!' : 'You have completed all levels!');
    }
    winModal.classList.add('hidden');
}

// Отображение задач
function showTasks() {
    updateTasks();
    tasksModal.classList.remove('hidden');
}

// Скрытие задач
function hideTasks() {
    tasksModal.classList.add('hidden');
}

// Обновление задач
function updateTasks() {
    updateMainTasks();
    updateSideTasks();
}

// Обновление основных задач
function updateMainTasks() {
    mainTaskList.innerHTML = '';
    levels.forEach((level, index) => {
        const levelNumber = index + 1;
        const isCompleted = completedLevels.includes(levelNumber);
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <div class="task-status ${isCompleted ? 'completed' : 'incomplete'}"></div>
            <span>${isRussian ? 'Уровень' : 'Level'} ${levelNumber}</span>
            <span class="task-reward">+5 ${isRussian ? 'монет' : 'coins'}</span>
            ${!isCompleted ? `<a href="#" class="task-link" data-level="${levelNumber}">${isRussian ? 'Выполнить' : 'Complete'}</a>` : ''}
        `;
        mainTaskList.appendChild(taskItem);
    });

    const taskLinks = mainTaskList.querySelectorAll('.task-link');
    taskLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const level = parseInt(e.target.dataset.level);
            currentLevel = level;
            resetGame();
            hideTasks();
        });
    });
}

// Обновление побочных задач
function updateSideTasks() {
    sideTaskList.innerHTML = '';
    const sideTasks = [
        { id: 'subscribe', text: isRussian ? 'Подписаться на Hamster Kombat (JL)' : 'Subscribe to Hamster Kombat (JL)', link: 'https://t.me/Hamster_K_JL', reward: 15 },
        { id: 'subscribe_crypto_activity', text: isRussian ? 'Подписаться на Crypto Activity' : 'Subscribe to Crypto Activity', link: 'https://t.me/cryptos_activity', reward: 15 },
        { id: 'join_blum_squad', text: isRussian ? 'Вступить в сквад Blum' : 'Join Blum squad', link: 'https://t.me/BlumCryptoBot/app?startapp=tribe_hamster_k_jl-ref_ywmugwrMbN', reward: 30 }
    ];

    sideTasks.forEach(task => {
        const isCompleted = completedSideTasks.includes(task.id);
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <div class="task-status ${isCompleted ? 'completed' : 'incomplete'}"></div>
            <span>${task.text}</span>
            <span class="task-reward">+${task.reward} ${isRussian ? 'монет' : 'coins'}</span>
            ${!isCompleted ? `<a href="${task.link}" class="task-link" data-task="${task.id}" target="_blank">${isRussian ? 'Выполнить' : 'Complete'}</a>` : ''}
        `;
        sideTaskList.appendChild(taskItem);
    });

    const taskLinks = sideTaskList.querySelectorAll('.task-link');
    taskLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const taskId = e.target.dataset.task;
            window.open(e.target.href, '_blank');
            completeSideTask(taskId);
        });
    });
}

// Завершение побочной задачи
function completeSideTask(taskId) {
    if (!completedSideTasks.includes(taskId)) {
        completedSideTasks.push(taskId);
        localStorage.setItem('completedSideTasks', JSON.stringify(completedSideTasks));
        addCoins(15);
        updateSideTasks();
    }
}

// Переключение вкладок в модальном окне задач
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tasks`).classList.add('active');
}

// Добавление монет
function addCoins(amount) {
    coins += amount;
    localStorage.setItem('coins', coins);
    updateCoinCounter();
    showCoinAnimation(amount);
}

// Обновление счетчика монет
function updateCoinCounter() {
    coinCount.textContent = coins;
}

// Анимация добавления монет
function showCoinAnimation(amount) {
    const coinAnimation = document.createElement('div');
    coinAnimation.className = 'coin-animation';
    coinAnimation.textContent = `+${amount}`;
    coinAnimation.style.left = `${Math.random() * 80 + 10}%`;
    coinAnimation.style.top = `${Math.random() * 80 + 10}%`;
    document.body.appendChild(coinAnimation);

    setTimeout(() => {
        coinAnimation.remove();
    }, 1000);
}

// Инициализация игры
function initGame() {
    createBoard();
    populateLevelSelect();
    updateTexts();
    updateCurrentLevelDisplay();
    updateThemeColors();

    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        currentUser = { name: savedUsername };
        updateUserInfo();
    } else {
        showUsernameModal();
    }

    completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
    completedSideTasks = JSON.parse(localStorage.getItem('completedSideTasks') || '[]');
    coins = parseInt(localStorage.getItem('coins') || '0');
    updateCoinCounter();

    isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    themeToggle.checked = isDarkTheme;
    updateThemeColors();
}

// Добавление обработчиков событий
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
hintBtn.addEventListener('click', showHint);
statsBtn.addEventListener('click', showStats);
closeStatsBtn.addEventListener('click', hideStats);
showLeaderboardBtn.addEventListener('click', showLeaderboard);
closeLeaderboardBtn.addEventListener('click', hideLeaderboard);
levelBtn.addEventListener('click', showLevelModal);
settingsBtn.addEventListener('click', toggleSettingsModal);
submitUsernameBtn.addEventListener('click', setUsername);
closeSettingsBtn.addEventListener('click', toggleSettingsModal);
languageToggle.addEventListener('click', toggleLanguage);
themeToggle.addEventListener('change', toggleTheme);
confirmLevelBtn.addEventListener('click', changeLevel);
nextLevelBtn.addEventListener('click', nextLevel);
closeHintBtn.addEventListener('click', hideHint);
tasksBtn.addEventListener('click', showTasks);
closeTasksBtn.addEventListener('click', hideTasks);

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

let isMovingBlock = false;

function preventScroll(e) {
    // Разрешаем стандартное поведение для кнопки "Начать игру" и её оверлея
    if (e.target.id === 'start-btn' || e.target.closest('#start-overlay')) {
        return;
    }
    
    // Разрешаем движение блоков
    if (e.target.closest('.block') || isMovingBlock) {
        isMovingBlock = true;
        return;
    }
    
    // Предотвращаем прокрутку для остальной части игрового поля
    e.preventDefault();
}

function endBlockMove() {
    isMovingBlock = false;
}

// Предотвращение прокрутки при взаимодействии с игровым полем
gameBoard.addEventListener('touchstart', preventScroll, { passive: false });
gameBoard.addEventListener('touchmove', preventScroll, { passive: false });
gameBoard.addEventListener('touchend', (e) => {
    preventScroll(e);
    endBlockMove();
}, { passive: false });

gameBoard.addEventListener('mousedown', preventScroll);
gameBoard.addEventListener('mousemove', preventScroll);
gameBoard.addEventListener('mouseup', (e) => {
    preventScroll(e);
    endBlockMove();
});

// Инициализация игры при загрузке окна
window.addEventListener('load', initGame);

// Функция для запуска новой игровой сессии
function startNewSession() {
    resetGame();
    startGame();
}

// Функция для добавления новых уровней
function addNewLevels() {
    // Добавьте новые макеты уровней в массив levels
    levels.push([
        [RED, RED, EMPTY, GREEN, GREEN, RED],
        [RED, RED, EMPTY, EMPTY, EMPTY, RED],
        [KEY, KEY, EMPTY, RED, RED, RED],
        [GREEN, GREEN, EMPTY, RED, EMPTY, EMPTY],
        [RED, RED, EMPTY, RED, GREEN, GREEN],
        [RED, RED, EMPTY, EMPTY, EMPTY, RED]
    ]);
    // Обновите опции выбора уровня
    populateLevelSelect();
}

// Функция для генерации случайного уровня
function generateRandomLevel() {
    const newLevel = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
    
    // Добавление ключевого блока
    const keyRow = Math.floor(Math.random() * BOARD_SIZE);
    newLevel[keyRow][0] = KEY;
    newLevel[keyRow][1] = KEY;

    // Добавление случайных блоков
    for (let i = 0; i < 10; i++) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        if (newLevel[row][col] === EMPTY) {
            newLevel[row][col] = Math.random() < 0.5 ? RED : GREEN;
        }
    }

    return newLevel;
}

// Функция для добавления случайного уровня
function addRandomLevel() {
    levels.push(generateRandomLevel());
    populateLevelSelect();
}

// Инициализация игры при загрузке окна
window.addEventListener('load', initGame);

// Если вы хотите сделать некоторые функции доступными глобально (например, для отладки),
// вы можете присвоить их к объекту window:
window.startNewSession = startNewSession;
window.addNewLevels = addNewLevels;
window.addRandomLevel = addRandomLevel;
