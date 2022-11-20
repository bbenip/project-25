const BOARD_DIMENSION = 19;

const setupBoardDom = () => {
  const table = document.createElement('table');
  table.setAttribute('id', 'board');

  for (let i = 0; i < BOARD_DIMENSION; ++i) {
    const row = document.createElement('tr');

    for (let j = 0; j < BOARD_DIMENSION; ++j) {
      const cell = document.createElement('td');

      const piece = document.createElement('div');
      const lineHorizontal = document.createElement('div');
      const lineVertical = document.createElement('div');

      piece.setAttribute('class', 'piece piece-blank');
      lineHorizontal.setAttribute('class', 'line-horizontal');
      lineVertical.setAttribute('class', 'line-vertical');

      cell.appendChild(piece);
      cell.appendChild(lineHorizontal);
      cell.appendChild(lineVertical);

      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  document.querySelector('#game').appendChild(table);
};

window.onload = () => {
  setupBoardDom();
};
