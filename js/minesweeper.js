const BOARD_NUM_CELLS_X = 10;
const BOARD_NUM_CELLS_Y = 10;

const CELL_UNEXPOSED_SAFE = -1;
const CELL_UNEXPOSED_MINE = -2;
const CELL_FLAGGED_SAFE = -3;
const CELL_FLAGGED_MINE = -4;

const TOTAL_MINE_COUNT = 10;

const DEFAULLT_TOTAL_FLAGS = 10;
const DEFAULT_CELL = CELL_UNEXPOSED_SAFE;

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
      cell.addEventListener('click', exposeCell);

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

  const candidatePositions = shuffle(boardPositions)
    .slice(0, TOTAL_MINE_COUNT);

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
        cell.textContent = '';
        cell.setAttribute('class', 'unexposed');
      } else if (
        board[i][j] === CELL_FLAGGED_SAFE
        || board[i][j] === CELL_FLAGGED_MINE
      ) {
        cell.setAttribute('class', 'flagged');
      } else {
        cell.setAttribute('class', 'exposed-safe');

        if (board[i][j] !== 0) {
          cell.textContent = board[i][j];
        }
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
    } else if (board[y][x] === CELL_UNEXPOSED_SAFE) {
      board[y][x] = CELL_FLAGGED_SAFE;
    } else if (board[y][x] === CELL_FLAGGED_MINE) {
      board[y][x] = CELL_UNEXPOSED_MINE;
    } else if (board[y][x] === CELL_UNEXPOSED_MINE) {
      board[y][x] = CELL_FLAGGED_MINE;
    }
  }

  renderGame();
}

function isOutOfBounds(x, y) {
  return (
    (x < 0 || x >= BOARD_NUM_CELLS_X)
    || (y < 0 || y >= BOARD_NUM_CELLS_Y)
  );
}

function getSurroundingCoordinates(x, y) {
  const surroundingCells = [];

  for (let i = -1; i <= 1; ++i) {
    for (let j = -1; j <= 1; ++j) {
      if (i === 0 && j === 0) {
        continue;
      }

      const x1 = x + j;
      const y1 = y + i;

      if (!isOutOfBounds(x1, y1)) {
        surroundingCells.push({ x: x1, y: y1 });
      }
    }
  }

  return surroundingCells;
}


function countMines(coordinates) {
  let numMines = 0;

  for (const { x, y } of coordinates) {
    if (
      board[y][x] === CELL_UNEXPOSED_MINE
      || board[y][x] === CELL_FLAGGED_MINE
    ) {
      numMines += 1;
    }
  }

  return numMines;
}

function exposeCell(event) {
  const cell = event.target;
  const x = cell.cellIndex;
  const y = cell.parentNode.rowIndex;

  if (board[y][x] === CELL_UNEXPOSED_SAFE) {
    // cellsToSearch is treated like a queue
    let coordinatesToSearch = [{ x, y }];

    while (coordinatesToSearch.length > 0) {
      const coordinate = coordinatesToSearch.shift();
      const { x, y } = { ...coordinate };

      const surroundingCoordinates = getSurroundingCoordinates(x, y);
      const numSurroundingMines = countMines(surroundingCoordinates);

      if (numSurroundingMines === 0) {
        for (const { x: x1, y: y1 } of surroundingCoordinates) {
          if (board[y1][x1] === CELL_UNEXPOSED_SAFE) {
            coordinatesToSearch.push({ x: x1, y: y1 });
          }
        }
      }

      board[y][x] = numSurroundingMines;
    }
  } else if (board[y][x] === CELL_UNEXPOSED_MINE) {
    endGame();
  }

  renderGame();
}

function endGame() {
  for (const { x, y } of mines) {
    const cell = document.querySelector('#board')
      .childNodes[y]
      .childNodes[x];

    cell.setAttribute('class', 'exposed-mine');
  }

  alert('You lost! Better luck next time.');
  resetGame();
}

window.onload = () => {
  renderBoardDOM();
  resetGame();
  renderGame();
};
