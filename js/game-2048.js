let context;

const CODE_TO_DIRECTION = {
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
};

const VALUE_TO_COLOR = {
  0: '#cdc0b4',
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59663',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edce72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
}

const CELL_LENGTH  = 500;
const CELL_PADDING    = 25;
const NUM_AXIS_CELLS  = 4;

const BOARD_DIMENSION = 2050;

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;
let achieved2048 = false;

function clearBoard() {
  for (let i = 0; i < NUM_AXIS_CELLS; ++i) {
    board[i] = [0, 0, 0, 0];
  }
}

function getEmptyCell() {
  const emptyCells = [];

  for (let i = 0; i < NUM_AXIS_CELLS; ++i) {
    for (let j = 0; j < NUM_AXIS_CELLS; ++j) {
      if (board[i][j] === 0) {
        emptyCells.push({ i, j });
      }
    }
  }

  const index = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[index];
}

function addCell() {
  const { i, j } = getEmptyCell();
  
  const value = Math.random() < 0.9 ? 2 : 4;
  board[i][j] = value;
}

function resetGame() {
  clearBoard();
  addCell();
  addCell();

  achieved2048 = false;
}

function renderScore() {
  const counter = document.querySelector('#score');
  counter.textContent = `Score: ${score}`;
}

function renderGame() {
  renderScore();

  const TILE_HIGH_VALUE = 2048;
  const TEXT_LOW_VALUE = 4;

  const BOARD_BG_COLOR = '#bbada0';
  const TEXT_COLOR_LOW = '#776e65';
  const TEXT_COLOR_HIGH = '#f9f6f2';
  const TILE_COLOR_HIGH = '#37322c';

  context.fillStyle = BOARD_BG_COLOR;
  context.fillRect(0, 0, BOARD_DIMENSION, BOARD_DIMENSION);

  for (let i = 0; i < NUM_AXIS_CELLS; ++i) {
    for (let j = 0; j < NUM_AXIS_CELLS; ++j) {
      const value = board[i][j];

      context.fillStyle = value <= TILE_HIGH_VALUE
        ? VALUE_TO_COLOR[value] : TILE_COLOR_HIGH;
      context.fillRect(
        j * CELL_LENGTH + 2 * CELL_PADDING,
        i * CELL_LENGTH + 2 * CELL_PADDING,
        CELL_LENGTH - 2 * CELL_PADDING,
        CELL_LENGTH - 2 * CELL_PADDING,
      );

      if (value === 0) continue;

      context.fillStyle = value <= TEXT_LOW_VALUE
        ? TEXT_COLOR_LOW : TEXT_COLOR_HIGH;
      context.font = '900 150px Roboto';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      context.fillText(
        value,
        j * CELL_LENGTH + CELL_LENGTH / 2 + CELL_PADDING,
        i * CELL_LENGTH + CELL_LENGTH / 2 + CELL_PADDING
      );
    }
  }
}

function isGameStuck() {
  for (let i = 0; i < NUM_AXIS_CELLS; ++i) {
    for (let j = 0; j < NUM_AXIS_CELLS; ++j) {
      const isEmptyCell = board[i][j] === 0;
      const isMergePossible =
        j < NUM_AXIS_CELLS - 1
        && (
          board[i][j] === board[i][j + 1]
          || board[j][i] === board[j + 1][i]
        );

      if (isEmptyCell || isMergePossible) {
        return false;
      }
    }
  }

  return true;
}

function isGameWon() {
  if (achieved2048) return false;

  for (let i = 0; i < NUM_AXIS_CELLS; ++i) {
    for (let j = 0; j < NUM_AXIS_CELLS; ++j) {
      if (board[i][j] === 2048) {
        achieved2048 = true;
        return true;
      }
    }
  }

  return false;
}

