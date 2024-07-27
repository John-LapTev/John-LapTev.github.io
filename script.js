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
const statsBtn = document.getElementById('stats-btn');
const autoSolveBtn = document.getElementById('auto-solve-btn');
const winModal = document.getElementById('win-modal');
const nextLevelBtn = document.getElementById('next-level-btn');
const hintModal = document.getElementById('hint-modal');
const hintText = document.getElementById('hint-text');
const closeHintBtn = document.getElementById('close-hint');
const statsModal = document.getElementById('stats-modal');
const closeStatsBtn = document.getElementById('close-stats');
const showLeaderboardBtn = document.getElementById('show-leaderboard');
const leaderboardModal = document.getElementById('leaderboard-modal');
const closeLeaderboardBtn = document.getElementById('close-leaderboard');
const leaderboardBody = document.getElementById('leaderboard-body');
const tasksBtn = document.getElementById('tasks-btn');
const tasksModal = document.getElementById('tasks-modal');
const closeTasksBtn = document.getElementById('close-tasks');
const mainTaskList = document.getElementById('main-task-list');
const sideTaskList = document.getElementById('side-task-list');
const subscriptionModal = document.getElementById('subscription-modal');
const coinCounter = document.getElementById('coin-counter');
const coinCount = document.getElementById('coin-count');
const tutorialModal = document.getElementById('tutorial-modal');
const tutorialText = document.getElementById('tutorial-text');
const tutorialNextBtn = document.getElementById('tutorial-next');

let startTime;
let timerInterval;
let gameStarted = false;
let selectedBlock = null;
let isRussian = true;
let isAutoPlaying = false;
let moveHistory = [];
let currentLevel = 1;
let currentUser = null;
let isDarkTheme = true;
let moves = 0;
let completedLevels = [];
let completedSideTasks = [];
let coins = 0;
let tutorialStep = 0;

let touchStartY;
let touchStartX;
let isTouchingGameBoard = false;
let isMovingBlock = false;

const EMPTY = 'E';
const RED = 'R';
const BLUE = 'B';
const GREEN = 'G';
const KEY = 'K';

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
];

let currentBoard = JSON.parse(JSON.stringify(levels[0]));

function createBoard() {
    gameBoard.innerHTML = '';
    gameBoard.appendChild(startOverlay);
    const cellSize = gameBoard.clientWidth / 6;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.left = `${j * cellSize}px`;
            cell.style.top = `${i * cellSize}px`;
            
            if (i === 2 && j === 5) {
                cell.classList.add('exit-cell');
            }
            
            gameBoard.appendChild(cell);
        }
    }
    
    const lockIcon = document.createElement('div');
    lockIcon.classList.add('lock-icon');
    lockIcon.textContent = '🔒';
    gameBoard.appendChild(lockIcon);
    
    updateBlocks();

    gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
    gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
    gameBoard.addEventListener('touchend', handleTouchEnd, { passive: false });
}

function handleTouchStart(e) {
    isTouchingGameBoard = true;
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    isMovingBlock = false;
}

function handleTouchMove(e) {
    if (!isTouchingGameBoard) return;
    
    const touchCurrentY = e.touches[0].clientY;
    const touchCurrentX = e.touches[0].clientX;
    const deltaY = touchCurrentY - touchStartY;
    const deltaX = touchCurrentX - touchStartX;
    
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
        e.preventDefault();
        return;
    }
    
    if (Math.abs(deltaX) > 5) {
        isMovingBlock = true;
    }
    
    if (isMovingBlock) {
        e.preventDefault();
    }
}

function handleTouchEnd(e) {
    isTouchingGameBoard = false;
    if (isMovingBlock) {
        e.preventDefault();
        isMovingBlock = false;
    }
}

function updateBlocks() {
    const existingBlocks = gameBoard.querySelectorAll('.block');
    existingBlocks.forEach(block => block.remove());

    const cellSize = gameBoard.clientWidth / 6;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (currentBoard[i][j] !== EMPTY && !isPartOfLargerBlock(i, j)) {
                const block = createBlock(i, j, cellSize);
                gameBoard.appendChild(block);
            }
        }
    }
}

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

