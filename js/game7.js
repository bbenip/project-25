const GRID_DIMENSION = 8;

const PIECE_BLANK = 0;
const PIECE_INITIAL = 1;
const PIECE_BLACK = 1;
const PIECE_WHITE = 2;

const board = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

let pieceCurrent;

function cellToCoordinate(cell) {
  const i = ~~(cell / GRID_DIMENSION);
  const j = cell % GRID_DIMENSION;

  return { i, j };
}

function addPiece(event) {
  const cell = event.target.id.match(/cell(.*)/)[1];
  if (cell === null) return;

  const { i, j } = cellToCoordinate(cell);

  if (board[i][j] !== PIECE_BLANK) {
    return;
  }

  board[i][j] = pieceCurrent;
  pieceCurrent = pieceCurrent % 2 + 1;

  renderGame();
}
function resetGame() {
  pieceCurrent = PIECE_INITIAL;
}

function renderGame() {
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      if (board[i][j] === 0) {
        continue;
      }

      const coordinate = j + i * GRID_DIMENSION
      const cell = document.getElementById('cell' + coordinate);

      if (cell.hasChildNodes()) {
        continue;
      }

      const piece = document.createElement('div');
      piece.id = 'cell' + coordinate;
      piece.className = 'piece';

      if (board[i][j] === PIECE_BLACK) {
        piece.className += ' black';
      } else if (board[i][j] === PIECE_WHITE) {
        piece.className += ' white';
      }

      cell.appendChild(piece);
    }
  }
}

window.onload = () => {
  const board = document.createElement('table');

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    const row = document.createElement('tr');

    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const cell = document.createElement('td');
      cell.id = 'cell' + (j + i * GRID_DIMENSION);
      cell.addEventListener('click', addPiece);
      row.appendChild(cell);
    }

    board.appendChild(row);
  }

  const gameContainer = document.getElementById('game');
  gameContainer.appendChild(board);

  resetGame();
  renderGame();
}
