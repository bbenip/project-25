const GRID_DIMENSION = 8;

const PIECE_BLANK = 0;
const PIECE_INITIAL = 1;
const PIECE_BLACK = 1;
const PIECE_WHITE = 2;

const DIRECTIONS = [
  [-1,  -1],
  [0,   -1],
  [1,   -1],
  [-1,  0],
  [1,   0],
  [-1,  1],
  [0,   1],
  [1,   1],
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

  for (let y = 0; y < GRID_DIMENSION; ++y) {
    for (let x = 0; x < GRID_DIMENSION; ++x) {
      if (board[y][x] !== pieceCurrent) {
        continue;
      }

      for (const direction of DIRECTIONS) {
        let x2 = x + direction[0];
        let y2 = y + direction[1];

        let visitedOppositePieces = false;

        while (isValidCoordinate(x2, y2)) {
          if (board[y2][x2] !== getOppositePiece(board[y][x])) {
            if (board[y2][x2] === PIECE_BLANK && visitedOppositePieces) {
              moves.push([x2, y2]);
            }

            break;
          }

          x2 += direction[0];
          y2 += direction[1];
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

function isValidMove(x, y) {
  return validMoves.some(([x2, y2]) => x2 === x && y2 === y);
}

function isValidCoordinate(x, y) {
  return (
    (x >= 0 && x < GRID_DIMENSION)
    && (y >= 0 && y < GRID_DIMENSION)
  );
}

function getOppositePiece(piece) {
  return (piece === PIECE_BLANK) ? piece : piece % 2 + 1;
}

function swapPieces(x, y, x2, y2) {
  const length = Math.max(Math.abs(x2 - x), Math.abs(y2 - y));
  const direction = [(x2 - x) / length, (y2 - y) / length];

  for (let n = 0; n < length - 1; ++n) {
    x += direction[0];
    y += direction[1];

    board[y][x] = getOppositePiece(board[y][x]);
  }

  score[pieceCurrent] += length - 1;
  score[getOppositePiece(pieceCurrent)] -= length - 1;
}

function captureCells(x, y) {
  for (const direction of DIRECTIONS) {
    let x2 = x + direction[0];
    let y2 = y + direction[1];

    while (isValidCoordinate(x2, y2)) {
      if (board[y2][x2] === PIECE_BLANK) {
        break;
      }

      if (board[y2][x2] === pieceCurrent) {
        swapPieces(x, y, x2, y2);
        break;
      }

      x2 += direction[0];
      y2 += direction[1];
    }
  }
}

function renderCounter() {
  const blackCounter = document.querySelector('#black-counter');
  blackCounter.textContent = `Black: ${score[PIECE_BLACK]}`;

  const whiteCounter = document.querySelector('#white-counter');
  whiteCounter.textContent = `White: ${score[PIECE_WHITE]}`;
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
  const cell = event.target;

  const x = cell.cellIndex;
  const y = cell.parentNode.rowIndex;

  if (!isValidMove(x, y)) {
    return;
  }

  board[y][x] = pieceCurrent;
  captureCells(x, y);

  score[pieceCurrent] += 1;

  pieceCurrent = getOppositePiece(pieceCurrent);
  validMoves = getValidMoves();

  renderGame();

  if (validMoves.length === 0) {
    pieceCurrent = getOppositePiece(pieceCurrent);
    validMoves = getValidMoves();

    renderGame();

    if (validMoves.length === 0) {
      endGame();
    }
  }

}

function renderGame() {
  for (let y = 0; y < GRID_DIMENSION; ++y) {
    for (let x = 0; x < GRID_DIMENSION; ++x) {
      const cell = document.querySelector('#board').rows[y].cells[x];
      const piece = cell.querySelector('.piece');

      if (board[y][x] === PIECE_BLANK) {
        piece.className = 'piece blank';
      } else if (board[y][x] === PIECE_BLACK) {
        piece.className = 'piece black';
      } else if (board[y][x] === PIECE_WHITE) {
        piece.className = 'piece white';
      }
    }
  }

  for (const [x, y] of validMoves) {
    const cell = document.querySelector('#board').rows[y].cells[x];
    const piece = cell.querySelector('.piece');

    piece.className = 'piece preview';
  }

  renderCounter();
}

window.onload = () => {
  const table = document.createElement('table');
  table.setAttribute('id', 'board');

  for (let y = 0; y < GRID_DIMENSION; ++y) {
    const row = document.createElement('tr');

    for (let x = 0; x < GRID_DIMENSION; ++x) {
      const cell = document.createElement('td');
      const piece = document.createElement('div');

      cell.addEventListener('click', addPiece);
      piece.className = 'piece';

      cell.appendChild(piece);
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  const gameContainer = document.querySelector('#game');
  gameContainer.appendChild(table);

  resetGame();
  renderGame();
}