function splitTypeAndNumber(cell) {
    const match = cell.match(/([RGBK])(\d+)?/);
    return match ? [match[1], match[2] || ''] : [cell, ''];
}

function isSameBlock(cell1, cell2) {
    const [type1, number1] = splitTypeAndNumber(cell1);
    const [type2, number2] = splitTypeAndNumber(cell2);
    return type1 === type2 && number1 === number2;
}

function createBlock(row, col, cellSize) {
    const block = document.createElement('div');
    const [type, number] = splitTypeAndNumber(currentBoard[row][col]);
    block.classList.add('block', type.toLowerCase());
    if (number) block.classList.add(`n${number}`);
    
    let width = 1, height = 1;
    
    if (type === GREEN || type === KEY || (type === BLUE && number)) {
        while (col + width < 6 && isSameBlock(currentBoard[row][col + width], currentBoard[row][col])) {
            width++;
        }
    }
    
    if (type === RED || (type === BLUE && (number || width === 1))) {
        while (row + height < 6 && isSameBlock(currentBoard[row + height][col], currentBoard[row][col])) {
            height++;
        }
    }
    
    block.style.width = `${width * cellSize - 4}px`;
    block.style.height = `${height * cellSize - 4}px`;
    block.style.left = `${col * cellSize + 2}px`;
    block.style.top = `${row * cellSize + 2}px`;
    block.dataset.row = row;
    block.dataset.col = col;
    block.dataset.width = width;
    block.dataset.height = height;
    block.dataset.type = type;
    block.dataset.number = number;
    block.addEventListener('mousedown', startDrag);
    block.addEventListener('touchstart', startDrag, { passive: false });
    if (type === KEY) {
        block.innerHTML = '🔑';
    }
    return block;
}

function startDrag(e) {
    if (!gameStarted || isAutoPlaying) return;
    e.preventDefault();
    selectedBlock = e.target.closest('.block');
    if (selectedBlock) {
        isMovingBlock = true;
        const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        const startLeft = parseInt(selectedBlock.style.left);
        const startTop = parseInt(selectedBlock.style.top);
        const blockType = selectedBlock.dataset.type;
        const blockNumber = selectedBlock.dataset.number;
        const isHorizontal = blockType === GREEN || blockType === KEY || (blockType === BLUE && blockNumber && selectedBlock.dataset.width > 1);
        const isVertical = blockType === RED || (blockType === BLUE && blockNumber && selectedBlock.dataset.height > 1);
        const isOmnidirectional = blockType === BLUE && !blockNumber;
        const cellSize = gameBoard.clientWidth / 6;

        let lastValidLeft = startLeft;
        let lastValidTop = startTop;

        function drag(e) {
            if (!selectedBlock) return;
            e.preventDefault();
            const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            const dx = currentX - startX;
            const dy = currentY - startY;
            let newLeft = startLeft, newTop = startTop;

            if (isHorizontal || isOmnidirectional) {
                newLeft = startLeft + dx;
            }
            if (isVertical || isOmnidirectional) {
                newTop = startTop + dy;
            }

            const [canMove, snapPosition] = canMoveAndSnap(selectedBlock, newLeft, newTop);
            if (canMove) {
                lastValidLeft = snapPosition.left;
                lastValidTop = snapPosition.top;
                requestAnimationFrame(() => {
                    if (selectedBlock) {
                        moveBlock(selectedBlock, snapPosition.left, snapPosition.top);
                    }
                });
            } else {
                requestAnimationFrame(() => {
                    if (selectedBlock) {
                        moveBlock(selectedBlock, lastValidLeft, lastValidTop);
                    }
                });
            }
        }

        function endDrag() {
            if (!selectedBlock) return;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', endDrag);
            snapToGrid(selectedBlock);
            updateBoardState();
            if (checkWin()) {
                endGame();
            }
            selectedBlock = null;
            isMovingBlock = false;
        }

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
    }
}

