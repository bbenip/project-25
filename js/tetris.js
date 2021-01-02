let context = null;

const MATRIX_WIDTH = 1000;
const MATRIX_HEIGHT = 2000;
const MATRIX_BUFFER_TOP = 200;
const MATRIX_NUM_CELLS_X = 10;
const MATRIX_NUM_CELLS_Y = 22;
const MATRIX_BACKGROUND_COLOR = 'white';
const MATRIX_GRID_COLOR = 'rgb(192, 192, 192)'

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
const TETRIMINO = {
  t: {
    minos: [
      { x: 4, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    value: MINO.t,
  },
  z: {
    minos: [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    value: MINO.z,
  },
  s: {
    minos: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ],
    value: MINO.s,
  },
  j: {
    minos: [
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    value: MINO.j,
  },
  l: {
    minos: [
      { x: 5, y: 0 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    value: MINO.l,
  },
  i: {
    minos: [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
    ],
    value: MINO.i,
  },
  o: {
    minos: [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    value: MINO.o,
  },
};

let tetriminoQueue = [];
let tetriminoActive = null;
let matrix = [];

function resetGame() {
  matrix = Array(MATRIX_HEIGHT)
    .fill(MINO.empty)
    .map(() => Array(MATRIX_WIDTH).fill(MINO.empty));
}

function renderGame() {
  // Clear drawing above skyline
  context.fillStyle = MATRIX_BACKGROUND_COLOR;
  context.fillRect(0, 0, MATRIX_WIDTH, MATRIX_BUFFER_TOP);

  // Draw grid color behind matrix
  context.fillStyle = MATRIX_GRID_COLOR;
  context.fillRect(0, MATRIX_BUFFER_TOP, MATRIX_WIDTH, MATRIX_HEIGHT);

  for (let i = 0; i < MATRIX_NUM_CELLS_Y; ++i) {
    for (let j = 0; j < MATRIX_NUM_CELLS_X; ++j) {
      const mino = matrix[i][j];

      if (mino !== MINO.empty) {
        context.fillStyle = MINO_STROKE_COLOR;
        context.lineWidth = 2 * MINO_PADDING;
        context.strokeRect(
          j * MINO_DIMENSION,
          i * MINO_DIMENSION,
          MINO_DIMENSION,
          MINO_DIMENSION,
        );
      }

      context.fillStyle = MINO_COLORS[mino];
      context.fillRect(
        j * MINO_DIMENSION + MINO_PADDING,
        i * MINO_DIMENSION + MINO_PADDING,
        MINO_DIMENSION - 2 * MINO_PADDING,
        MINO_DIMENSION - 2 * MINO_PADDING,
      );
    }
  }
}

function shuffle(array) {
  const arrayShuffled = [];
  for (let i = array.length; i > 0; --i) {
    const randomIndex = Math.floor(Math.random() * i);
    arrayShuffled.push(array[randomIndex]);

    array[randomIndex] = array[i - 1];
  }

  return arrayShuffled;
}

function getTetrimino() {
  if (tetriminoQueue.length < TETRIMINO_KEYS.length) {
    tetriminoQueue.push(...shuffle(TETRIMINO_KEYS));
  }

  return TETRIMINO[tetriminoQueue.shift()];
}

function isOutOfBounds(x, y) {
  return (
    (x < 0 || x >= MATRIX_NUM_CELLS_X)
    || (y < 0 || y >= MATRIX_NUM_CELLS_Y)
  );
}

function isIntersectTetrimino(x, y, tetrimino) {
  return tetrimino.minos.some(
    ({ x: x1, y: y1 }) => x === x1 && y === y1
  );
}

function isIntersectLockedMino(x, y, tetrimino) {
  if (matrix[y][x] !== MINO.empty) {
    return !isIntersectTetrimino(x, y, tetrimino);
  }

  return false;
}

function isLocked(tetrimino) {
  if (tetrimino === null) {
    return true;
  }

  for (const mino of tetrimino.minos) {
    const { x, y } = { x: mino.x, y: mino.y + 1 };

    if (isOutOfBounds(x, y) || isIntersectLockedMino(x, y, tetrimino)) {
      return true;
    }
  }

  return false;
}

function addTetriminoToMatrix(tetrimino) {
  for (const { x, y } of tetrimino.minos) {
    matrix[y][x] = tetrimino.value;
  }
}

function drop(tetrimino) {
  for (const mino of tetrimino.minos) {
    mino.y += 1;
    matrix[mino.y][mino.x] = tetrimino.value;
  }

  for (const mino of tetrimino.minos) {
    if (!isIntersectTetrimino(mino.x, mino.y - 1, tetrimino)) {
      matrix[mino.y - 1][mino.x] = MINO.empty;
    }
  }
}

function play() {
  if (isLocked(tetriminoActive)) {
    tetriminoActive = getTetrimino();
    addTetriminoToMatrix(tetriminoActive);
  } else {
    drop(tetriminoActive);
  }

  renderGame();
}

window.onload = () => {
  const playfield = document.querySelector('#playfield');
  context = playfield.getContext('2d');

  resetGame();
  renderGame();

  const refreshRate = 500;
  setInterval(play, refreshRate);
};
