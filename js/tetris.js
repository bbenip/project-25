let contextPlayfield = null;
let contextNextQueue = null;

const MATRIX_WIDTH = 1000;
const MATRIX_HEIGHT = 2000;
const MATRIX_BUFFER_TOP = 200;
const MATRIX_NUM_CELLS_X = 10;
const MATRIX_NUM_CELLS_Y = 22;
const MATRIX_BACKGROUND_COLOR = 'white';
const MATRIX_GRID_COLOR = 'rgb(192, 192, 192)'

const NEXT_QUEUE_WIDTH = 500;
const NEXT_QUEUE_HEIGHT = 2200;
const NEXT_QUEUE_LENGTH = 5;

const MINO_PADDING = 5;
const MINO_DIMENSION = 100;
const MINO_STROKE_COLOR = 'black';

const MINO = {
  empty: 0,
  t: 1,
  z: 2,
  s: 3,
  j: 4,
  l: 5,
  i: 6,
  o: 7,
};

const MINO_COLORS = {
  [MINO.empty]: 'white',
  [MINO.t]: 'rgb(175, 40, 140)',
  [MINO.z]: 'rgb(215, 15, 55)',
  [MINO.s]: 'rgb(90, 175, 0)',
  [MINO.j]: 'rgb(35, 65, 200)',
  [MINO.l]: 'rgb(225, 90, 0)',
  [MINO.i]: 'rgb(15, 155, 215)',
  [MINO.o]: 'rgb(225, 160, 0)',
};

