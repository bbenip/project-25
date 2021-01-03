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
const TETRIMINO_MINO_POSITIONS = {
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

const ORIENTATIONS = ['north', 'east', 'south', 'west'];
const DEFAULT_ORIENTATION = 'north';

const DIRECTION_TO_OFFSET = {
  left:   { x: -1,  y: 0 },
  right:  { x: 1,   y: 0 },
  down:   { x: 0,   y: 1 },
};


let tetriminoQueue = [];
let tetriminoActive = null;
let tetriminoHeld = null;
let isTetriminoHeldRecent = false;
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

  const { type, orientation } = { ...tetriminoActive };
  const minoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];
  const mino = TETRIMINO_TYPES.indexOf(tetriminoActive.type);

  for (const minoPosition of minoPositions) {
    const x = anchor.x + minoPosition.x;
    const y = anchor.y + minoPosition.y;

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
  if (tetriminoHeld === null) {
    return;
  }

  contextHoldQueue.fillStyle = MATRIX_BACKGROUND_COLOR;
  contextHoldQueue.fillRect(0, 0, QUEUE_WIDTH, QUEUE_HEIGHT);

  const type = tetriminoHeld.type;
  const orientation = DEFAULT_ORIENTATION;

  const mino = TETRIMINO_TYPES.indexOf(type);
  const minoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];

  const yOffset = 2;

  for (const { x, y } of minoPositions) {
    drawMino(
      mino,
      x,
      y + yOffset,
      contextHoldQueue
    );
  }
}

function renderNextQueue() {
  if (tetriminoQueue.length === 0) {
    return;
  }

  contextNextQueue.fillStyle = MATRIX_BACKGROUND_COLOR;
  contextNextQueue.fillRect(0, 0, QUEUE_WIDTH, QUEUE_HEIGHT);

  for (let i = 0; i < NEXT_QUEUE_LENGTH; ++i) {
    const type = tetriminoQueue[i];
    const orientation = DEFAULT_ORIENTATION;
    const minoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];

    const mino = MINO[type];

    const xOffset = 1;
    const yOffset = 2;
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
  renderHoldQueue();
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
  if (tetriminoQueue.length < TETRIMINO_TYPES.length) {
    tetriminoQueue.push(...shuffle(TETRIMINO_TYPES));
  }

  const tetriminoKey = tetriminoQueue.shift();
  const tetrimino = {
    anchor: { ...DEFAULT_ANCHOR },
    orientation: DEFAULT_ORIENTATION,
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
  const { anchor, type, orientation } = { ...tetrimino };
  const minoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];

  return minoPositions.some((minoPosition) => {
    const x1 = anchor.x + minoPosition.x;
    const y1 = anchor.y + minoPosition.y;

    return x === x1 && y === y1;
  });
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

  const { anchor, type, orientation } = { ...tetrimino };
  const minoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];
  const offset = DIRECTION_TO_OFFSET[direction];

  for (const minoPosition of minoPositions) {
    const x = anchor.x + minoPosition.x + offset.x;
    const y = anchor.y + minoPosition.y + offset.y;

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

  const { anchor, type, orientation } = { ...tetrimino };
  const minoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];

  const yValues = minoPositions.map((minoPosition) => {
    return anchor.y + minoPosition.y;
  });

  let yMin = MATRIX_NUM_CELLS_Y;
  let yMax = -1;

  for (const y of yValues) {
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);
  }

  for (let i = yMin; i <= yMax; ++i) {
    const isLineFull = matrix[i].every(mino => mino !== MINO.empty);

    if (isLineFull) {
      matrix.splice(i, 1);
      matrix.unshift(Array(MATRIX_NUM_CELLS_X).fill(MINO.empty));
    }
  }
}

function addTetriminoToMatrix(tetrimino) {
  const { anchor, type, orientation } = { ...tetrimino };
  const minoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];

  for (const minoPosition of minoPositions) {
    const x = anchor.x + minoPosition.x;
    const y = anchor.y + minoPosition.y;

    matrix[y][x] = TETRIMINO_TYPES.indexOf(type);
  }
}

