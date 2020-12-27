let context;

const BOARD_WIDTH = 2500;
const BOARD_HEIGHT = 1750;

const NUM_X_CELLS = 100;
const NUM_Y_CELLS = 70;

const CELL_DIMENSION = BOARD_HEIGHT / NUM_Y_CELLS;

const DEFAULT_COLOR_EMPTY = 'rgb(255, 255, 255)';

const DEFAULT_COLOR_P1 =        'rgb(50, 200, 150)';
const DEFAULT_COLOR_BOOST_P1 =  'rgb(45, 155, 120)';
const DEFAULT_DIRECTION_P1 =    'RIGHT';
const DEFAULT_ID_P1 =           1;
const DEFAULT_X_P1 =            NUM_X_CELLS / 4;
const DEFAULT_Y_P1 =            NUM_Y_CELLS / 2;

const DEFAULT_COLOR_P2 =        'rgb(255, 100, 255)';
const DEFAULT_COLOR_BOOST_P2 =  'rgb(190, 85, 190)';
const DEFAULT_DIRECTION_P2 =    'LEFT';
const DEFAULT_ID_P2 =           2;
const DEFAULT_X_P2 =            (NUM_X_CELLS / 4) * 3;
const DEFAULT_Y_P2 =            NUM_Y_CELLS / 2;

const DEFAULT_BOOST_COUNT = 3;
const DEFAULT_BOOST_STATE = false;
const BOOST_FACTOR =        10;
const BOOST_RATE =          15;

const PIECE_EMPTY = 0;

const DIRECTION = {
  'LEFT':   { x: -1,  y: 0 },
  'RIGHT':  { x: 1,   y: 0 },
  'UP':     { x: 0,   y: -1 },
  'DOWN':   { x: 0,   y: 1 },
};

const player1 = {
  boostCount: DEFAULT_BOOST_COUNT,
  color:      DEFAULT_COLOR_P1,
  colorBoost: DEFAULT_COLOR_BOOST_P1,
  direction:  DEFAULT_DIRECTION_P1,
  isBoost:    DEFAULT_BOOST_STATE,
  id:         DEFAULT_ID_P1,
  x:          DEFAULT_X_P1,
  y:          DEFAULT_Y_P1,
}

const player2 = {
  boostCount: DEFAULT_BOOST_COUNT,
  color:      DEFAULT_COLOR_P2,
  colorBoost: DEFAULT_COLOR_BOOST_P2,
  direction:  DEFAULT_DIRECTION_P2,
  isBoost:    DEFAULT_BOOST_STATE,
  id:         DEFAULT_ID_P2,
  x:          DEFAULT_X_P2,
  y:          DEFAULT_Y_P2,
}

let board = [];

function resetGame() {
  player1.boostCount = DEFAULT_BOOST_COUNT;
  player1.direction = DEFAULT_DIRECTION_P1;
  player1.isBoost = DEFAULT_BOOST_STATE;
  player1.x = DEFAULT_X_P1;
  player1.y = DEFAULT_Y_P1;

  player2.boostCount = DEFAULT_BOOST_COUNT;
  player2.direction = DEFAULT_DIRECTION_P2;
  player2.isBoost = DEFAULT_BOOST_STATE;
  player2.x = DEFAULT_X_P2;
  player2.y = DEFAULT_Y_P2;

  board = Array(NUM_Y_CELLS).fill().map(() => Array(NUM_X_CELLS).fill(PIECE_EMPTY));
  board[player1.y][player1.x] = player1.id;
  board[player2.y][player2.x] = player2.id;

  // Draw board
  context.fillStyle = 'black';
  context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  updateBoostCountDisplay(player1);
  updateBoostCountDisplay(player2);
}

function drawPlayer(player) {
  context.fillStyle = player.isBoost ? player.colorBoost : player.color;
  context.fillRect(
    player.x * CELL_DIMENSION,
    player.y * CELL_DIMENSION,
    CELL_DIMENSION,
    CELL_DIMENSION
  );
}

function isOutOfBounds(x, y) {
  return (
    (x < 0 || x >= NUM_X_CELLS)
    || (y < 0 || y >= NUM_Y_CELLS)
  );
}

