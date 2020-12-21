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

const PIECE_P1 = 1;
const PIECE_P2 = 2;

const player1 = {
  color: DEFAULT_COLOR_P1,
  direction: DEFAULT_DIRECTION_P1,
  x: DEFAULT_X_P1,
  y: DEFAULT_Y_P1,
}

const player2 = {
  color: DEFAULT_COLOR_P2,
  direction: DEFAULT_DIRECTION_P1,
  x: DEFAULT_X_P2,
  y: DEFAULT_Y_P2,
}

let board = [];

function resetGame() {
  player1.x = DEFAULT_X_P1;
  player1.y = DEFAULT_Y_P1;

  player2.x = DEFAULT_X_P2;
  player2.y = DEFAULT_Y_P2;

  board = Array(NUM_Y_CELLS).fill().map(() => Array(NUM_X_CELLS).fill(0));
  board[player1.y][player1.x] = PIECE_P1;
  board[player2.y][player2.x] = PIECE_P2;

  // Draw board
  context.fillStyle = 'black';
  context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
  
  // Draw players
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

function renderGame() {
  // TODO: Render player 1

  // TODO: Render player 2

  // NOTE: Only update based on new head position
}

function play() {
  // TODO: Move player 1 and update board

  // TODO: Move player 2 and update board

  // TODO: Check if one or both players crashed
  // TODO: Implement board variable for quick collision check
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