function moveTetrimino(tetrimino, direction) {
  const offset = DIRECTION_TO_OFFSET[direction];
  const { anchor, type, orientation } = { ...tetrimino };
  const minoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];

  anchor.x += offset.x;
  anchor.y += offset.y;

  for (const minoPosition of minoPositions) {
    const x = anchor.x + minoPosition.x - offset.x;
    const y = anchor.y + minoPosition.y - offset.y;
    matrix[y][x] = MINO.empty;
  }

  for (const minoPosition of minoPositions) {
    const x = anchor.x + minoPosition.x;
    const y = anchor.y + minoPosition.y;

    matrix[y][x] = TETRIMINO_TYPES.indexOf(type);
  }
}

function play() {
  if (isLocked(tetriminoActive, 'down')) {
    clearLines(tetriminoActive);

    tetriminoActive = getTetrimino();
    addTetriminoToMatrix(tetriminoActive);

    isTetriminoHeldRecent = false;
  } else {
    moveTetrimino(tetriminoActive, 'down');
  }

  renderGame();
}

function getNextOrientation(orientation, rotation) {
  const orientationIndex = ORIENTATIONS.indexOf(orientation);
  let newOrientationIndex = orientationIndex;

  if (rotation === 'clockwise') {
     newOrientationIndex += 1;
  } else if (rotation === 'counterClockwise') {
    newOrientationIndex += ORIENTATIONS.length - 1;
  }

  newOrientationIndex %= ORIENTATIONS.length;
  return ORIENTATIONS[newOrientationIndex];
}


function isRotateLocked(tetrimino, rotation) {
  if (tetrimino === null) {
    return true;
  }

  const { anchor, type, orientation } = { ...tetrimino };
  const newOrientation = getNextOrientation(orientation, rotation);
  const minoPositions = TETRIMINO_MINO_POSITIONS[type][newOrientation];

  for (const minoPosition of minoPositions) {
    const x = anchor.x + minoPosition.x;
    const y = anchor.y + minoPosition.y;

    if (isOutOfBounds(x, y) || isIntersectLockedMino(x, y, tetrimino)) {
      return true;
    }
  }

  return false;
}

function rotateTetrimino(tetrimino, rotation) {
  const { anchor, type, orientation } = { ...tetrimino };
  const oldMinoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];

  for (const minoPosition of oldMinoPositions) {
    const x = anchor.x + minoPosition.x;
    const y = anchor.y + minoPosition.y;

    matrix[y][x] = MINO.empty;
  }

  const newOrientation = getNextOrientation(orientation, rotation);
  tetrimino.orientation = newOrientation;

  const newMinoPositions = TETRIMINO_MINO_POSITIONS[type][newOrientation];
  const mino = TETRIMINO_TYPES.indexOf(type);

  for (const minoPosition of newMinoPositions) {
    const x = anchor.x + minoPosition.x;
    const y = anchor.y + minoPosition.y;

    matrix[y][x] = mino;
  }
}

function getUserInput({ keyCode: code }) {
  const movementCodes = [37, 39, 40];
  const codeToDirection = {
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
    const direction = codeToDirection[code];

    if (!isLocked(tetriminoActive, direction)) {
      moveTetrimino(tetriminoActive, direction);
      renderGame();
    }
  } else if (rotationCodes.includes(code)) {
    const rotation = codeToRotation[code];
    if (!isRotateLocked(tetriminoActive, rotation)) {
      rotateTetrimino(tetriminoActive, rotation);
      renderGame();
    }
  } else if (code === codeForHold && !isTetriminoHeldRecent) {
    const tetriminoHeldOld = tetriminoHeld;
    tetriminoHeld = tetriminoActive;

    const { anchor, type, orientation } = { ...tetriminoActive };
    const minoPositions = TETRIMINO_MINO_POSITIONS[type][orientation];

    minoPositions.forEach((minoPosition) => {
      const x = anchor.x + minoPosition.x;
      const y = anchor.y + minoPosition.y;

      matrix[y][x] = MINO.empty;
    });

    if (tetriminoHeldOld !== null) {
      tetriminoActive = tetriminoHeldOld;
      tetriminoHeldOld.anchor = { ...DEFAULT_ANCHOR };
      tetriminoHeldOld.orientation = DEFAULT_ORIENTATION;
    } else {
      tetriminoActive = getTetrimino();
    }

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
