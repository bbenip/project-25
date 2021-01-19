const BOARD_DIMENSION = 3;
const NUM_PLAYERS = 2;
const NUM_CELLS = BOARD_DIMENSION * BOARD_DIMENSION;

let turn = 1;
let boardState = {
  x: '',
  o: '',
};

const arrangements = [
  'v0', 'v1', 'v2',
  'h0', 'h1', 'h2',
  'd0', 'd1',
];

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

  turn = 0;
  boardState = { x: '', o: '' };

  for (let i = 0; i < NUM_CELLS; ++i) {
    document.querySelector(`#cell${i}`).textContent = '';
  }
}

function addPiece(event) {
  const cell = event.target;

  if (cell.textContent !== '') {
    return;
  }

  const piece = (turn % NUM_PLAYERS === 0) ? 'o' : 'x';
  cell.textContent = piece;

  const cellNumber = Number(cell.id.match(/\d+/)[0]);
  const v = cellNumber % BOARD_DIMENSION;
  const h = ~~(cellNumber / BOARD_DIMENSION);

  boardState[piece] += `v${v}`;
  boardState[piece] += `h${h}`;

  if (v === h) {
    boardState[piece] += 'd0';
  }

  if (v + h === BOARD_DIMENSION - 1) {
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
      cell.setAttribute('id', `cell${i * BOARD_DIMENSION + j}`);

      row.appendChild(cell);
    }

    board.appendChild(row);
  }

  const game = document.querySelector('#game');
  game.appendChild(board);
}

window.onload = () => {
  renderBoardDOM();
};
