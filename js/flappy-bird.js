let context;

const GAME_HEIGHT = 2000;
const GAME_WIDTH = 1000;

const GRAVITY = 1.5;

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;

const PLAYER_INIT_X = 250;
const PLAYER_INIT_Y = 500;
const PLAYER_INIT_Y_VELOCITY = 0;

const GROUND_HEIGHT = 100;

const player = {
  x: PLAYER_INIT_X,
  y: PLAYER_INIT_Y,

  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,

  yVelocity: PLAYER_INIT_Y_VELOCITY,
};

const ground = {
  x: 0,
  y: GAME_HEIGHT - GROUND_HEIGHT,

  width: GAME_WIDTH,
  height: GROUND_HEIGHT,
};


function resetGame() {
  player.y = PLAYER_INIT_Y;
  player.yVelocity = PLAYER_INIT_Y_VELOCITY;
}

function renderGame() {
  // Draw board
  context.fillStyle = 'black';
  context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw player
  context.fillStyle = 'red';
  context.fillRect(player.x, player.y, player.width, player.height);

  // Draw ground
  context.fillStyle = 'grey';
  context.fillRect(ground.x, ground.y, ground.width, ground.height);
}

function playerHitGround() {
  return player.y + player.height >= ground.y;
}

function play() {
  player.yVelocity += GRAVITY;
  player.y = Math.max(
    Math.min(player.y + player.yVelocity, ground.y - player.height / 2),
    0
  );

  if (player.y === 0) {
    player.yVelocity = 0;
  }

  renderGame();

  if (playerHitGround()) {
    alert('Game over!');
    resetGame();
    renderGame();
  }

}

function jump(e) {
  const jumpVelocity = -30;

  const jumpCodes = {
    arrow_up: 38,
    space: 32,
    w: 87,
  };

  if (Object.values(jumpCodes).includes(e.keyCode)) {
    player.yVelocity = jumpVelocity;
  }
}

window.onload = () => {
  let game = document.getElementById('game');
  context = game.getContext('2d');

  document.addEventListener('keydown', jump);

  resetGame();
  renderGame();

  const refreshRate = 20;
  setInterval(play, refreshRate);
};
