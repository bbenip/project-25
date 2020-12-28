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

const BOARD_INITIAL = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const SCORE_INITIAL = {
  [PIECE_BLACK]: 2,
  [PIECE_WHITE]: 2,
};

let board = [];
let pieceCurrent = PIECE_INITIAL;
let validMoves = [];
let score = {};

function getValidMoves() {
  const moves = [];

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      if (board[i][j] !== pieceCurrent) continue;

      for (const direction of DIRECTIONS) {
        let i2 = i + direction[0];
        let j2 = j + direction[1];
        let visitedOppositePieces = false;

        while (isValidCoordinate(i2, j2)) {
          if (board[i2][j2] !== getOppositePiece(board[i][j])) {
            if (board[i2][j2] === PIECE_BLANK && visitedOppositePieces) {
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
  board = BOARD_INITIAL.map((row) => [...row]);
  pieceCurrent = PIECE_INITIAL;
  validMoves = getValidMoves();
  score = { ...SCORE_INITIAL };
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

    board[i][j] = getOppositePiece(board[i][j]);
  }

  score[pieceCurrent] += length - 1;
  score[getOppositePiece(pieceCurrent)] -= length - 1;
}

function captureCells(i, j) {
  for (const direction of DIRECTIONS) {
    let i2 = i + direction[0];
    let j2 = j + direction[1];

    while (isValidCoordinate(i2, j2)) {
      if (board[i2][j2] === PIECE_BLANK) break;

      if (board[i2][j2] === pieceCurrent) {
        swapPieces(i, j, i2, j2);
        break;
      }

      i2 += direction[0];
      j2 += direction[1];
    }
  }
}

function renderCounter() {
  const blackCounter = document.getElementById('black-counter');
  blackCounter.innerHTML = 'Black: ' + score[PIECE_BLACK];

  const whiteCounter = document.getElementById('white-counter');
  whiteCounter.innerHTML = 'White: ' + score[PIECE_WHITE];
}

function endGame() {
  if (score[PIECE_BLACK] > score[PIECE_WHITE]) {
    alert('Black wins!');
  } else if (score[PIECE_WHITE] > score[PIECE_BLACK]) {
    alert ('White wins!');
  } else {
    alert('The game ended in a tie!');
  }

  resetGame();
  setTimeout(renderGame, 1000);
}

function addPiece(event) {
  const cell = event.target.id.match(/cell(.*)/)[1];
  const { i, j } = cellToCoordinate(cell);

  if (!isValidMove(i, j)) {
    return;
  }

  board[i][j] = pieceCurrent;
  captureCells(i, j);

  ++score[pieceCurrent];

  pieceCurrent = getOppositePiece(pieceCurrent);
  validMoves = getValidMoves();

  renderGame();

  if (validMoves.length === 0) {
    pieceCurrent = getOppositePiece(pieceCurrent);
    validMoves = getValidMoves();

    if (validMoves.length === 0) {
      endGame();
    }
  }

}

function renderGame() {
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const cellNumber = j + i * GRID_DIMENSION;
      const piece = document.getElementById('piece' + cellNumber);

      if (board[i][j] === PIECE_BLANK) {
        piece.className = 'piece blank';
      } else if (board[i][j] === PIECE_BLACK) {
        piece.className = 'piece black';
      } else if (board[i][j] === PIECE_WHITE) {
        piece.className += 'piece white';
      }
    }
  }

  for (const [i, j] of validMoves) {
    const cellNumber = j + i * GRID_DIMENSION;
    const piece = document.getElementById('piece' + cellNumber);

    piece.className = 'piece preview';
  }

  renderCounter();
}

window.onload = () => {
  const table = document.createElement('table');
  table.id = 'gameTable';

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
