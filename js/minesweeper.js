const BOARD_NUM_CELLS_X = 10;
const BOARD_NUM_CELLS_Y = 10;

const CELL_UNEXPOSED_SAFE = -1;
const CELL_UNEXPOSED_MINE = -2;
const CELL_FLAGGED_SAFE = -3;
const CELL_FLAGGED_MINE = -4;

const TOTAL_MINE_COUNT = 10;
const TOTAL_CELLS = BOARD_NUM_CELLS_X * BOARD_NUM_CELLS_Y;

const DEFAULT_CELL = CELL_UNEXPOSED_SAFE;

let isNewGame = true;
let numCellsExposed = 0;
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

function setMines(x, y) {
  const boardPositions = Array(BOARD_NUM_CELLS_X * BOARD_NUM_CELLS_Y)
    .fill(CELL_UNEXPOSED_SAFE)
    .map((value, index) => index);

  const candidatePositions = shuffle(boardPositions)
    .slice(0, TOTAL_MINE_COUNT + 1);

  mines = candidatePositions
    .map((position) => ({
      x: position % BOARD_NUM_CELLS_X,
      y: ~~(position / BOARD_NUM_CELLS_X),
    }))
    .filter(({ x: x1, y: y1 }) => x !== x1 || y !== y1)
    .slice(0, TOTAL_MINE_COUNT);

  for (const { x: x2, y: y2 } of mines) {
    board[y2][x2] = CELL_UNEXPOSED_MINE;
  }
}

function resetGame() {
  board = Array(BOARD_NUM_CELLS_Y)
    .fill([])
    .map(() => Array(BOARD_NUM_CELLS_X).fill(DEFAULT_CELL));

  numCellsExposed = 0;
  isNewGame = true;
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

function getNeighboringCoordinates(x, y) {
  const neighboringCoordinates = [];

  for (let i = -1; i <= 1; ++i) {
    for (let j = -1; j <= 1; ++j) {
      if (i === 0 && j === 0) {
        continue;
      }

      const x1 = x + j;
      const y1 = y + i;

      if (!isOutOfBounds(x1, y1)) {
        neighboringCoordinates.push({ x: x1, y: y1 });
      }
    }
  }

  return neighboringCoordinates;
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

  if (isNewGame) {
    setMines(x, y);
  }

  if (board[y][x] === CELL_UNEXPOSED_SAFE) {
    // Flood-fill algorithm
    // cellsToSearch is treated like a queue
    let coordinatesToSearch = [{ x, y }];

    while (coordinatesToSearch.length > 0) {
      const coordinate = coordinatesToSearch.shift();
      const { x, y } = { ...coordinate };

      if (board[y][x] !== CELL_UNEXPOSED_SAFE) {
        continue;
      }

      const neighboringCoordinates = getNeighboringCoordinates(x, y);
      const numNeighboringMines = countMines(neighboringCoordinates);

      if (numNeighboringMines === 0) {
        for (const { x: x1, y: y1 } of neighboringCoordinates) {
          if (board[y1][x1] === CELL_UNEXPOSED_SAFE) {
            coordinatesToSearch.push({ x: x1, y: y1 });
          }
        }
      }

      board[y][x] = numNeighboringMines;
      numCellsExposed += 1;
    }

    isNewGame = false;
  } else if (board[y][x] === CELL_UNEXPOSED_MINE) {
    endGame();
  }

  checkWin();

  renderGame();
}

function checkWin() {
  if (numCellsExposed === TOTAL_CELLS - TOTAL_MINE_COUNT) {
    // Render to expose the last cell(s) before alert
    renderGame();

    for (const { x, y } of mines) {
      const cell = document.querySelector('#board')
        .childNodes[y]
        .childNodes[x];

      cell.setAttribute('class', 'unexposed-mine');
    }

    alert('You win! Congratulations on the victory.');
    resetGame();
  }
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
