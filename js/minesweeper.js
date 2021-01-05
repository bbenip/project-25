const BOARD_NUM_CELLS_X = 10;
const BOARD_NUM_CELLS_Y = 10;

const CELL_UNEXPOSED = -1;
const CELL_FLAGGED = -2;

const DEFAULLT_TOTAL_FLAGS = 10;
const DEFAULT_CELL = CELL_UNEXPOSED;

let totalFlags = DEFAULLT_TOTAL_FLAGS;
let board = [];

function resetGame() {
  board = Array(BOARD_NUM_CELLS_Y)
    .fill([])
    .map(() => Array(BOARD_NUM_CELLS_X).fill(DEFAULT_CELL));

  totalFlags = DEFAULLT_TOTAL_FLAGS;
}

function renderBoardDOM() {
  const board = document.createElement('table');

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

function flagCell(event) {
  event.preventDefault();

  const rightButton = 2;

  if (event.button === rightButton) {
    const cell = event.target;
    const x = cell.cellIndex;
    const y = cell.parentNode.rowIndex;

    if (board[y][x] === CELL_FLAGGED) {
      board[y][x] = CELL_UNEXPOSED;
      totalFlags += 1;
    } else if (board[y][x] === CELL_UNEXPOSED) {
      board[y][x] = CELL_FLAGGED;
      totalFlags -= 1;
    }
  }
}

window.onload = () => {
  resetGame();
  renderBoardDOM();
};
