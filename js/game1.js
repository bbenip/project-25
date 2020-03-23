const DIMENSION = 3;
const NUM_PLAYERS = 2;
const NUM_CELLS = DIMENSION * DIMENSION;

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
    const count = (boardState[piece].match(regex) || []).length

    if (count === 3) win = true;
  }

  if (win) alert(piece + ' wins!');
  if (!win && turn === NUM_CELLS) alert('The game ended in a draw!');
  if (!win && turn !== NUM_CELLS) return;

  for (let i = 0; i < NUM_CELLS; ++i) {
    turn = 0;
    document.getElementById('cell' + i).innerHTML = '';
    boardState = { x: '', o: '' };
  }
}

function addPiece() {
  if (this.innerHTML !== '') return;

  const piece = (turn % NUM_PLAYERS === 0) ? 'o' : 'x';
  this.innerHTML = piece;

  const cellNumber = Number(this.id.match(/\d+/)[0]);
  const v = cellNumber % DIMENSION;
  const h = ~~(cellNumber / DIMENSION);

  boardState[piece] += 'v' + v;
  boardState[piece] += 'h' + h;

  if (v === h) boardState[piece] += 'd0';
  if (v + h === DIMENSION - 1) boardState[piece] += 'd1';

  checkWin();
  ++turn;
}

window.onload = () => {
  for (let i = 0; i < NUM_CELLS; ++i) {
    document.getElementById('cell' + i).addEventListener('click', addPiece);
  }
};
