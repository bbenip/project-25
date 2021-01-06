const BOARD_NUM_CELLS_X = 10;
const BOARD_NUM_CELLS_Y = 10;

const CELL_UNEXPOSED_SAFE = -1;
const CELL_UNEXPOSED_MINE = -2;
const CELL_FLAGGED_SAFE = -3;
const CELL_FLAGGED_MINE = -4;

const MINE_COUNT = 10;

const DEFAULLT_TOTAL_FLAGS = 10;
const DEFAULT_CELL = CELL_UNEXPOSED_SAFE;

let totalFlags = DEFAULLT_TOTAL_FLAGS;
let mines = [];
let board = [];

function renderBoardDOM() {
  const board = document.createElement('table');
  board.setAttribute('id', 'board');

  for (let i = 0; i < BOARD_NUM_CELLS_Y; ++i) {
    const row = document.createElement('tr');

    for (let j = 0; j < BOARD_NUM_CELLS_X; ++j) {
      const cell = document.createElement('td');
      cell.addEventListener('contextmenu', flagCell);

      row.appendChild(cell);
    }

    board.appendChild(row);
  }

  document.querySelector('#game').appendChild(board);
}

// Fisher-Yates shuffle
function shuffle(array) {
  const shuffledArray = array.slice();
  const arrayLength = shuffledArray.length;

  for (let i = 0; i < arrayLength - 1; ++i) {
    const randomIndex = Math.floor(Math.random() * (arrayLength - i));
    const temp = shuffledArray[arrayLength - 1 - i];

    shuffledArray[arrayLength - 1 - i] = shuffledArray[randomIndex];
    shuffledArray[randomIndex] = temp;
  }

  return shuffledArray;
}

function setMines() {
  const boardPositions = Array(BOARD_NUM_CELLS_X * BOARD_NUM_CELLS_Y)
    .fill(CELL_UNEXPOSED_SAFE)
    .map((value, index) => index);

  const candidatePositions = shuffle(boardPositions).slice(0, MINE_COUNT);

  mines = candidatePositions.map((position) => ({
    x: position % BOARD_NUM_CELLS_X,
    y: ~~(position / BOARD_NUM_CELLS_X),
  }));

  for (const { x, y } of mines) {
    board[y][x] = CELL_UNEXPOSED_MINE;
  }
}

function resetGame() {
  board = Array(BOARD_NUM_CELLS_Y)
    .fill([])
    .map(() => Array(BOARD_NUM_CELLS_X).fill(DEFAULT_CELL));

  totalFlags = DEFAULLT_TOTAL_FLAGS;
  setMines();
}

function renderGame() {
  for (let i = 0; i < BOARD_NUM_CELLS_Y; ++i) {
    for (let j = 0; j < BOARD_NUM_CELLS_X; ++j) {
      const cell = document.querySelector(`#board`)
        .childNodes[i]
        .childNodes[j];

      if (
        board[i][j] === CELL_UNEXPOSED_SAFE
        || board[i][j] === CELL_UNEXPOSED_MINE
      ) {
        cell.setAttribute('class', 'unexposed');
      } else if (
        board[i][j] === CELL_FLAGGED_SAFE
        || board[i][j] === CELL_FLAGGED_MINE
      ) {
        cell.setAttribute('class', 'flagged');
      }
    }
  }
}


function flagCell(event) {
  event.preventDefault();

  const rightButton = 2;

  if (event.button === rightButton) {
    const cell = event.target;
    const x = cell.cellIndex;
    const y = cell.parentNode.rowIndex;

    if (board[y][x] === CELL_FLAGGED_SAFE) {
      board[y][x] = CELL_UNEXPOSED_SAFE;
      totalFlags += 1;
    } else if (board[y][x] === CELL_UNEXPOSED_SAFE) {
      board[y][x] = CELL_FLAGGED_SAFE;
      totalFlags -= 1;
    } else if (board[y][x] === CELL_FLAGGED_MINE) {
      board[y][x] = CELL_UNEXPOSED_MINE;
      totalFlags += 1;
    } else if (board[y][x] === CELL_UNEXPOSED_MINE) {
      board[y][x] = CELL_FLAGGED_MINE;
      totalFlags -= 1;
    }
  }

  renderGame();
}

window.onload = () => {
  renderBoardDOM();
  resetGame();
  renderGame();
};