const TETRIMINO_KEYS = ['t', 'z', 's', 'j', 'l', 'i', 'o'];
const TETRIMINO_MINO_POSITIONS = {
  t: [
    { x: 4, y: 0 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
  ],
  z: [
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
  ],
  s: [
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
  ],
  j: [
    { x: 3, y: 0 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
  ],
  l: [
    { x: 5, y: 0 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
  ],
  i: [
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
  ],
  o: [
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
  ],
};

const DIRECTION_TO_OFFSET = {
  left:   { x: -1,  y: 0 },
  right:  { x: 1,   y: 0 },
  down:   { x: 0,   y: 1 },
};


let tetriminoQueue = [];
let tetriminoActive = null;
let matrix = [];

function resetGame() {
  matrix = Array(MATRIX_NUM_CELLS_Y)
    .fill(MINO.empty)
    .map(() => Array(MATRIX_NUM_CELLS_X).fill(MINO.empty));
}

function drawMinoStroke(x, y, context) {
  context.fillStyle = MINO_STROKE_COLOR;
  context.lineWidth = 2 * MINO_PADDING;
  context.strokeRect(
    x * MINO_DIMENSION,
    y * MINO_DIMENSION,
    MINO_DIMENSION,
    MINO_DIMENSION,
  );
}

function drawMino(mino, x, y, context) {
  if (mino !== MINO.empty) {
    drawMinoStroke(x, y, context);
  }

  context.fillStyle = MINO_COLORS[mino];
  context.fillRect(
    x * MINO_DIMENSION + MINO_PADDING,
    y * MINO_DIMENSION + MINO_PADDING,
    MINO_DIMENSION - 2 * MINO_PADDING,
    MINO_DIMENSION - 2 * MINO_PADDING,
  );
}

function renderPlayfield() {
  // Clear drawing above skyline
  contextPlayfield.fillStyle = MATRIX_BACKGROUND_COLOR;
  contextPlayfield.fillRect(0, 0, MATRIX_WIDTH, MATRIX_BUFFER_TOP);

  // Draw grid color behind matrix
  contextPlayfield.fillStyle = MATRIX_GRID_COLOR;
  contextPlayfield.fillRect(0, MATRIX_BUFFER_TOP, MATRIX_WIDTH, MATRIX_HEIGHT);

  for (let i = 0; i < MATRIX_NUM_CELLS_Y; ++i) {
    for (let j = 0; j < MATRIX_NUM_CELLS_X; ++j) {
      drawMino(matrix[i][j], j, i, contextPlayfield);
    }
  }
}

function renderNextQueue() {
  contextNextQueue.fillStyle = MATRIX_BACKGROUND_COLOR;
  contextNextQueue.fillRect(0, 0, NEXT_QUEUE_WIDTH, NEXT_QUEUE_HEIGHT);

  if (tetriminoQueue.length === 0) {
    return;
  }

  for (let i = 0; i < NEXT_QUEUE_LENGTH; ++i) {
    const tetriminoKey = tetriminoQueue[i];
    const mino = MINO[tetriminoKey];
    const minoPositions = TETRIMINO_MINO_POSITIONS[tetriminoKey];

    const xOffset = -2;
    const yOffset = 3;
    const queueBlockHeight = 4;

    for (const { x, y } of minoPositions) {
      drawMino(
        mino,
        x + xOffset,
        y + yOffset + (queueBlockHeight * i),
        contextNextQueue
      );
    }
  }
}

function renderGame() {
  renderPlayfield();
  renderNextQueue();
}

function shuffle(array) {
  const arrayShuffled = array.slice();

  for (let i = 0; i < arrayShuffled.length - 1; ++i) {
    const randomIndex = i + Math.floor(
      Math.random() * (arrayShuffled.length - i)
    );

    const tmp = arrayShuffled[i];
    arrayShuffled[i] = arrayShuffled[randomIndex];
    arrayShuffled[randomIndex] = tmp;
  }

  return arrayShuffled;
}

function getTetrimino() {
  if (tetriminoQueue.length < TETRIMINO_KEYS.length) {
    tetriminoQueue.push(...shuffle(TETRIMINO_KEYS));
  }

  const tetriminoKey = tetriminoQueue.shift();
  const tetrimino = {
    minoPositions: TETRIMINO_MINO_POSITIONS[tetriminoKey]
      .map(minoPosition => ({ ...minoPosition })),
    value: MINO[tetriminoKey],
  };

  return tetrimino;
}

function isOutOfBounds(x, y) {
  return (
    (x < 0 || x >= MATRIX_NUM_CELLS_X)
    || (y < 0 || y >= MATRIX_NUM_CELLS_Y)
  );
}

function isIntersectTetrimino(x, y, tetrimino) {
  return tetrimino.minoPositions.some(
    ({ x: x1, y: y1 }) => x === x1 && y === y1
  );
}

function isIntersectLockedMino(x, y, tetrimino) {
  if (matrix[y][x] !== MINO.empty) {
    return !isIntersectTetrimino(x, y, tetrimino);
  }

  return false;
}

function isLocked(tetrimino, direction) {
  if (tetrimino === null) {
    return true;
  }

  const offset = DIRECTION_TO_OFFSET[direction];

  for (const minoPosition of tetrimino.minoPositions) {
    const x = minoPosition.x + offset.x;
    const y = minoPosition.y + offset.y;

    if (isOutOfBounds(x, y) || isIntersectLockedMino(x, y, tetrimino)) {
      return true;
    }
  }

  return false;
}

function clearLines(tetrimino) {
  if (tetrimino === null) {
    return;
  }

  let yMin = MATRIX_NUM_CELLS_Y;
  let yMax = -1;
  for (const { y } of tetrimino.minoPositions) {
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);
  }

  for (let i = yMin; i <= yMax; ++i) {
    const isLineFull = matrix[i].every(mino => mino !== MINO.empty);

    if (isLineFull) {
      matrix.splice(i, 1);
      matrix.unshift(Array(MATRIX_WIDTH).fill(MINO.empty));
    }
  }
}

function addTetriminoToMatrix(tetrimino) {
  for (const { x, y } of tetrimino.minoPositions) {
    matrix[y][x] = tetrimino.value;
  }
}

function moveTetrimino(tetrimino, direction) {
  const offset = DIRECTION_TO_OFFSET[direction];

  for (const minoPosition of tetrimino.minoPositions) {
    minoPosition.x += offset.x;
    minoPosition.y += offset.y;
    matrix[minoPosition.y][minoPosition.x] = tetrimino.value;
  }

  for (const minoPosition of tetrimino.minoPositions) {
    const x = minoPosition.x - offset.x;
    const y = minoPosition.y - offset.y;

    if (!isIntersectTetrimino(x, y, tetrimino)) {
      matrix[y][x] = MINO.empty;
    }
  }
}

function play() {
  if (isLocked(tetriminoActive, 'down')) {
    clearLines(tetriminoActive);
    tetriminoActive = getTetrimino();
    addTetriminoToMatrix(tetriminoActive);
  } else {
    moveTetrimino(tetriminoActive, 'down');
  }

  renderGame();
}

function getUserInput({ keyCode: code }) {
  const movementCodes = [37, 39];
  const codeToDirection = {
    37: 'left',
    39: 'right',
  };

  if (movementCodes.includes(code)) {
    const direction = codeToDirection[code];

    if (!isLocked(tetriminoActive, direction)) {
      moveTetrimino(tetriminoActive, direction);
    }
  }
}

window.onload = () => {
  contextPlayfield = document.querySelector('#playfield').getContext('2d');
  contextNextQueue = document.querySelector('#next-queue').getContext('2d');

  resetGame();
  renderGame();

  document.addEventListener('keydown', getUserInput);

  const refreshRate = 500;
  setInterval(play, refreshRate);
};