function isTie() {
  const isCollisionWall = (
    isOutOfBounds(player1.x, player1. y)
    && isOutOfBounds(player2.x, player2.y)
  );

  const isCollisionPlayer = (
    player1.x === player2.x
    && player1.y === player2.y
  );

  return isCollisionWall || isCollisionPlayer;
}

function isCollision(x, y) {
  const isCollisionWall = isOutOfBounds(x, y);

  return isCollisionWall || board[y][x] !== PIECE_EMPTY;
}

function getOpposingPlayerId(id) {
  return id % 2 + 1;
}

function movePlayer(player) {
  const direction = DIRECTION[player.direction];
  player.x += direction.x;
  player.y += direction.y;

  if (isTie()) {
    alert('Both players have tied!');
    resetGame();
  } else if (isCollision(player.x, player.y)) {
    alert(`Player ${getOpposingPlayerId(player.id)} has won!`);
    resetGame();
  } else {
    board[player.y][player.x] = player.id;
    drawPlayer(player);
  }
}

function updateBoostCountDisplay(player) {
  const boostClassName = `boost-player-${player.id}`;
  const boostTds = [...document.getElementsByClassName(boostClassName)];

  const boostCount = player.boostCount;
  const boostColor = player.id === 1 ? DEFAULT_COLOR_P1 : DEFAULT_COLOR_P2;

  for (let i = 0; i < DEFAULT_BOOST_COUNT; ++i) {
    if (boostCount > i) {
      boostTds[i].style.backgroundColor = boostColor;
    } else {
      boostTds[i].style.backgroundColor = DEFAULT_COLOR_EMPTY;
    }
  }
}

function setBoost(player) {
  player.isBoost = true;

  for (let i = 0; i < BOOST_FACTOR; ++i) {
    setTimeout(() => { movePlayer(player) }, i * BOOST_RATE);
  }

  setTimeout(() => { player.isBoost = false; }, BOOST_FACTOR * BOOST_RATE);
  player.boostCount -= 1;

  updateBoostCountDisplay(player);
}

function updateDirection(player, direction) {
  const DIRECTION_OPPOSITE = {
    LEFT:   'RIGHT',
    UP:     'DOWN',
    RIGHT:  'LEFT',
    DOWN:   'UP',
  };

  const directionOppositePlayer = DIRECTION_OPPOSITE[player.direction];
  if (direction !== directionOppositePlayer) {
    player.direction = direction;
  }
}

function getUserInput({ keyCode: code }) {
  const CODES_P1 = [32, 65, 68, 87, 83];
  const BOOST_CODE_P1 = 32;
  const CODE_TO_DIRECTION_P1 = {
    65: 'LEFT',
    68: 'RIGHT',
    87: 'UP',
    83: 'DOWN',
  };

  const CODES_P2 = [13, 37, 39, 38, 40];
  const BOOST_CODE_P2 = 13;
  const CODE_TO_DIRECTION_P2 = {
    37: 'LEFT',
    39: 'RIGHT',
    38: 'UP',
    40: 'DOWN',
  };

  if (CODES_P1.includes(code)) {
    if (code === BOOST_CODE_P1) {
      if (player1.boostCount > 0) {
        setBoost(player1);
      }
    } else {
      const direction = CODE_TO_DIRECTION_P1[code];
      updateDirection(player1, direction);
    }
  }

  if (CODES_P2.includes(code)) {
    if (code === BOOST_CODE_P2) {
      if (player2.boostCount > 0) {
        setBoost(player2);
      }
    } else {
      const direction = CODE_TO_DIRECTION_P2[code];
      updateDirection(player2, direction);
    }
  }
}

window.onload = () => {
  let board = document.getElementById('game');
  context = board.getContext('2d');

  resetGame();
  drawPlayer(player1);
  drawPlayer(player2);

  document.addEventListener('keydown', getUserInput);
  const refreshRate = 75;

  setInterval(() => { movePlayer(player1) }, refreshRate);
  setInterval(() => { movePlayer(player2) }, refreshRate);
};
