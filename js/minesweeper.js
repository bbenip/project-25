const BOARD_NUM_CELLS_X = 10;
const BOARD_NUM_CELLS_Y = 10;

function renderBoardDOM() {
  const board = document.createElement('table');

  for (let i = 0; i < BOARD_NUM_CELLS_Y; ++i) {
    const row = document.createElement('tr');

    for (let j = 0; j < BOARD_NUM_CELLS_X; ++j) {
      const cell = document.createElement('td');
      row.appendChild(cell);
    }

    board.appendChild(row);
  }

  document.querySelector('#game').appendChild(board);
}

window.onload = () => {
  renderBoardDOM();
};
