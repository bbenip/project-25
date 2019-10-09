let context;

const DEFAULT_COORDINATE =  { x: -1, y: -1 };
const DEFAULT_DIRECTION =   'NONE';
const DEFAULT_TRAIL =       [];
const DEFAULT_LENGTH =      5;
const DEFAULT_SPEED =       [];

const CELL_DIMENSION =  80;
const CELL_PADDING =    5;
const BOARD_WIDTH =     2000;
const BOARD_HEIGHT =    1600;
const NUM_X_CELLS = BOARD_WIDTH / CELL_DIMENSION;
const NUM_Y_CELLS = BOARD_HEIGHT / CELL_DIMENSION;

const DIRECTIONS = ['LEFT', 'UP', 'DOWN', 'RIGHT'];

const snake = {
  length:       DEFAULT_LENGTH,
  newDirection: DEFAULT_DIRECTION,
  direction:    DEFAULT_DIRECTION,
  trail:        DEFAULT_TRAIL,
  speed:        DEFAULT_SPEED,
  color:        "rgb(53, 222, 0)"
};

const apple = {
  x:      DEFAULT_COORDINATE.x,
  y:      DEFAULT_COORDINATE.y,
  color:  "rgb(253, 0, 0)"
};

function isValidCoordinate(x, y) {
  return x >= 0 && x < NUM_X_CELLS &&
         y >= 0 && y < NUM_Y_CELLS;
}

function isOccupied(x, y) {
  if (!isValidCoordinate(x, y)) return true;

  for (let coordinate of snake.trail) {
    if (coordinate.x === x && coordinate.y === y) {
      return true;
    }
  }

  return false;
}

function getRandomCoordinate(){
  const x = Math.floor(Math.random() * NUM_X_CELLS);
  const y = Math.floor(Math.random() * NUM_Y_CELLS);

  return [x, y];
}

function initSnake() {
  const SNAKE_DEFAULT_X = 10;
  const SNAKE_DEFAULT_Y = 10;

  snake.trail = [{
    x: SNAKE_DEFAULT_X,
    y: SNAKE_DEFAULT_Y
  }];
}

function setApple() {
  let [x, y] = [DEFAULT_COORDINATE.x, DEFAULT_COORDINATE.y];

  while (isOccupied(x, y)) {
    [x, y] = getRandomCoordinate();
  }

  apple.x = x;
  apple.y = y;
}

function renderCounter() {
  const counter = document.getElementById("length-counter");
  counter.innerHTML = "Length: " + snake.length;
}

function renderGame() {
  renderCounter();

  // Draw board
  context.fillStyle = "black";
  context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  // Draw snake
  context.fillStyle = snake.color;
  for (let { x, y } of snake.trail) {
    context.fillRect(
      x * CELL_DIMENSION,
      y * CELL_DIMENSION,
      CELL_DIMENSION - CELL_PADDING,
      CELL_DIMENSION - CELL_PADDING
    );
  }

  // Draw apple
  context.fillStyle = apple.color;
  context.fillRect(
    apple.x * CELL_DIMENSION,
    apple.y * CELL_DIMENSION,
    CELL_DIMENSION - CELL_PADDING,
    CELL_DIMENSION - CELL_PADDING,
  );
}

function resetGame() {
  snake.length = DEFAULT_LENGTH;
  snake.direction = DIRECTIONS[
    Math.floor(Math.random() * DIRECTIONS.length)
  ];

  snake.newDirection = snake.direction;

  initSnake();
  setApple();
}

function getSnakeHead() {
  return snake.trail[0];
}

function moveSnake() {
  const { x, y } = getSnakeHead();

  const neighbours = {
    "LEFT":   [x - 1, y],
    "UP":     [x, y - 1],
    "RIGHT":  [x + 1, y],
    "DOWN":   [x, y + 1]
  };

  const newCoordinate = neighbours[snake.newDirection];

  if (!isValidCoordinate(...newCoordinate) ||
      isOccupied(...newCoordinate)) {
    alert("Game over! The snake's length is: "
          + snake.length);

    resetGame();
    return;
  }

  snake.direction = snake.newDirection;

  snake.trail.unshift({
    x: newCoordinate[0],
    y: newCoordinate[1]
  });
}

function resizeSnake() {
  while (snake.trail.length > snake.length) {
    snake.trail.pop();
  }
}

function play() {
  moveSnake();

  const { x, y } = getSnakeHead();
  if (x === apple.x && y === apple.y) {
    ++snake.length;
    setApple();
  }

  resizeSnake();
  renderGame();
}

function setDirection(event) {
  const CODE_TO_DIRECTION = {
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN"
  };

  const OPPOSITE_DIRECTION = {
    LEFT:   "RIGHT",
    UP:     "DOWN",
    RIGHT:  "LEFT",
    DOWN:   "UP"
  };

  const newDirection = CODE_TO_DIRECTION[event.keyCode];
  if (newDirection === undefined) return;

  if (newDirection === OPPOSITE_DIRECTION[snake.direction]) return;
  snake.newDirection = newDirection;
}

window.onload = () => {
  let board = document.getElementById("game");
  context = board.getContext("2d");
  
  resetGame();
  renderGame();

  document.addEventListener("keydown", setDirection);

  const refreshRate = 75;
  setInterval(play, refreshRate);
};
