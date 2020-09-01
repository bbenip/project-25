let context;

const GAME_HEIGHT = 2000;
const GAME_WIDTH = 1000;

const GRAVITY = 2;

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
  player.y = Math.min(
    player.y + player.yVelocity, ground.y - player.height / 2
  );

  renderGame();

  if (playerHitGround()) {
    alert('Game over!');
    resetGame();
  }

}

window.onload = () => {
  let game = document.getElementById('game');
  context = game.getContext('2d');

  resetGame();
  renderGame();

  const refreshRate = 20;
  setInterval(play, refreshRate);
};
