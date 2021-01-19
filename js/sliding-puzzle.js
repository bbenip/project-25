let context;

const GRID_DIMENSION  = 4;
const TOTAL_CELLS     = GRID_DIMENSION * GRID_DIMENSION;
const EMPTY_CELL      = GRID_DIMENSION * GRID_DIMENSION;

const CODE_TO_DIRECTION = {
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
};

const OPPOSITE_DIRECTION = {
  'LEFT':   'RIGHT',
  'UP':     'DOWN',
  'RIGHT':  'LEFT',
  'DOWN':   'UP',
};

const game = { grid: [], moves: 0, emptyCell: {} };

game.grid = new Array(GRID_DIMENSION);
for (let i = 0; i < GRID_DIMENSION; ++i) {
  game.grid[i] = new Array(GRID_DIMENSION);
}

// Fisher-Yates shuffle
function shuffle(array) {
  const result = array.slice();

  for (let i = 0; i < result.length - 1; ++i) {
    const randomIndex = Math.floor(
      Math.random() * (result.length - i)
    );

    const temp = result[randomIndex];
    result[randomIndex] = result[array.length - i - 1];
    result[result.length - i - 1] = temp;
  }

  return result;
}

function isEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  const size = array1.length;
  for (let i = 0; i < size; ++i) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}

function resetGame() {
  const STANDARD_GRID = [...Array(TOTAL_CELLS).keys()];
  let randomLayout = shuffle(STANDARD_GRID);

  while (isEqual(randomLayout, STANDARD_GRID)) {
    randomLayout = shuffle(STANDARD_GRID);
  }

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      game.grid[i][j] = randomLayout[i * GRID_DIMENSION + j] + 1;
      if (game.grid[i][j] === EMPTY_CELL) {
        game.emptyCell = { x: j, y: i };
      }
    }
  }

  game.moves = 0;
}

function renderCounter() {
  const counter = document.querySelector('#move-counter');
  counter.textContent = `Moves: ${game.moves}`;
}

function renderGame() {
  const table = document.querySelector('#grid');

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    const row = table.childNodes[i];

    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const cell = row.childNodes[j];

      if (game.grid[i][j] === EMPTY_CELL) {
        cell.style.backgroundColor = 'black';
        cell.textContent = '';
      } else {
        cell.style.backgroundColor = 'white';
        cell.textContent = game.grid[i][j];
      }
    }
  }

  renderCounter();
}

function playerWins() {
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      if (game.grid[i][j] !== i * GRID_DIMENSION + j + 1) {
        return false;
      }
    }
  }

  return true;
}

function updateGrid() {
  renderGame();

  if (playerWins()) {
    alert(`You won in ${game.moves} moves!`);
    resetGame();
    renderGame();
  }
}

function isValidCoordinate(x, y) {
  return (
    (y >= 0 && y < GRID_DIMENSION)
    && (x >= 0 && x < GRID_DIMENSION)
  );
}

function getNeighbours(x, y) {
  return {
    'LEFT':   { nX: x - 1,  nY: y     },
    'UP':     { nX: x,      nY: y - 1 },
    'RIGHT':  { nX: x + 1,  nY: y     },
    'DOWN':   { nX: x,      nY: y + 1 },
  };
}

function getPiece(x, y, direction) {
  const neighbours = getNeighbours(x, y);
  return neighbours[direction];
}

function moveByKey(event) {
  const direction = CODE_TO_DIRECTION[event.keyCode];
  if (direction === undefined) {
    return;
  }

  const { x, y } = game.emptyCell;
  const oppositeDirection = OPPOSITE_DIRECTION[direction];

  const { nX, nY } = getPiece(x, y, oppositeDirection);
  if (!isValidCoordinate(nX, nY)) {
    return;
  }

  game.grid[y][x] = game.grid[nY][nX];
  game.grid[nY][nX] = EMPTY_CELL;

  game.emptyCell = { x: nX, y: nY };
  game.moves += 1;

  updateGrid();
}

function moveByClick(event) {
  const cell = event.target;

  const x = cell.cellIndex;
  const y = cell.parentNode.rowIndex;

  const neighbours = getNeighbours(x, y);

  for (const neighbour of Object.values(neighbours)) {
    const { nX, nY } = neighbour;
    if (!isValidCoordinate(nX, nY)) {
      continue;
    }

    if (game.grid[nY][nX] === EMPTY_CELL) {
      game.grid[nY][nX] = game.grid[y][x];
      game.grid[y][x] = EMPTY_CELL;

      game.emptyCell = { x, y };
      game.moves += 1;
      updateGrid();

      break;
    }
  }
}

window.onload = () => {
  // Set grid for game
  const table = document.createElement('table');
  table.id = 'grid';

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    const row = document.createElement('tr');

    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const cell = document.createElement('td');
      cell.addEventListener('click', moveByClick);
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  const gameContainer = document.querySelector('#game');
  gameContainer.appendChild(table);

  resetGame();
  updateGrid();

  document.addEventListener('keydown', moveByKey);
};
