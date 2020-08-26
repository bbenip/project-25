const GRID_DIMENSION = 8;

const PIECE_BLANK = 0;
const PIECE_INITIAL = 1;
const PIECE_BLACK = 1;
const PIECE_WHITE = 2;

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

let pieceCurrent = PIECE_INITIAL;
let validMoves = [];

function getValidMoves() {
  const moves = [];

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      if (BOARD[i][j] !== pieceCurrent) continue;

      for (const direction of DIRECTIONS) {
        let i2 = i + direction[0];
        let j2 = j + direction[1];
        let visitedOppositePieces = false;

        while (isValidCoordinate(i2, j2)) {
          if (BOARD[i2][j2] !== getOppositePiece(BOARD[i][j])) {
            if (BOARD[i2][j2] === PIECE_BLANK && visitedOppositePieces) {
              moves.push([i2, j2]);
            }

            break;
          }

          i2 += direction[0];
          j2 += direction[1];
          visitedOppositePieces = true;
        }
      }
    }
  }

  return moves;
}

function resetGame() {
  pieceCurrent = PIECE_INITIAL;
  validMoves = getValidMoves();
}

function cellToCoordinate(cell) {
  const i = ~~(cell / GRID_DIMENSION);
  const j = cell % GRID_DIMENSION;

  return { i, j };
}

function isValidMove(i, j) {
  return validMoves.some(([i2, j2]) => i2 === i && j2 === j);
}

function isValidCoordinate(i, j) {
  return (
    i >= 0 && i < GRID_DIMENSION
    && j >= 0 && j < GRID_DIMENSION
  );
}

function getOppositePiece(piece) {
  return (piece === PIECE_BLANK) ? piece : piece % 2 + 1;
}

function swapPieces(i, j, i2, j2) {
  const length = Math.max(Math.abs(i2 - i), Math.abs(j2 - j));
  const direction = [(i2 - i) / length, (j2 - j) / length];

  for (let n = 0; n < length - 1; ++n) {
    i += direction[0];
    j += direction[1];

    BOARD[i][j] = getOppositePiece(BOARD[i][j]);
  }
}

function captureCells(i, j) {
  for (const direction of DIRECTIONS) {
    let i2 = i + direction[0];
    let j2 = j + direction[1];

    while (isValidCoordinate(i2, j2)) {
      if (BOARD[i2][j2] === PIECE_BLANK) break;

      if (BOARD[i2][j2] === pieceCurrent) {
        swapPieces(i, j, i2, j2);
        break;
      }

      i2 += direction[0];
      j2 += direction[1];
    }
  }
}

function addPiece(event) {
  const cell = event.target.id.match(/cell(.*)/)[1];
  const { i, j } = cellToCoordinate(cell);

  if (!isValidMove(i, j)) {
    return;
  }

  BOARD[i][j] = pieceCurrent;
  captureCells(i, j);

  pieceCurrent = getOppositePiece(pieceCurrent);
  validMoves = getValidMoves();

  renderGame();
}

function renderGame() {
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      if (BOARD[i][j] === 0) {
        continue;
      }

      const cellNumber = j + i * GRID_DIMENSION;
      const piece = document.getElementById('piece' + cellNumber);

      if (BOARD[i][j] === PIECE_BLANK) {
        piece.className = 'piece blank';
      } else if (BOARD[i][j] === PIECE_BLACK) {
        piece.className = 'piece black';
      } else if (BOARD[i][j] === PIECE_WHITE) {
        piece.className += 'piece white';
      }
    }
  }
}

window.onload = () => {
  const table = document.createElement('table');

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    const row = document.createElement('tr');

    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const cell = document.createElement('td');
      const piece = document.createElement('div');

      const cellNumber = j + i * GRID_DIMENSION;
      cell.id = 'cell' + cellNumber;
      piece.id = 'piece' + cellNumber;

      cell.addEventListener('click', addPiece);

      cell.appendChild(piece);
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  const gameContainer = document.getElementById('game');
  gameContainer.appendChild(table);

  resetGame();
  renderGame();
}
