const player1 = {
  position: 0,
  speed: 0,
  score: 0,
  collision: false
}

const player2 = {
  position: 0,
  speed: 0,
  score: 0,
  collision: false
}

const ball = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0
}

let board;
let context;

const SCORE_LIMIT = 11;

const H_PADDING = 5;
const V_PADDING = 3;

const DIVIDER_WIDTH = 5;
const DIVIDER_HEIGHT = 5;
const DIVIDER_PADDING = 10;

const PADDLE_WIDTH = 5;
const PADDLE_HEIGHT = 25;

const BALL_WIDTH = 7;
const BALL_HEIGHT = 7;
const BALL_MIN_X_SPEED = 3;
const BALL_MAX_X_SPEED = 7;
const BALL_INIT_SPEED = 5;


function resetBall() {
  ball.x = (board.width - BALL_WIDTH) / 2;
  ball.y = (board.height - BALL_HEIGHT) / 2;

  ball.vx = BALL_MIN_X_SPEED;
  ball.vx += Math.floor(Math.random() * (BALL_INIT_SPEED - ball.vx)) + 1;
  ball.vy = Math.sqrt(BALL_INIT_SPEED ** 2 - ball.vx ** 2);

  ball.vx *= (Math.random() * 2 > 1) ? 1 : -1;
  ball.vy *= (Math.random() * 2 > 1) ? 1 : -1;
}

function move(event) {
  const [P1_UP, P1_DOWN, P2_UP, P2_DOWN] = [87, 83, 38, 40];
  const DEFAULT_SPEED = 5;

  switch (event.keyCode) {
    case P1_UP:
      player1.speed = -DEFAULT_SPEED;
      break;
    case P1_DOWN:
      player1.speed = DEFAULT_SPEED;
      break;
    case P2_UP:
      player2.speed = -DEFAULT_SPEED;
      break;
    case P2_DOWN:
      player2.speed = DEFAULT_SPEED;
      break;
    default:
      break;
  }
}

function simulateCollision() {
  const CORNER_LENGTH = 5;
  const MIDDLE_LENGTH = 7;
  const [BOOST_X, SLOW_X]  = [1.5, 0.75];
  const [BOOST_Y, SLOW_Y] = [Math.floor(Math.random() * 5), 0.25];

  if (player1.collision) {
    if (ball.x <= player1.position + CORNER_LENGTH ||
        ball.x >= player1.position + PADDLE_HEIGHT - CORNER_LENGTH) {
      ball.vx *= -BOOST_X;
      if (Math.abs(ball.vy) < BOOST_Y) {
        ball.vy = (ball.vy > 0) ? BOOST_Y : -BOOST_Y;
      }
    } else if (ball.x >= player1.position + PADDLE_HEIGHT / 2 - MIDDLE_LENGTH &&
               ball.x <= player1.position + PADDE_HEIGHT / 2 + MIDDLE_LENGTH) {
      ball.vx *= -SLOW_X;
      ball.vy *= SLOW_Y;
    } else {
      ball.vx = -ball.vx;
    }
  } else {
    if (ball.x <= player2.position + CORNER_LENGTH ||
        ball.x >= player2.position + PADDLE_HEIGHT - CORNER_LENGTH) {
      ball.vx *= -BOOST_X;
      if (Math.abs(ball.vy) < BOOST_Y) {
        ball.vy = (ball.vy > 0) ? BOOST_Y : -BOOST_Y;
      }
    } else if (ball.x >= player2.position + PADDLE_HEIGHT / 2 - MIDDLE_LENGTH &&
               ball.x <= player2.position + PADDE_HEIGHT / 2 + MIDDLE_LENGTH) {
      ball.vx *= -SLOW_X;
      ball.vy *= SLOW_Y;
    } else {
      ball.vx = -ball.vx;
    }
  }

  let direction = 0;
  if (ball.vx > 0) direction = 1;
  if (ball.vx < 0) direction = -1;

  ball.vx = Math.abs(ball.vx);
  ball.vx = Math.max(BALL_MIN_X_SPEED, ball.vx);
  ball.vx = Math.min(BALL_MAX_X_SPEED, ball.vx);
  ball.vx *= direction;

  player1.collision = false;
  player2.collision = false;
}

