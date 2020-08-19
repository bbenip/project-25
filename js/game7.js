const GRID_DIMENSION = 8;

const WHITE_PIECE = 1;
const BLACK_PIECE = 2;

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

function addPiece() {}
function resetGame() {}

function renderGame() {
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      if (board[i][j] === 0) {
        continue;
      }

      const coordinate = j + i * GRID_DIMENSION
      const cell = document.getElementById('cell' + coordinate);

      if (board[i][j] === WHITE_PIECE) {
        cell.innerHTML = '<div class="piece white">&nbsp;</div>';
      } else if (board[i][j] === BLACK_PIECE) {
        cell.innerHTML = '<div class="piece black">&nbsp;</div>';
      }
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
