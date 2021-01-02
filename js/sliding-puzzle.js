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
  if (array1.length !== array2.length) return false;

  const size = array1.length;
  for (let i = 0; i < size; ++i) {
    if (array1[i] !== array2[i]) return false;
  }

  return true;
}

function resetGame() {
  const STANDARD_GRID = [...Array(TOTAL_CELLS).keys()];
  let randomLayout = STANDARD_GRID.slice();

  while (isEqual(randomLayout, STANDARD_GRID)) {
    randomLayout = shuffle(STANDARD_GRID);
  }

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      game.grid[i][j] = randomLayout[j + i * GRID_DIMENSION] + 1;
      if (game.grid[i][j] === EMPTY_CELL) {
        game.emptyCell = { y: i, x: j };
      }
    }
  }

  game.moves = 0;
}

function renderCounter() {
  const counter = document.getElementById('move-counter');
  counter.innerHTML = 'Moves: ' + game.moves;
}

function renderGame() {
  const table = document.getElementById('grid');

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    const row = table.childNodes[i];

    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const cell = row.childNodes[j];

      if (game.grid[i][j] === EMPTY_CELL) {
        cell.style.backgroundColor = 'black';
        cell.innerHTML = '';
      } else {
        cell.style.backgroundColor = 'white';
        cell.innerHTML = game.grid[i][j];
      }
    }
  }

  renderCounter();
}

function playerWins() {
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      if (game.grid[i][j] !== j + i * GRID_DIMENSION + 1) {
        return false;
      }
    }
  }

  return true;
}

function updateGrid() {
  renderGame();

  if (playerWins()) {
    alert('You won in ' + game.moves + ' moves!');
    resetGame();
    renderGame();
  }
}

function isValidCoordinate(coordinate) {
  const { y, x } = coordinate;
  
  return y >= 0 && y < GRID_DIMENSION &&
         x >= 0 && x < GRID_DIMENSION;
}

function getNeighbours({ y, x }) {
  return {
    'LEFT':   { nY: y, nX: x - 1 },
    'UP':     { nY: y - 1, nX: x },
    'RIGHT':  { nY: y, nX: x + 1 },
    'DOWN':   { nY: y + 1, nX: x },
  };
}

function getPiece(cell, direction) {
  const neighbours = getNeighbours(cell);
  return neighbours[direction];
}

function moveKey(event) {
  const direction = CODE_TO_DIRECTION[event.keyCode];
  if (direction === undefined) return;

  const pieceDirection = OPPOSITE_DIRECTION[direction];

  const { nY, nX } = getPiece(game.emptyCell, pieceDirection);
  if (!isValidCoordinate({ y: nY, x: nX })) return;

  const { y, x } = game.emptyCell;
  game.grid[y][x] = game.grid[nY][nX];
  game.grid[nY][nX] = EMPTY_CELL;

  game.emptyCell.y = nY;
  game.emptyCell.x = nX;

  ++game.moves;

  updateGrid();
}

function cellToCoordinate(cell) {
  const y = ~~(cell / GRID_DIMENSION);
  const x = cell % GRID_DIMENSION;

  return { y, x };
}

function moveClick(event) {
  const cell = event.target.id.match(/cell(.*)/);
  if (cell === null) return;

  const coordinate = cellToCoordinate(parseInt(cell[1]) - 1);
  if (!isValidCoordinate(coordinate)) return;

  const { y, x } = coordinate;
  const neighbours = getNeighbours(coordinate);

  for (const neighbour of Object.values(neighbours)) {
    const { nY, nX } = neighbour;
    if (!isValidCoordinate({ y: nY, x: nX })) continue;

    if (game.grid[nY][nX] === EMPTY_CELL) {
      game.grid[nY][nX] = game.grid[y][x];
      game.grid[y][x] = EMPTY_CELL;

      game.emptyCell = { y, x };
      ++game.moves;
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
      cell.id = 'cell' + (j + i * GRID_DIMENSION + 1);
      cell.addEventListener('click', moveClick);
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  const gameContainer = document.getElementById('game');
  gameContainer.appendChild(table);

  resetGame();
  renderGame();

  document.addEventListener('keydown', moveKey);
};
