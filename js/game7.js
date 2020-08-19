const GRID_DIMENSION = 8;

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function addPiece() {}
function resetGame() {}
function renderGame() {}

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
