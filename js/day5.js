let context;

const CANVAS_DIMENSION =  2000;
const GRID_DIMENSION =   4;
const TOTAL_CELLS =   GRID_DIMENSION * GRID_DIMENSION;
const CELL_DIMENSION =   CANVAS_DIMENSION / GRID_DIMENSION;
const CELL_PADDING =  25;

const NUM_TRANSITION_FRAMES = 30;
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
  for (let i = 0; i < array.length - 1; ++i) {
    const randomIndex = Math.floor(
      Math.random() * (array.length - i - 1)
    );

    const temp = array[randomIndex];
    array[randomIndex] = array[array.length - i - 1];
    array[array.length - i - 1] = temp;
  }
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
  const randomLayout = STANDARD_GRID.slice();

  while (isEqual(randomLayout, STANDARD_GRID)) {
    shuffle(randomLayout);
  }

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      game.grid[i][j] = randomLayout[i + j * GRID_DIMENSION] + 1;
      if (game.grid[i][j] === TOTAL_CELLS) {
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
  context.fillStyle = "black";
  context.fillRect(0, 0, CANVAS_DIMENSION, CANVAS_DIMENSION);

  // Draw cells
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const number = game.grid[i][j];
      if (number === TOTAL_CELLS) continue;

      context.fillStyle = "white";
      context.fillRect(
        i * CELL_DIMENSION + CELL_PADDING,
        j * CELL_DIMENSION + CELL_PADDING,
        CELL_DIMENSION - 2 * CELL_PADDING,
        CELL_DIMENSION - 2 * CELL_PADDING
      );

      context.fillStyle = "black";
      context.font = "25vh Roboto";
      context.fillText(
        game.grid[i][j],
        i * CELL_DIMENSION + 1 / 3 * CELL_DIMENSION,
        j * CELL_DIMENSION + 9 / 14 * CELL_DIMENSION
      );
    }
  }

  renderCounter();
}

function isWin() {
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
  
  if (isWin()) {
    alert("You won in " + game.moves + " moves!");
    resetGame();
  }
}

function isValidCoordinate(coordinate) {
  const { x, y } = coordinate;
  
  return x >= 0 && x < GRID_DIMENSION &&
         y >= 0 && y < GRID_DIMENSION;
}

function getMovingPiece(direction) {
  const { x, y } = game.emptyCell;

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

  const oppositeDirection = OPPOSITE_DIRECTION[direction];

  const { mX, mY } = getMovingPiece(oppositeDirection);
  if (!isValidCoordinate({ x: mX, y: mY })) return;

  const { x, y } = game.emptyCell;
  if (x === mX && y === mY) return;

  const temp = game.grid[x][y];
  game.grid[x][y] = game.grid[mX][mY];
  game.grid[mX][mY] = temp;

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
