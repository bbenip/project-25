let contextPlayfield = null;
let contextHoldQueue = null;
let contextNextQueue = null;

const MATRIX_WIDTH = 1000;
const MATRIX_HEIGHT = 2000;
const MATRIX_BUFFER_TOP = 200;
const MATRIX_NUM_CELLS_X = 10;
const MATRIX_NUM_CELLS_Y = 22;
const MATRIX_BACKGROUND_COLOR = 'white';
const MATRIX_GRID_COLOR = 'rgb(192, 192, 192)'
const OFFSET_SKYLINE = 2;

const QUEUE_WIDTH = 500;
const QUEUE_HEIGHT = 2200;

const NEXT_QUEUE_LENGTH = 5;

const MINO_PADDING = 5;
const MINO_DIMENSION = 100;
const MINO_STROKE_COLOR = 'black';

const MINO = {
  empty: -1,
  t: 0,
  z: 1,
  s: 2,
  j: 3,
  l: 4,
  i: 5,
  o: 6,
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

const TETRIMINO_GHOST_OPACITY = 0.5;
const TETRIMINO_TYPES = ['t', 'z', 's', 'j', 'l', 'i', 'o'];
const TETRIMINO_MINO_ORIENTATIONS = {
  t: {
    north:  [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    east:   [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }],
    south:  [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }],
    west:   [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  },
  z: {
    north:  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    east:   [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 0 }, { x: 2, y: 1 }],
    south:  [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    west:   [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
  },
  s: {
    north:  [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }],
    east:   [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
    south:  [{ x: 0, y: 2 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }],
    west:   [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  },
  j: {
    north:  [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    east:   [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 0 }],
    south:  [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
    west:   [{ x: 0, y: 2 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  },
  l: {
    north:  [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 2, y: 1 }],
    east:   [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    south:  [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    west:   [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  },
  i: {
    north:  [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
    east:   [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
    south:  [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
    west:   [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
  },
  o: {
    north:  [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 2, y: 1 }],
    east:   [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 2, y: 1 }],
    south:  [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 2, y: 1 }],
    west:   [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 0 }, { x: 2, y: 1 }],
  },
};

const DEFAULT_ANCHOR = { x: 3, y: 0 };

const DIRECTIONS = ['north', 'east', 'south', 'west'];
const DEFAULT_DIRECTION = 'north';

const DEFAULT_OFFSET = { x: 0, y: 0 };
const MOVEMENT_TO_OFFSET = {
  left:   { x: -1,  y: 0 },
  right:  { x: 1,   y: 0 },
  down:   { x: 0,   y: 1 },
};

const DEFAULT_LINES_CLEARED = 0;
const DEFAULT_TETRIMINO_QUEUE = [];
const DEFAULT_TETRIMINO = null;
const DEFAULT_HOLD_STATE = false;

let linesCleared = DEFAULT_LINES_CLEARED;
let tetriminoQueue = DEFAULT_TETRIMINO_QUEUE;
let tetriminoActive = DEFAULT_TETRIMINO;
let tetriminoHeld = DEFAULT_TETRIMINO;
let isTetriminoHeldRecent = DEFAULT_HOLD_STATE;
let matrix = [];

function resetGame() {
  linesCleared = DEFAULT_LINES_CLEARED;
  tetriminoQueue = DEFAULT_TETRIMINO_QUEUE.slice();
  tetriminoActive = DEFAULT_TETRIMINO;
  tetriminoHeld = DEFAULT_TETRIMINO;
  isTetriminoHeldRecent = DEFAULT_HOLD_STATE;

  matrix = Array(MATRIX_NUM_CELLS_Y)
    .fill(MINO.empty)
    .map(() => Array(MATRIX_NUM_CELLS_X).fill(MINO.empty));
}

function getMino(tetrimino) {
  return TETRIMINO_TYPES.indexOf(tetrimino.type);
}

function getMinoPositions(tetrimino, offset = DEFAULT_OFFSET) {
  const { anchor, type, direction } = { ...tetrimino };
  const minoOrientations = TETRIMINO_MINO_ORIENTATIONS[type][direction];

  const minoPositions = minoOrientations.map(({ x, y }) => ({
    x: x + anchor.x + offset.x,
    y: y + anchor.y + offset.y,
  }));

  return minoPositions;
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

function renderTetriminoGhost() {
  if (tetriminoActive === null) {
    return;
  }

  const anchor = { ...tetriminoActive.anchor };

  const tetriminoGhost = {
    ...tetriminoActive,
    anchor
  };

  while (!isLocked(tetriminoGhost, 'down')) {
    anchor.y += 1;
  }

  contextPlayfield.globalAlpha = TETRIMINO_GHOST_OPACITY;

  const mino = getMino(tetriminoGhost);
  const minoPositions = getMinoPositions(tetriminoGhost);

  for (const { x, y } of minoPositions) {
    drawMino(mino, x, y, contextPlayfield);
  }

  contextPlayfield.globalAlpha = 1;
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

  renderTetriminoGhost();
}

function renderHoldQueue() {
  contextHoldQueue.fillStyle = MATRIX_BACKGROUND_COLOR;
  contextHoldQueue.fillRect(0, 0, QUEUE_WIDTH, QUEUE_HEIGHT);

  if (tetriminoHeld === null) {
    return;
  }

  const mino = getMino(tetriminoHeld);
  const offset = { x: -3, y: OFFSET_SKYLINE };
  const minoPositions = getMinoPositions(tetriminoHeld, offset);

  for (const { x, y } of minoPositions) {
    drawMino(mino, x, y, contextHoldQueue);
  }
}

function renderNextQueue() {
  contextNextQueue.fillStyle = MATRIX_BACKGROUND_COLOR;
  contextNextQueue.fillRect(0, 0, QUEUE_WIDTH, QUEUE_HEIGHT);

  if (tetriminoQueue.length === 0) {
    return;
  }

  for (let i = 0; i < NEXT_QUEUE_LENGTH; ++i) {
    const anchor = { x: 1, y: OFFSET_SKYLINE };
    const type = tetriminoQueue[i];
    const direction = DEFAULT_DIRECTION;

    const mino = MINO[type];
    const minoPositions = getMinoPositions({ anchor, type, direction });

    const queueBlockHeight = 4;

    for (const { x, y } of minoPositions) {
      drawMino(mino, x, y + (queueBlockHeight * i), contextNextQueue);
    }
  }
}

function renderLineCounter() {
  const lineCounter = document.querySelector('#line-counter');
  lineCounter.textContent = `Lines cleared: ${linesCleared}`;
}

function renderGame() {
  renderPlayfield();
  renderHoldQueue();
  renderNextQueue();
  renderLineCounter();
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
  if (tetriminoQueue.length < TETRIMINO_TYPES.length) {
    tetriminoQueue.push(...shuffle(TETRIMINO_TYPES));
  }

  const tetriminoKey = tetriminoQueue.shift();
  const tetrimino = {
    anchor: { ...DEFAULT_ANCHOR },
    direction: DEFAULT_DIRECTION,
    type: tetriminoKey,
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
  const minoPositions = getMinoPositions(tetrimino);
  return minoPositions.some(({ x: x1, y: y1 }) => x === x1 && y === y1);
}

function isIntersectLockedMino(x, y, tetrimino) {
  if (matrix[y][x] !== MINO.empty) {
    return !isIntersectTetrimino(x, y, tetrimino);
  }

  return false;
}

function isLocked(tetrimino, movement) {
  if (tetrimino === null) {
    return true;
  }

  const offset = MOVEMENT_TO_OFFSET[movement];
  const minoPositions = getMinoPositions(tetrimino, offset);

  return minoPositions.some(({ x, y }) => {
    return isOutOfBounds(x, y) || isIntersectLockedMino(x, y, tetrimino);
  });
}

function clearLines(tetrimino) {
  if (tetrimino === null) {
    return;
  }

  const minoPositions = getMinoPositions(tetrimino);
  const yValues = minoPositions.map(({ y }) => y);

  let yMin = MATRIX_NUM_CELLS_Y;
  let yMax = -1;

  for (const y of yValues) {
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);
  }

  for (let i = yMin; i <= yMax; ++i) {
    const isLineFull = matrix[i].every((mino) => mino !== MINO.empty);

    if (isLineFull) {
      matrix.splice(i, 1);
      matrix.unshift(Array(MATRIX_NUM_CELLS_X).fill(MINO.empty));

      linesCleared += 1;
    }
  }
}

function isLockOut(tetrimino) {
  if (tetrimino === null) {
    return false;
  }

  const minoPositions = getMinoPositions(tetrimino);
  return minoPositions.every(({ y }) => y < OFFSET_SKYLINE);
}

function isBlockOut(tetrimino) {
  const minoPositions = getMinoPositions(tetrimino);
  return minoPositions.some(({ x, y }) => matrix[y][x] !== MINO.empty);
}

function addTetriminoToMatrix(tetrimino) {
  const mino = getMino(tetrimino);
  const minoPositions = getMinoPositions(tetrimino);

  for (const { x, y } of minoPositions) {
    matrix[y][x] = mino;
  }
}

function moveTetrimino(tetrimino, movement) {
  const mino = getMino(tetrimino);
  const minoPositions = getMinoPositions(tetrimino);

  for (const { x, y } of minoPositions) {
    matrix[y][x] = MINO.empty;
  }

  const offset = MOVEMENT_TO_OFFSET[movement];

  tetrimino.anchor.x += offset.x;
  tetrimino.anchor.y += offset.y;

  const newMinoPositions = getMinoPositions(tetrimino);
  for (const { x, y } of newMinoPositions) {
    matrix[y][x] = mino;
  }
}

function play() {
  if (isLocked(tetriminoActive, 'down')) {
    clearLines(tetriminoActive);

    const tetriminoOld = tetriminoActive;
    tetriminoActive = getTetrimino();

    if (isLockOut(tetriminoOld) || isBlockOut(tetriminoActive)) {
      alert(`Game over! You cleared ${linesCleared} lines.`);
      resetGame();
    } else {
      addTetriminoToMatrix(tetriminoActive);
      isTetriminoHeldRecent = false;
    }
  } else {
    moveTetrimino(tetriminoActive, 'down');
  }

  renderGame();
}

function getNextDirection(direction, rotation) {
  const directionIndex = DIRECTIONS.indexOf(direction);
  let nextDirectionIndex = directionIndex;

  if (rotation === 'clockwise') {
     nextDirectionIndex += 1;
  } else if (rotation === 'counterClockwise') {
    nextDirectionIndex += DIRECTIONS.length - 1;
  }

  nextDirectionIndex %= DIRECTIONS.length;
  return DIRECTIONS[nextDirectionIndex];
}


function isRotateLocked(tetrimino, rotation) {
  if (tetrimino === null) {
    return true;
  }

  const direction = tetrimino.direction;
  const nextDirection = getNextDirection(direction, rotation);
  const minoPositions = getMinoPositions({
    ...tetrimino,
    direction: nextDirection,
  });

  return minoPositions.some(({ x, y }) => {
    return isOutOfBounds(x, y) || isIntersectLockedMino(x, y, tetrimino);
  });
}

function rotateTetrimino(tetrimino, rotation) {
  const oldMinoPositions = getMinoPositions(tetrimino);

  for (const { x, y } of oldMinoPositions) {
    matrix[y][x] = MINO.empty;
  }

  const direction = tetrimino.direction;
  tetrimino.direction = getNextDirection(direction, rotation);

  const mino = getMino(tetrimino);
  const newMinoPositions = getMinoPositions(tetrimino);

  for (const { x, y } of newMinoPositions) {
    matrix[y][x] = mino;
  }
}

function getUserInput({ keyCode: code }) {
  const movementCodes = [37, 39, 40];
  const codeToMovement = {
    37: 'left',
    39: 'right',
    40: 'down',
  };

  const rotationCodes = [38, 90];
  const codeToRotation = {
    38: 'clockwise',
    90: 'counterClockwise',
  };

  const codeForHold = 67;
  const codeForHardDrop = 32;

  if (movementCodes.includes(code)) {
    const movement = codeToMovement[code];

    if (!isLocked(tetriminoActive, movement)) {
      moveTetrimino(tetriminoActive, movement);
      renderGame();
    }
  } else if (rotationCodes.includes(code)) {
    const rotation = codeToRotation[code];
    if (!isRotateLocked(tetriminoActive, rotation)) {
      rotateTetrimino(tetriminoActive, rotation);
      renderGame();
    }
  } else if (code === codeForHold && !isTetriminoHeldRecent) {
    const minoPositions = getMinoPositions(tetriminoActive);

    for (const { x, y } of minoPositions) {
      matrix[y][x] = MINO.empty;
    };

    tetriminoActive.direction = DEFAULT_DIRECTION;
    tetriminoActive.anchor = { ...DEFAULT_ANCHOR };

    const tetriminoHeldOld = tetriminoHeld;
    tetriminoHeld = tetriminoActive;
    tetriminoActive = tetriminoHeldOld || getTetrimino();

    addTetriminoToMatrix(tetriminoActive);
    isTetriminoHeldRecent = true;
    renderGame();
  } else if (code === codeForHardDrop) {
    while (!isLocked(tetriminoActive, 'down')) {
      moveTetrimino(tetriminoActive, 'down');
    }

    play();
  }
}

window.onload = () => {
  contextPlayfield = document.querySelector('#playfield').getContext('2d');
  contextHoldQueue = document.querySelector('#hold-queue').getContext('2d');
  contextNextQueue = document.querySelector('#next-queue').getContext('2d');

  resetGame();
  renderGame();

  document.addEventListener('keydown', getUserInput);

  const refreshRate = 500;
  setInterval(play, refreshRate);
};