function ballHitBounds() {
  return (ball.y <= 0) || (ball.y + BALL_HEIGHT >= board.height);
}

function ballHitPaddle() {
  player1.collision = ball.x <= H_PADDING + PADDLE_WIDTH &&
       ball.y >= player1.position - BALL_HEIGHT &&
       ball.y <= player1.position + PADDLE_HEIGHT;
  player2.collision = ball.x >= board.width - H_PADDING - PADDLE_WIDTH &&
       ball.y >= player2.position - BALL_HEIGHT &&
       ball.y <= player2.position + PADDLE_HEIGHT;

  return player1.collision || player2.collision;
}

function ballPassedPaddles() {
  return ball.x <= H_PADDING + PADDLE_WIDTH ||
         ball.x >= board.width - H_PADDING - PADDLE_WIDTH;
}

function updateScore() {
  if (ball.x < board.width / 2) ++player2.score;
  if (ball.x > board.width / 2) ++player1.score;
}

function game() {
  // Draw board
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.width);

  // Draw dividing line
  let currentHeight = DIVIDER_PADDING / 2;
  while (currentHeight < board.height) {
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(
      (board.width - DIVIDER_WIDTH) / 2,
      currentHeight,
      DIVIDER_WIDTH,
      DIVIDER_HEIGHT
    );

    currentHeight += DIVIDER_HEIGHT + DIVIDER_PADDING;
  }

  // Calculate player positions
  player1.position += player1.speed;
  player2.position += player2.speed;

  player1.position = Math.max(V_PADDING, player1.position);
  player1.position = Math.min(board.height - V_PADDING - PADDLE_HEIGHT, player1.position);

  player2.position = Math.max(V_PADDING, player2.position);
  player2.position = Math.min(board.height - V_PADDING - PADDLE_HEIGHT, player2.position);

  // Decelerate paddles
  let d1 = 0;
  if (player1.speed > 0) d1 = 1;
  if (player1.speed < 0) d1 = -1;

  let d2 = 0;
  if (player2.speed > 0) d2 = 1;
  if (player2.speed < 0) d2 = -1;

  player1.speed -= d1;
  player2.speed -= d2;

  // Draw player 1
  context.fillStyle = "white";
  context.fillRect(
    H_PADDING,
    player1.position,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );

  // Draw player 2
  context.fillStyle = "white";
  context.fillRect(
    board.width - H_PADDING - PADDLE_WIDTH,
    player2.position,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );

  // Calculate ball position
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Draw ball
  context.fillStyle = "white";
  context.fillRect(ball.x, ball.y, BALL_WIDTH, BALL_HEIGHT);

  if (ballHitPaddle()) {
    simulateCollision();
  } else if (ballHitBounds()) {
    ball.vy = -ball.vy;
  } else if (ballPassedPaddles()) {
    updateScore();
    resetBall();
  }

  // Draw score
  const SCORE_V_PADDING = 30;
  context.font = "2em Roboto";
  context.fillText(player1.score, board.width / 4, SCORE_V_PADDING);
  context.fillText(player2.score, 3 * (board.width / 4), SCORE_V_PADDING);

  if (player1.score === SCORE_LIMIT) {
    alert("Player 1 wins!");
    player1.score = 0;
    player2.score = 0;
  } else if (player2.score === SCORE_LIMIT) {
    alert("Player 2 wins!");
    player1.score = 0;
    player2.score = 0;
  }
}

window.onload = () => {
  board = document.getElementById("board");
  context = board.getContext("2d");

  resetBall();

  const refreshRate = 50;
  document.addEventListener("keydown", move);
  setInterval(game, refreshRate);
}
