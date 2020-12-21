let context;

const BOARD_WIDTH = 2500;
const BOARD_HEIGHT = 1750;

const NUM_X_CELLS = 100;
const NUM_Y_CELLS = 70;

const CELL_DIMENSION = BOARD_HEIGHT / NUM_Y_CELLS;

const DEFAULT_DIRECTION_P1 = 'RIGHT';
const DEFAULT_COLOR_P1 = 'rgb(255, 100, 255)';
const DEFAULT_X_P1 = NUM_X_CELLS / 4;
const DEFAULT_Y_P1 = NUM_Y_CELLS / 2;

const DEFAULT_DIRECTION_P2 = 'LEFT';
const DEFAULT_COLOR_P2 = 'rgb(50, 200, 150)';
const DEFAULT_X_P2 = (NUM_X_CELLS / 4) * 3;
const DEFAULT_Y_P2 = NUM_Y_CELLS / 2;

const PIECE_EMPTY = 0;
const PIECE_P1 = 1;
const PIECE_P2 = 2;

const DIRECTION = {
  'LEFT':   { x: -1,  y: 0 },
  'RIGHT':  { x: 1,   y: 0 },
  'UP':     { x: 0,   y: -1 },
  'DOWN':   { x: 0,   y: 1 },
};

const player1 = {
  color: DEFAULT_COLOR_P1,
  direction: DEFAULT_DIRECTION_P1,
  x: DEFAULT_X_P1,
  y: DEFAULT_Y_P1,
}

const player2 = {
  color: DEFAULT_COLOR_P2,
  direction: DEFAULT_DIRECTION_P2,
  x: DEFAULT_X_P2,
  y: DEFAULT_Y_P2,
}

let board = [];

function resetGame() {
  player1.x = DEFAULT_X_P1;
  player1.y = DEFAULT_Y_P1;

  player2.x = DEFAULT_X_P2;
  player2.y = DEFAULT_Y_P2;

  board = Array(NUM_Y_CELLS).fill().map(() => Array(NUM_X_CELLS).fill(PIECE_EMPTY));
  board[player1.y][player1.x] = PIECE_P1;
  board[player2.y][player2.x] = PIECE_P2;

  // Draw board
  context.fillStyle = 'black';
  context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
}

function renderGame() {
  context.fillStyle = player1.color;
  context.fillRect(
    player1.x * CELL_DIMENSION,
    player1.y * CELL_DIMENSION,
    CELL_DIMENSION,
    CELL_DIMENSION
  );

  context.fillStyle = player2.color;
  context.fillRect(
    player2.x * CELL_DIMENSION,
    player2.y * CELL_DIMENSION,
    CELL_DIMENSION,
    CELL_DIMENSION
  );
}

function isCollision(x, y) {
  const isPieceCollision = board[y][x] !== PIECE_EMPTY;

  const isInvalidCoordinate = (
    (x < 0 || x >= NUM_X_CELLS)
    || (y < 0 || y >= NUM_Y_CELLS)
  );

  return isPieceCollision || isInvalidCoordinate;
}

function play() {
  const directionP1 = DIRECTION[player1.direction];
  player1.x += directionP1.x;
  player1.y += directionP1.y;

  const directionP2 = DIRECTION[player2.direction];
  player2.x += directionP2.x;
  player2.y += directionP2.y;

  const isCollisionP1 = isCollision(player1.x, player1.y);
  const isCollisionP2 = isCollision(player2.x, player2.y);

  if (!isCollisionP1 && !isCollisionP2) {
    board[player1.y][player1.x] = PIECE_P1;
    board[player2.y][player2.x] = PIECE_P2;
    renderGame();
    return;
  }

  if (isCollisionP1 && isCollisionP2) {
    alert('Both players have tied.');
  } else if (isCollisionP1) {
    alert('Player 2 wins!');
  } else if (isCollisionP2) {
    alert('Player 1 wins!');
  }

  resetGame();
}

function getUserInput(event) {

  // TODO: Check for movement keys
  // TODO: Consider implementing boost keys for p1 and p2
}

window.onload = () => {
  let board = document.getElementById('game');
  context = board.getContext('2d');

  resetGame();
  renderGame();

  document.addEventListener('keydown', getUserInput);
  const refreshRate = 75;

  setInterval(play, refreshRate);
};
