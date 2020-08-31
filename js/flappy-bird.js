let context;

const GAME_HEIGHT = 2000;
const GAME_WIDTH = 1000;

const GRAVITY = 4;

const PLAYER_X_LENGTH = 50;
const PLAYER_Y_LENGTH = 50;

const PLAYER_INIT_X = 250;
const PLAYER_INIT_Y = 500;
const PLAYER_INIT_Y_VELOCITY = 0;

const player = {
  x: PLAYER_INIT_X,
  y: PLAYER_INIT_Y,

  yVelocity: PLAYER_INIT_Y_VELOCITY,
}

function resetGame() {
  player.y = PLAYER_INIT_Y;
  player.yVelocity = PLAYER_INIT_Y_VELOCITY;
}

function renderGame() {
  // Draw board
  context.fillStyle = 'black';
  context.fillRect(
    0,
    0,
    GAME_WIDTH,
    GAME_HEIGHT
  );

  // Draw player
  context.fillStyle = 'red';
  context.fillRect(
    player.x,
    player.y,
    PLAYER_X_LENGTH,
    PLAYER_Y_LENGTH,
  );
}

function play() {
  player.yVelocity += GRAVITY;
  player.y += player.yVelocity;

  renderGame();
}

window.onload = () => {
  let game = document.getElementById('game');
  context = game.getContext('2d');

  resetGame();
  renderGame();

  const refreshRate = 40;
  setInterval(play, refreshRate);
};
