let context = null;

const MATRIX_WIDTH = 1000;
const MATRIX_HEIGHT = 2000;
const MATRIX_NUM_CELLS_X = 10;
const MATRIX_NUM_CELLS_Y = 22;
const MATRIX_BUFFER_TOP = 2;
const MATRIX_BACKGROUND_COLOR = 'rgb(192, 192, 192)';

const MINO_PADDING = 5;
const MINO_DIMENSION = 100;

const MINO = {
  empty: {
    color: 'rgb(255, 255, 255)',
    value: 'empty',
  },
  t: {
    color: 'rgb(175, 40, 140)',
    value: 't',
  },
  z: {
    color: 'rgb(215, 15, 55)',
    value: 'z',
  },
  s: {
    color: 'rgb(90, 175, 0)',
    value: 's',
  },
  j: {
    color: 'rgb(35, 65, 200)',
    value: 'j',
  },
  l: {
    color: 'rgb(225, 90, 0)',
    value: 'l',
  },
  i: {
    color: 'rgb(15, 155, 215)',
    value: 'i',
  },
  o: {
    color: 'rgb(225, 160, 0)',
    value: 'o',
  },
};

let tetriminoActive = null;
let matrix = [];

function resetGame() {
  matrix = Array(MATRIX_HEIGHT)
    .fill(MINO.empty.value)
    .map(() => Array(MATRIX_WIDTH).fill(MINO.empty.value));
}

function renderGame() {
  context.fillStyle = MATRIX_BACKGROUND_COLOR;
  context.fillRect(0, 0, MATRIX_WIDTH, MATRIX_HEIGHT);

  for (let i = MATRIX_BUFFER_TOP; i < MATRIX_NUM_CELLS_Y; ++i) {
    for (let j = 0; j < MATRIX_NUM_CELLS_X; ++j) {
      const mino = MINO[matrix[i][j]];

      context.fillStyle = mino.color;
      context.fillRect(
        j * MINO_DIMENSION + MINO_PADDING,
        (i - MATRIX_BUFFER_TOP) * MINO_DIMENSION + MINO_PADDING,
        MINO_DIMENSION - 2 * MINO_PADDING,
        MINO_DIMENSION - 2 * MINO_PADDING,
      );
    }
  }
}

function getTetrimino() {
  return {
    type: 'i',
    minos: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
  };
}

function drop(tetrimino) {
  for (const mino of tetrimino.minos) {
    mino.y += 1;

    matrix[mino.y - 1][mino.x] = MINO.empty.value;
    matrix[mino.y][mino.x] = MINO[tetrimino.type].value;
  }
}

function play() {
  tetriminoActive = tetriminoActive || getTetrimino();
  drop(tetriminoActive);

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
