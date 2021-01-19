const BOARD_DIMENSION = 3;
const NUM_PLAYERS = 2;
const NUM_CELLS = BOARD_DIMENSION * BOARD_DIMENSION;

let turn = 1;
let boardState = {
  x: '',
  o: '',
};

const arrangements = [
  'r0', 'r1', 'r2',
  'c0', 'c1', 'c2',
  'd0', 'd1',
];

function resetGame() {
  turn = 0;
  boardState = { x: '', o: '' };

  const board = document.querySelector('#board');
  const rows = board.rows;

  for (const row of rows) {
    const cells = row.cells;

    for (const cell of cells) {
      cell.textContent = '';
    }
  }
}

function checkWin() {
  const piece = (turn % NUM_PLAYERS === 0) ? 'o' : 'x';

  let win = false;
  for (let arrangement of arrangements) {
    const regex = new RegExp(arrangement, 'g');
    const count = (boardState[piece].match(regex) || []).length;

    win ||= (count === 3);
  }

  if (!win && turn !== NUM_CELLS) {
    return;
  } else if (win) {
    alert(piece + ' wins!');
  } else {
    alert('The game ended in a draw!');
  }

  resetGame();
}

function addPiece(event) {
  const cell = event.target;

  if (cell.textContent !== '') {
    return;
  }

  const piece = (turn % NUM_PLAYERS === 0) ? 'o' : 'x';
  cell.textContent = piece;

  const row = cell.parentNode.rowIndex;
  const column = cell.cellIndex;

  boardState[piece] += `r${row}`;
  boardState[piece] += `c${column}`;

  if (row === column) {
    boardState[piece] += 'd0';
  }

  if (row + column === BOARD_DIMENSION - 1) {
    boardState[piece] += 'd1';
  }

  checkWin();
  turn += 1;
}

function renderBoardDOM() {
  const board = document.createElement('table');
  board.setAttribute('id', 'board');

  for (let i = 0; i < BOARD_DIMENSION; ++i) {
    const row = document.createElement('tr')

    for (let j = 0; j < BOARD_DIMENSION; ++j) {
      const cell = document.createElement('td');
      cell.addEventListener('click', addPiece);

      row.appendChild(cell);
    }

    board.appendChild(row);
  }

  const game = document.querySelector('#game');
  game.appendChild(board);
}

window.onload = () => {
  renderBoardDOM();
  resetGame();
};