function canMoveAndSnap(block, newLeft, newTop) {
    const cellSize = gameBoard.clientWidth / 6;
    const snapCol = Math.round(newLeft / cellSize);
    const snapRow = Math.round(newTop / cellSize);
    const width = parseInt(block.dataset.width);
    const height = parseInt(block.dataset.height);
    const startRow = parseInt(block.dataset.row);
    const startCol = parseInt(block.dataset.col);
    const blockType = block.dataset.type;
    const blockNumber = block.dataset.number;

    if (snapRow < 0 || snapRow + height > 6 || snapCol < 0 || snapCol + width > 6) {
        return [false, { left: newLeft, top: newTop }];
    }

    const rowStep = snapRow > startRow ? 1 : (snapRow < startRow ? -1 : 0);
    const colStep = snapCol > startCol ? 1 : (snapCol < startCol ? -1 : 0);

    let row = startRow;
    let col = startCol;

    while (row !== snapRow || col !== snapCol) {
        row += rowStep;
        col += colStep;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (currentBoard[row + i][col + j] !== EMPTY &&
                    !isSameBlock(currentBoard[row + i][col + j], blockType + blockNumber)) {
                    return [false, { left: newLeft, top: newTop }];
                }
            }
        }
    }

    return [true, { left: snapCol * cellSize + 2, top: snapRow * cellSize + 2 }];
}

function moveBlock(block, newLeft, newTop) {
    block.style.left = `${newLeft}px`;
    block.style.top = `${newTop}px`;
}

function snapToGrid(block) {
    const cellSize = gameBoard.clientWidth / 6;
    const left = parseInt(block.style.left);
    const top = parseInt(block.style.top);
    const snapLeft = Math.round(left / cellSize) * cellSize + 2;
    const snapTop = Math.round(top / cellSize) * cellSize + 2;
    moveBlock(block, snapLeft, snapTop);
}

function updateBoardState() {
    currentBoard = Array(6).fill().map(() => Array(6).fill(EMPTY));
    const blocks = gameBoard.querySelectorAll('.block');
    const cellSize = gameBoard.clientWidth / 6;
    blocks.forEach(block => {
        const col = Math.round((parseInt(block.style.left) - 2) / cellSize);
        const row = Math.round((parseInt(block.style.top) - 2) / cellSize);
        const type = block.dataset.type;
        const number = block.dataset.number;
        const width = parseInt(block.dataset.width);
        const height = parseInt(block.dataset.height);
        const cellValue = number ? type + number : type;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                currentBoard[row + i][col + j] = cellValue;
            }
        }
        block.dataset.row = row;
        block.dataset.col = col;
    });
}

function checkWin() {
    const keyBlocks = Array.from(gameBoard.querySelectorAll('.block.k'));
    return keyBlocks.every(block => {
        const keyCol = Math.round((parseInt(block.style.left) - 2) / (gameBoard.clientWidth / 6));
        const keyWidth = parseInt(block.dataset.width);
        return keyCol + keyWidth === 6;
    });
}

function startGame() {
    gameStarted = true;
    startTime = Date.now();
    moveHistory = [];
    moves = 0;
    updateMovesCounter();
    timerInterval = setInterval(updateTimer, 1000);
    startOverlay.classList.add('hidden');
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timer.textContent = `${minutes}:${seconds}`;
    timer.classList.add('highlight');
    setTimeout(() => timer.classList.remove('highlight'), 300);
}

function updateMovesCounter() {
    movesCounter.textContent = isRussian ? `Ходов: ${moves}` : `Moves: ${moves}`;
}

function endGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    isAutoPlaying = false;
    const finalTime = timer.textContent;
    
    if (!completedLevels.includes(currentLevel)) {
        completedLevels.push(currentLevel);
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        addCoins(5);
    }
    
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

    updateLeaderboard(finalTime);
    showConfetti();
    showWinModal(finalTime);
    updateTasks();
}

function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
        confettiContainer.remove();
    }, 3000);
}

function showWinModal(finalTime) {
    const winMessage = document.getElementById('win-message');
    winMessage.textContent = isRussian ?
        `Вы прошли уровень за ${finalTime}! Количество ходов: ${moves}` :
        `You completed the level in ${finalTime}! Number of moves: ${moves}`;
    winModal.classList.remove('hidden');
}

function resetGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    isAutoPlaying = false;
    timer.textContent = '00:00';
    moves = 0;
    updateMovesCounter();
    currentBoard = JSON.parse(JSON.stringify(levels[currentLevel - 1]));
    moveHistory = [];
    updateBlocks();
    startOverlay.classList.remove('hidden');
    updateCurrentLevelDisplay();
}

