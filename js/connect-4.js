const BOARD_HEIGHT = 6;
const BOARD_WIDTH = 7;

const COLORS = ['yellow', 'red'];

let board = [];
let columnHeights = [];

let playerId = 0;

function resetGame() {
  board = Array(BOARD_HEIGHT).fill(-1).map(() => Array(BOARD_WIDTH).fill(-1));
  columnHeights = Array(BOARD_WIDTH).fill(0);

  playerId = 0;

  for (let row = 0; row < BOARD_HEIGHT; ++row) {
    for (let column = 0; column < BOARD_WIDTH; ++column) {
      const cell = document.querySelector('#board').rows[row].cells[column];
      const piece = cell.querySelector('.piece');

      cell.className = '';
      piece.className = 'piece blank';
    }
  }
}

function updatePlayer() {
  playerId = (playerId + 1) % 2;
}

function isColumnFull(column) {
  return columnHeights[column] === BOARD_HEIGHT;
}

function highlightWinningPieces(winningPieces) {
  for (const [row, column] of winningPieces) {
    const cell = document.querySelector('#board').rows[row].cells[column];
    cell.className = 'winner';
  }
}

function isValidCoordinate(row, column) {
  return (
    (row >= 0 && row < BOARD_HEIGHT)
    && (column >= 0 && column < BOARD_WIDTH)
  );
}

function getLongestSequence(row, column) {
  const DIRECTIONS = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  let sequence = [];
  let color = COLORS[board[row][column]];

  for (const [i, j] of DIRECTIONS) {
    const sequenceCandidate = [[row, column]];
    let [nextRow1, nextColumn1] = [row + i, column + j];

    while (
      isValidCoordinate(nextRow1, nextColumn1)
      && COLORS[board[nextRow1][nextColumn1]] === color
    ) {
      sequenceCandidate.push([nextRow1, nextColumn1]);
      [nextRow1, nextColumn1] = [nextRow1 + i, nextColumn1 + j];
    }

    let [nextRow2, nextColumn2] = [row - i, column - j];

    while (
      isValidCoordinate(nextRow2, nextColumn2)
      && COLORS[board[nextRow2][nextColumn2]] === color
    ) {
      sequenceCandidate.push([nextRow2, nextColumn2]);
      [nextRow2, nextColumn2] = [nextRow2 - i, nextColumn2 - j];
    }

    if (sequenceCandidate.length > sequence.length) {
      sequence = sequenceCandidate;
    }
  }

  return sequence;
}


function addPiece(event) {
  const cell = event.target;
  const column = cell.cellIndex;

  if (isColumnFull(column)) {
    return;
  }

  const row = columnHeights[column];
  columnHeights[column] += 1;

  board[row][column] = playerId;

  const cellToUpdate = document.querySelector('#board').rows[row].cells[column];
  const piece = cellToUpdate.querySelector('.piece');
  piece.className = `piece ${COLORS[playerId]}`;

  const winningCandidate = getLongestSequence(row, column).slice(0, 4);

  if (winningCandidate.length >= 4) {
    highlightWinningPieces(winningCandidate);
    setTimeout(
      () => {
        alert(`Player ${playerId + 1} wins!`)
        resetGame();
      },
      500
    );
  } else {
    updatePlayer();
  }
}

window.onload = () => {
  const table = document.createElement('table');
  table.style.transform = 'rotateX(180deg)';
  table.id = 'board';

  for (let i = BOARD_HEIGHT - 1; i >= 0; --i) {
    const row = document.createElement('tr');

    for (let j = 0; j < BOARD_WIDTH; ++j) {
      const cell = document.createElement('td');

      const piece = document.createElement('div');
      piece.className = 'piece blank';

      cell.addEventListener('click', addPiece);

      cell.appendChild(piece);
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  const game = document.querySelector('#game');
  game.appendChild(table);

  resetGame();
};
