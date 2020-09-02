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

let obstacles = [];

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

function resetGame() {
  player.y = PLAYER_INIT_Y;
  player.yVelocity = PLAYER_INIT_Y_VELOCITY;

  obstacles = [];
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

  // Draw obstacles
  context.fillStyle = 'green';

  for (let i = 0; i < obstacles.length; ++i) {
    const obstacle = obstacles[i];
    context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}

function generateObstacles() {
  const obstacleWidth = 200;
  const newObstacleThreshold = GAME_WIDTH / 3;

  // Remove unnecessary obstacles
  if (obstacles.length > 0 && obstacles[0].x + obstacleWidth <= 0) {
    obstacles.shift();
  }

  if (
    obstacles.length === 0
    || obstacles.slice(-1)[0].x + obstacleWidth <= newObstacleThreshold
  ) {

    const gapHeight = GAME_HEIGHT * 0.2;
    const gapY = Math.random() * GAME_HEIGHT * 0.55 + GAME_HEIGHT * 0.1;

    const topObstacle = {
      x: GAME_WIDTH,
      y: 0,

      width: obstacleWidth,
      height: gapY,

      xVelocity: -10,
    };

    const bottomObstacle = {
      x: GAME_WIDTH,
      y: gapY + gapHeight,

      width: obstacleWidth,
      height: GAME_HEIGHT - gapY - gapHeight - GROUND_HEIGHT,

      xVelocity: -10,
    };

    obstacles.push(topObstacle);
    obstacles.push(bottomObstacle);
  }
}

function isBetween(num, lowerLimit, upperLimit) {
  return num >= lowerLimit && num <= upperLimit;
}

function intersect(obj1, obj2) {
  const top = isBetween(obj1.y, obj2.y, obj2.y + obj2.height);
  const bottom = isBetween(obj1.y + obj1.height, obj2.y, obj2.y + obj2.height);
  const left = isBetween(obj1.x, obj2.x, obj2.x + obj2.width);
  const right = isBetween(obj1.x + obj1.height, obj2.x, obj2.x + obj2.width);

  return (top || bottom) && (left || right);
}


function isCollision() {
  let playerHitGround = player.y + player.height >= ground.y;

  // Check obstacle collision
  for (let i = 0; i < obstacles.length; ++i) {
    if (intersect(player, obstacles[i])) {
      return true;
    }
  }

  return playerHitGround;
}

function play() {
  // Move player
  player.yVelocity += GRAVITY;
  player.y = Math.max(
    Math.min(player.y + player.yVelocity, ground.y - player.height / 2),
    0
  );

  if (player.y === 0) {
    player.yVelocity = 0;
  }

  generateObstacles();

  // Move obstacles
  for (let i = 0; i < obstacles.length; ++i) {
    obstacles[i].x += obstacles[i].xVelocity;
  }

  renderGame();

  if (isCollision()) {
    alert('Game over!');
    resetGame();
    renderGame();
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