function showLevelModal() {
    levelModal.classList.remove('hidden');
}

function hideLevelModal() {
    levelModal.classList.add('hidden');
}

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

function changeLevel() {
    const selectedLevel = parseInt(levelSelect.value);
    if (selectedLevel !== currentLevel) {
        currentLevel = selectedLevel;
        resetGame();
    }
    hideLevelModal();
}

function toggleLanguage() {
    isRussian = !isRussian;
    updateTexts();
    populateLevelSelect();
    updateMovesCounter();
    updateCurrentLevelDisplay();
    updateTasks();
}

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
        hintText: 'Красные блоки: двигаются только вверх и вниз\nЗелёные и Ключ: влево и вправо\nСиние: в зависимости от формы',
        selectLevel: 'Выберите уровень',
        autoSolve: 'Авто решение',
        stats: 'Статистика',
        nextLevel: 'Следующий уровень',
        leaderboard: 'Таблица лидеров',
        totalGames: 'Всего игр',
        bestTime: 'Лучшее время',
        avgMoves: 'Среднее кол-во ходов',
        levelsCompleted: 'Пройдено уровней',
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
        hintText: 'Red blocks: move up and down only\nGreen and Key: left and right\nBlue: depends on shape',
        selectLevel: 'Select Level',
        autoSolve: 'Auto Solve',
        stats: 'Statistics',
        nextLevel: 'Next Level',
        leaderboard: 'Leaderboard',
        totalGames: 'Total Games',
        bestTime: 'Best Time',
        avgMoves: 'Average Moves',
        levelsCompleted: 'Levels Completed',
        tasks: 'Tasks',
        mainTasks: 'Main',
        sideTasks: 'Side',
        complete: 'Complete',
        coins: 'Coins'
    };

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
    statsBtn.title = texts.stats;
    nextLevelBtn.textContent = texts.nextLevel;
    document.getElementById('settings-title').textContent = texts.settings;
    document.querySelector('#stats-modal h2').textContent = texts.stats;
    document.getElementById('show-leaderboard').textContent = texts.leaderboard;
    document.querySelector('#leaderboard-modal h2').textContent = texts.leaderboard;
    document.querySelector('#tasks-btn span').textContent = texts.tasks;
    document.querySelector('#tasks-modal h2').textContent = texts.tasks;
    document.querySelector('.tab[data-tab="main"]').textContent = texts.mainTasks;
    document.querySelector('.tab[data-tab="side"]').textContent = texts.sideTasks;
    coinCounter.title = texts.coins;
    
    // Update stats labels
    document.querySelector('.stats-item:nth-child(1) .stats-label').textContent = texts.totalGames + ':';
    document.querySelector('.stats-item:nth-child(2) .stats-label').textContent = texts.bestTime + ':';
    document.querySelector('.stats-item:nth-child(3) .stats-label').textContent = texts.avgMoves + ':';
    document.querySelector('.stats-item:nth-child(4) .stats-label').textContent = texts.levelsCompleted + ':';

    updateUserInfo();
}

function showUsernameModal() {
    usernameModal.classList.remove('hidden');
}

function hideUsernameModal() {
    usernameModal.classList.add('hidden');
}

function setUsername() {
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = { name: username };
        hideUsernameModal();
        updateUserInfo();
        localStorage.setItem('username', username);
        showTutorial();
    } else {
        alert(isRussian ? 'Пожалуйста, введите ваше имя' : 'Please enter your name');
    }
}

function updateUserInfo() {
    const userInfoElement = document.getElementById('user-info');
    if (currentUser) {
        userInfoElement.textContent = `${isRussian ? 'Игрок' : 'Player'}: ${currentUser.name}`;
    } else {
        userInfoElement.textContent = isRussian ? 'Игрок не зарегистрирован' : 'Player not registered';
    }
}

function toggleSettingsModal() {
    settingsModal.classList.toggle('hidden');
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme', !isDarkTheme);
    updateThemeColors();
    localStorage.setItem('isDarkTheme', isDarkTheme);
}

