let context;

const GAME_HEIGHT = 2000;
const GAME_WIDTH = 1800;

const GRAVITY = 1.5;

const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 60;

const PLAYER_INIT_X = 600;
const PLAYER_INIT_Y = 500;
const PLAYER_INIT_Y_VELOCITY = 0;
const PLAYER_INIT_OBSTACLE_ID = 0;

const OBSTACLE_WIDTH = 360;
const GROUND_HEIGHT = 100;

const player = {
  x: PLAYER_INIT_X,
  y: PLAYER_INIT_Y,

  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,

  yVelocity: PLAYER_INIT_Y_VELOCITY,

  obstacleID: 0,
};

const ground = {
  x: 0,
  y: GAME_HEIGHT - GROUND_HEIGHT,

  width: GAME_WIDTH,
  height: GROUND_HEIGHT,
};

let obstacleID = 0;
let obstacles = [];
let score = 0;

function jump(e) {
  const jumpVelocity = -30;

  const jumpCodes = {
    arrow_up: 38,
    space: 32,
    w: 87,
  };

  if (e.type === 'click' || Object.values(jumpCodes).includes(e.keyCode)) {
    player.yVelocity = jumpVelocity;
  }
}

function resetGame() {
  player.y = PLAYER_INIT_Y;
  player.yVelocity = PLAYER_INIT_Y_VELOCITY;
  player.obstacleID = PLAYER_INIT_OBSTACLE_ID;

  obstacleID = 0;
  obstacles = [];
  score = 0;
}

function renderScore() {
  const counter = document.getElementById('score-counter');
  counter.innerHTML = 'Score: ' + score;
}

function renderGame() {
  renderScore();

  // Draw background
  context.fillStyle = '#70c4ce';
  context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw player
  context.fillStyle = 'yellow';
  context.fillRect(player.x, player.y, player.width, player.height);

  // Draw ground
  context.fillStyle = 'grey';
  context.fillRect(ground.x, ground.y, ground.width, ground.height);

  // Draw obstacles
  context.fillStyle = 'green';

  for (const obstacle of obstacles) {
    context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}

function generateObstacles() {
  const newObstacleThreshold = GAME_WIDTH / 3;

  // Remove unnecessary obstacles
  if (obstacles.length > 0 && obstacles[0].x + OBSTACLE_WIDTH <= 0) {
    obstacles.shift();
  }

  if (
    obstacles.length === 0
    || obstacles.slice(-1)[0].x + OBSTACLE_WIDTH <= newObstacleThreshold
  ) {

    const gapHeight = GAME_HEIGHT * 0.2;
    const gapY = Math.random() * GAME_HEIGHT * 0.55 + GAME_HEIGHT * 0.1;

    const topObstacle = {
      id: obstacleID,

      x: GAME_WIDTH,
      y: 0,

      width: OBSTACLE_WIDTH,
      height: gapY,

      xVelocity: -20,
    };

    const bottomObstacle = {
      id: obstacleID,

      x: GAME_WIDTH,
      y: gapY + gapHeight,

      width: OBSTACLE_WIDTH,
      height: GAME_HEIGHT - gapY - gapHeight - GROUND_HEIGHT,

      xVelocity: -20,
    };

    ++obstacleID;

    obstacles.push(topObstacle);
    obstacles.push(bottomObstacle);
  }
}

function updateScore() {
  for (const obstacle of obstacles) {
    if (obstacle.id !== player.obstacleID) {
      continue;
    }

    if (obstacle.x + OBSTACLE_WIDTH <= player.x) {
      ++player.obstacleID;
      ++score;

      break;
    }
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

  updateScore();
  renderGame();

  if (isCollision()) {
    alert('Game over! Your score is: ' + score);
    resetGame();
    renderGame();
  }
}

window.onload = () => {
  let game = document.getElementById('game');
  context = game.getContext('2d');

  game.addEventListener('click', jump);
  document.addEventListener('keydown', jump);

  resetGame();
  renderGame();

  const refreshRate = 20;
  setInterval(play, refreshRate);
};
