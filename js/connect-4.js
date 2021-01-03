const BOARD_HEIGHT = 6;
const BOARD_WIDTH = 7;

const COLORS = ['yellow', 'red'];

let board = [];
const columnHeights = [];

let playerID = 0;

function resetGame() {
  const emptyRow = [];
  emptyRow.length = BOARD_WIDTH;
  emptyRow.fill(-1);

  board.length = BOARD_HEIGHT;
  board.fill([]);
  board = board.map((row) => [...emptyRow]);

  columnHeights.length = BOARD_WIDTH;
  columnHeights.fill(0);

  playerID = 0;

  for (let row = 0; row < BOARD_HEIGHT; ++row) {
    for (let column = 0; column < BOARD_WIDTH; ++column) {
      const piece = document.querySelector(`#piece${row * BOARD_WIDTH + column}`);
      const cell = document.querySelector(`#cell${row * BOARD_WIDTH + column}`)

      piece.className = 'piece blank';
      cell.className = '';
    }
  }
}

function updatePlayer() {
  playerID = (playerID + 1) % 2;
}

function isColumnFull(column) {
  return columnHeights[column] === BOARD_HEIGHT;
}

function highlightWinningPieces(winningPieces) {
  for (const [row, column] of winningPieces) {
    const cell = document.querySelector(`#cell${row * BOARD_WIDTH + column}`);
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
  const cellID = event.target.id.match(/cell(.*)/)[1];
  const column = cellID % BOARD_WIDTH;

  if (isColumnFull(column)) {
    return;
  }

  const row = columnHeights[column];
  ++columnHeights[column];

  board[row][column] = playerID;

  const piece = document.querySelector(`#piece${row * BOARD_WIDTH + column}`);
  piece.className = `piece ${COLORS[playerID]}`;

  const winningCandidate = getLongestSequence(row, column).slice(0, 4);

  if (winningCandidate.length >= 4) {
    highlightWinningPieces(winningCandidate);
    setTimeout(
      () => {
        alert(`Player ${playerID + 1} wins!`)
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
  table.id = 'board';

  for (let i = BOARD_HEIGHT - 1; i >= 0; --i) {
    const row = document.createElement('tr');

    for (let j = 0; j < BOARD_WIDTH; ++j) {
      const cell = document.createElement('td');
      const piece = document.createElement('div');

      piece.className = 'piece blank';
      piece.id = `piece${i * BOARD_WIDTH + j}`;
      cell.id = `cell${i * BOARD_WIDTH + j}`;

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