function updateThemeColors() {
    if (isDarkTheme) {
        document.documentElement.style.setProperty('--bg-color', '#121212');
        document.documentElement.style.setProperty('--text-color', '#e0e0e0');
        document.documentElement.style.setProperty('--modal-bg', '#1a1a1a');
        document.documentElement.style.setProperty('--board-bg', '#1e1e1e');
        document.documentElement.style.setProperty('--cell-border', '#2c2c2c');
    } else {
        document.documentElement.style.setProperty('--bg-color', '#f0f0f0');
        document.documentElement.style.setProperty('--text-color', '#333333');
        document.documentElement.style.setProperty('--modal-bg', '#ffffff');
        document.documentElement.style.setProperty('--board-bg', '#e0e0e0');
        document.documentElement.style.setProperty('--cell-border', '#cccccc');
    }
}

function showHint() {
    hintText.textContent = isRussian ? 
        'Горизонтальные блоки: двигаются только влево и вправо\nВертикальные блоки: двигаются только вверх и вниз\nКвадратные блоки: могут двигаться в любом направлении\nКлюч: нужно довести до правого края' : 
        'Horizontal blocks: move left and right only\nVertical blocks: move up and down only\nSquare blocks: can move in any direction\nKey: needs to reach the right edge';
    hintModal.classList.remove('hidden');
}

function hideHint() {
    hintModal.classList.add('hidden');
}

function updateCurrentLevelDisplay() {
    currentLevelDisplay.textContent = isRussian ? `Уровень ${currentLevel}` : `Level ${currentLevel}`;
}

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

    statsModal.classList.remove('hidden');
}

function hideStats() {
    statsModal.classList.add('hidden');
}

function nextLevel() {
    if (currentLevel < levels.length) {
        currentLevel++;
        resetGame();
    } else {
        alert(isRussian ? 'Вы прошли все уровни!' : 'You have completed all levels!');
    }
    winModal.classList.add('hidden');
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

function hideLeaderboard() {
    leaderboardModal.classList.add('hidden');
}

function showTasks() {
    updateTasks();
    tasksModal.classList.remove('hidden');
}

function hideTasks() {
    tasksModal.classList.add('hidden');
}

function updateTasks() {
    updateMainTasks();
    updateSideTasks();
}

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
            showSubscriptionModal(taskId);
        });
    });
}

function showSubscriptionModal(taskId) {
    subscriptionModal.classList.remove('hidden');
    setTimeout(() => {
        completeSideTask(taskId);
        subscriptionModal.classList.add('hidden');
    }, 5000);
}

