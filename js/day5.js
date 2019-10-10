let context;

const CANVAS_LENGTH =   2000;
const GRID_DIMENSION =  4;

const CELL_PADDING =  25;
const CELL_LENGTH =   CANVAS_LENGTH / GRID_DIMENSION;
const TOTAL_CELLS =   GRID_DIMENSION * GRID_DIMENSION;
const EMPTY_CELL =    16;

// Direction key codes
const [LEFT, UP, RIGHT, DOWN] = [37, 38, 39, 40];

const CODE_TO_DIRECTION = {
  37: "LEFT",
  38: "UP",
  39: "RIGHT",
  40: "DOWN"
};

const OPPOSITE_DIRECTION = {
  "LEFT":   "RIGHT",
  "UP":     "DOWN",
  "RIGHT":  "LEFT",
  "DOWN":   "UP"
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
      Math.random() * (result.length - i - 1)
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
      game.grid[i][j] = randomLayout[i + j * GRID_DIMENSION] + 1;
      if (game.grid[i][j] === EMPTY_CELL) {
        game.emptyCell = { x: i, y: j };
      }
    }
  }

  game.moves = 0;
}

function renderCounter() {
  const counter = document.getElementById("move-counter");
  counter.innerHTML = "Moves: " + game.moves;
}

function renderGame() {
  // Draw background
  context.fillStyle = "rgb(161, 94, 34)";
  context.fillRect(0, 0, CANVAS_LENGTH, CANVAS_LENGTH);

  // Draw cells
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      if (game.grid[i][j] === EMPTY_CELL) continue;

      context.fillStyle = "rgb(75, 75, 75)";
      context.fillRect(
        i * CELL_LENGTH + CELL_PADDING / 2,
        j * CELL_LENGTH + CELL_PADDING / 2,
        CELL_LENGTH - CELL_PADDING,
        CELL_LENGTH - CELL_PADDING
      );

      context.fillStyle = "rgb(235, 235, 235)";
      context.fillRect(
        i * CELL_LENGTH + CELL_PADDING,
        j * CELL_LENGTH + CELL_PADDING,
        CELL_LENGTH - 2 * CELL_PADDING,
        CELL_LENGTH - 2 * CELL_PADDING
      );

      context.fillStyle = "rgb(100, 100, 100)";
      context.font = "bold 25vh Roboto";
      context.fillText(
        game.grid[i][j],
        i * CELL_LENGTH + 1 / 3 * CELL_LENGTH,
        j * CELL_LENGTH + 2 / 3 * CELL_LENGTH
      );
    }
  }

  renderCounter();
}

function playerWins() {
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      if (game.grid[i][j] !== i + j * GRID_DIMENSION + 1) {
        return false;
      }
    }
  }

  return true;
}

function updateGrid() {
  renderGame();

  if (playerWins()) {
    alert("You won in " + game.moves + " moves!");
    resetGame();
    renderGame();
  }
}

function isValidCoordinate(coordinate) {
  const { x, y } = coordinate;
  
  return x >= 0 && x < GRID_DIMENSION &&
         y >= 0 && y < GRID_DIMENSION;
}

function getPiece(cell, direction) {
  const { x, y } = cell;

  const neighbours = {
    "LEFT":   { mX: x - 1, mY: y },
    "UP":     { mX: x,     mY: y - 1 },
    "RIGHT":  { mX: x + 1, mY: y },
    "DOWN":   { mX: x,     mY: y + 1 }
  };
  
  return neighbours[direction];
}

function movePiece(event) {
  const direction = CODE_TO_DIRECTION[event.keyCode];
  if (direction === undefined) return;

  const pieceDirection = OPPOSITE_DIRECTION[direction];

  const { mX, mY } = getPiece(game.emptyCell, pieceDirection);
  if (!isValidCoordinate({ x: mX, y: mY })) return;

  const { x, y } = game.emptyCell;
  game.grid[x][y] = game.grid[mX][mY];
  game.grid[mX][mY] = EMPTY_CELL;

  game.emptyCell.x = mX;
  game.emptyCell.y = mY;

  ++game.moves;

  updateGrid();
}

window.onload = () => {
  const board = document.getElementById("game");
  context = board.getContext("2d");

  resetGame();
  renderGame();

  document.addEventListener("keydown", movePiece);
};