function move(event) {
  const direction = CODE_TO_DIRECTION[event.keyCode];
  if (direction === undefined) return;

  let isValidMove = false;

  if (direction === 'LEFT') {
    for (let i = 0; i < NUM_AXIS_CELLS; ++i) {
      let p1 = 0;
      let p2 = 1;
      while (p2 < NUM_AXIS_CELLS) {
        if (board[i][p2] === 0) {
          ++p2;
        } else if (board[i][p1] === 0) {
          isValidMove = true;

          board[i][p1] = board[i][p2];
          board[i][p2] = 0;
          ++p2;
        } else if (board[i][p1] !== 0) {
          if (board[i][p1] === board[i][p2]) {
            isValidMove = true;
            score += board[i][p1] + board[i][p2];

            board[i][p1] *= 2;
            board[i][p2] = 0;
            ++p1;
            ++p2;
          } else {
            ++p1;
            if (p1 === p2) {
              ++p2;
            }
          }
        }
      }
    }
  } else if (direction === 'RIGHT') {
    for (let i = 0; i < NUM_AXIS_CELLS; ++i) {
      let p1 = NUM_AXIS_CELLS - 1;
      let p2 = NUM_AXIS_CELLS - 2;
      while (p2 >= 0) {
        if (board[i][p2] === 0) {
          --p2;
        } else if (board[i][p1] === 0) {
          isValidMove = true;

          board[i][p1] = board[i][p2];
          board[i][p2] = 0;
          --p2;
        } else if (board[i][p1] !== 0) {
          if (board[i][p1] === board[i][p2]) {
            isValidMove = true;
            score += board[i][p1] + board[i][p2];

            board[i][p1] *= 2;
            board[i][p2] = 0;
            --p1;
            --p2;
          } else {
            --p1;
            if (p1 === p2) {
              --p2;
            }
          }
        }
      }
    }
  } else if (direction === 'UP') {
    for (let i = 0; i < NUM_AXIS_CELLS; ++i) {
      let p1 = 0;
      let p2 = 1;
      while (p2 < NUM_AXIS_CELLS) {
        if (board[p2][i] === 0) {
          ++p2;
        } else if (board[p1][i] === 0) {
          isValidMove = true;

          board[p1][i] = board[p2][i];
          board[p2][i] = 0;
          ++p2;
        } else if (board[p1][i] !== 0) {
          if (board[p1][i] === board[p2][i]) {
            isValidMove = true;
            score += board[p1][i] + board[p2][i];

            board[p1][i] *= 2;
            board[p2][i] = 0;
            ++p1;
            ++p2;
          } else {
            ++p1;
            if (p1 === p2) {
              ++p2;
            }
          }
        }
      }
    }
  } else if (direction === 'DOWN') {
    for (let i = 0; i < NUM_AXIS_CELLS; ++i) {
      let p1 = NUM_AXIS_CELLS - 1;
      let p2 = NUM_AXIS_CELLS - 2;
      while (p2 >= 0) {
        if (board[p2][i] === 0) {
          --p2;
        } else if (board[p1][i] === 0) {
          isValidMove = true;

          board[p1][i] = board[p2][i];
          board[p2][i] = 0;
          --p2;
        } else if (board[p1][i] !== 0) {
          if (board[p1][i] === board[p2][i]) {
            isValidMove = true;
            score += board[p1][i] + board[p2][i];

            board[p1][i] *= 2;
            board[p2][i] = 0;
            --p1;
            --p2;
          } else {
            --p1;
            if (p1 === p2) {
              --p2;
            }
          }
        }
      }
    }
  }

  if (!isValidMove) return;

  addCell();
  renderGame();

  if (isGameWon()) {
    alert('You win!');
  }
  
  if (isGameStuck()) {
    alert('Game Over! Your score is: ' + score);
    score = 0;
    resetGame();
    renderGame();
  }

}

window.onload = () => {
  let gameElement = document.querySelector('#game');
  context = gameElement.getContext('2d');
  
  resetGame();
  renderGame();

  document.addEventListener('keydown', move);
};