function completeSideTask(taskId) {
    if (!completedSideTasks.includes(taskId)) {
        completedSideTasks.push(taskId);
        localStorage.setItem('completedSideTasks', JSON.stringify(completedSideTasks));
        addCoins(15);
        updateSideTasks();
    }
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tasks`).classList.add('active');
}

function addCoins(amount) {
    coins += amount;
    localStorage.setItem('coins', coins);
    updateCoinCounter();
    showCoinAnimation(amount);
}

function updateCoinCounter() {
    coinCount.textContent = coins;
}

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

function showTutorial() {
    tutorialStep = 0;
    showNextTutorialStep();
}

function showNextTutorialStep() {
    const tutorialSteps = [
        {
            text: isRussian ? 'Добро пожаловать в UnBlock Me! Цель игры - вставить ключ в замок, передвигая другие блоки что бы освободить путь.' : 'Welcome to UnBlock Me! The goal of the game is to insert the key into the lock by moving other blocks to clear the way.',
            highlight: '#game-board'
        },
        {
            text: isRussian ? 'Зарабатывайте монеты, проходя уровни и выполняя задания.' : 'Earn coins by completing levels and tasks.',
            highlight: '#coin-counter'
        },
        {
            text: isRussian ? 'Уровни обновляются каждые 24 часа. Не пропускайте обновления, чтобы заработать больше монет!' : 'Levels are updated every 24 hours. Don\'t miss updates to earn more coins!',
            highlight: '#level-btn'
        }
    ];

    if (tutorialStep < tutorialSteps.length) {
        const step = tutorialSteps[tutorialStep];
        tutorialText.textContent = step.text;
        tutorialModal.classList.remove('hidden');
        highlightElement(step.highlight);
    } else {
        tutorialModal.classList.add('hidden');
        removeHighlight();
    }
}

function highlightElement(selector) {
    removeHighlight();
    const element = document.querySelector(selector);
    if (element) {
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight';
        const rect = element.getBoundingClientRect();
        highlight.style.left = `${rect.left - 5}px`;
        highlight.style.top = `${rect.top - 5}px`;
        highlight.style.width = `${rect.width + 10}px`;
        highlight.style.height = `${rect.height + 10}px`;
        document.body.appendChild(highlight);
    }
}

function removeHighlight() {
    const existingHighlight = document.querySelector('.tutorial-highlight');
    if (existingHighlight) {
        existingHighlight.remove();
    }
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
hintBtn.addEventListener('click', showHint);
levelBtn.addEventListener('click', showLevelModal);
settingsBtn.addEventListener('click', toggleSettingsModal);
submitUsernameBtn.addEventListener('click', setUsername);
closeSettingsBtn.addEventListener('click', toggleSettingsModal);
languageToggle.addEventListener('click', toggleLanguage);
themeToggle.addEventListener('change', toggleTheme);
confirmLevelBtn.addEventListener('click', changeLevel);
statsBtn.addEventListener('click', showStats);
nextLevelBtn.addEventListener('click', nextLevel);
closeHintBtn.addEventListener('click', hideHint);
closeStatsBtn.addEventListener('click', hideStats);
showLeaderboardBtn.addEventListener('click', showLeaderboard);
closeLeaderboardBtn.addEventListener('click', hideLeaderboard);
tasksBtn.addEventListener('click', showTasks);
closeTasksBtn.addEventListener('click', hideTasks);
tutorialNextBtn.addEventListener('click', () => {
    tutorialStep++;
    showNextTutorialStep();
});

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

window.addEventListener('load', () => {
    createBoard();
    populateLevelSelect();
    updateTexts();
    updateCurrentLevelDisplay();
    updateThemeColors();

    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        currentUser = { name: savedUsername };
        updateUserInfo();
        showTutorial();
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
});

function undo() {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        currentBoard = lastMove.board;
        updateBlocks();
        moves--;
        updateMovesCounter();
    }
}

// Mobile touch events update
gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
gameBoard.addEventListener('touchend', handleTouchEnd, { passive: false });

// Prevent scrolling when touching the game board
gameBoard.addEventListener('touchmove', (e) => {
    if (isTouchingGameBoard) {
        e.preventDefault();
    }
}, { passive: false });

// Add this to initialize the game when the window loads
window.addEventListener('load', initGame);

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
        showTutorial();
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

// Call this function to start a new game session
function startNewSession() {
    resetGame();
    startGame();
}

// You can add more levels or randomly generate them here
function addNewLevels() {
    // Add new level layouts to the levels array
    levels.push([
        [RED, RED, EMPTY, GREEN, GREEN, RED],
        [RED, RED, EMPTY, EMPTY, EMPTY, RED],
        [KEY, KEY, EMPTY, RED, RED, RED],
        [GREEN, GREEN, EMPTY, RED, EMPTY, EMPTY],
        [RED, RED, EMPTY, RED, GREEN, GREEN],
        [RED, RED, EMPTY, EMPTY, EMPTY, RED]
    ]);
    // Update level select options
    populateLevelSelect();
}

// Function to generate a random level (you can implement your own logic here)
function generateRandomLevel() {
    // This is a simple example, you should implement more sophisticated logic
    const newLevel = Array(6).fill().map(() => Array(6).fill(EMPTY));
    
    // Add key block
    const keyRow = Math.floor(Math.random() * 6);
    newLevel[keyRow][0] = KEY;
    newLevel[keyRow][1] = KEY;

    // Add some random blocks
    for (let i = 0; i < 10; i++) {
        const row = Math.floor(Math.random() * 6);
        const col = Math.floor(Math.random() * 6);
        if (newLevel[row][col] === EMPTY) {
            newLevel[row][col] = Math.random() < 0.5 ? RED : GREEN;
        }
    }

    return newLevel;
}

// Function to add a random level
function addRandomLevel() {
    levels.push(generateRandomLevel());
    populateLevelSelect();
}
