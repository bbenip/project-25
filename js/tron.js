let context;

const DEFAULT_TRAIL = [];

const DEFAULT_DIRECTION_P1 = 'RIGHT';
const DEFAULT_COLOR_P1 = 'rgb(255, 100, 255)';
const DEFAULT_X_P1 = 125;
const DEFAULT_Y_P1 = 200;

const DEFAULT_DIRECTION_P2 = 'LEFT';
const DEFAULT_COLOR_P2 = 'rgb(50, 200, 150)';
const DEFAULT_X_P2 = 375;
const DEFAULT_Y_P2 = 200;

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

function resetGame() {
  player1.x = DEFAULT_X_P1;
  player1.y = DEFAULT_Y_P1;

  player2.x = DEFAULT_X_P2;
  player2.y = DEFAULT_Y_P2;

  // TODO: Reset board
  // TODO: Render background
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
