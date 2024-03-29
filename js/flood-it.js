const COLORS = [
  'BLUE',
  'PURPLE',
  'YELLOW',
  'RED',
  'GREEN',
  'PINK',
];

const COLOR_VALUE_MAP = {
  BLUE:   'rgb(70, 177, 226)',
  PURPLE: 'rgb(96, 92, 168)',
  YELLOW: 'rgb(243, 246, 29)',
  RED:    'rgb(220, 74, 32)',
  GREEN:  'rgb(126, 157, 30)',
  PINK:   'rgb(237, 112, 161)',
};

const VALUE_COLOR_MAP = {
  'rgb(70, 177, 226)':  'BLUE',
  'rgb(96, 92, 168)':   'PURPLE',
  'rgb(243, 246, 29)':  'YELLOW',
  'rgb(220, 74, 32)':   'RED',
  'rgb(126, 157, 30)':  'GREEN',
  'rgb(237, 112, 161)': 'PINK',
};

const DEFAULT_COLOR = 'rgb(0, 0, 0)';
const TOTAL_STEPS = 22;

const game = {
  color: DEFAULT_COLOR,
  grid: [],
  captured: [],
  stepsLeft: TOTAL_STEPS,
};

const GRID_DIMENSION = 12;

game.grid = new Array(GRID_DIMENSION);
for (let i = 0; i < GRID_DIMENSION; ++i) {
  game.grid[i] = new Array(GRID_DIMENSION);
}

function isValidCoordinate(x, y) {
  return (
    (x >= 0 && x < GRID_DIMENSION)
    && (y >= 0 && y < GRID_DIMENSION)
  );
}

function capture() {
  for (const [x, y] of game.captured) {
    const neighbours = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [nX, nY] of neighbours) {
      if (
        isValidCoordinate(nX, nY)
        && game.grid[nX][nY].color === game.color
        && !game.grid[nX][nY].isCaptured
      ) {
        game.grid[nX][nY].isCaptured = true;
        game.captured.push([nX, nY]);
      }
    }
  }
}

function renderGrid() {
  const table = document.querySelector('#grid');

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    const row = table.childNodes[i];

    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const cell = row.childNodes[j];

      cell.style.backgroundColor =
        COLOR_VALUE_MAP[game.grid[i][j].color];
    }
  }
}

function renderCounter() {
  const stepCounter = document.querySelector('#step-counter');
  stepCounter.textContent = `Steps Left: ${game.stepsLeft}`;
}

function resetGame() {
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      game.grid[i][j] = game.grid[i][j] || {};

      game.grid[i][j].color =
        COLORS[Math.floor(Math.random() * COLORS.length)];
      game.grid[i][j].isCaptured = false;
    }
  }

  // Initialize game with top-left corner
  game.captured = [[0, 0]];
  game.grid[0][0].isCaptured = true;
  game.color = game.grid[0][0].color;
  game.stepsLeft = TOTAL_STEPS;

  capture();
  renderCounter();
  renderGrid();
}

function setColor(event) {
  const rawColor = event.target.style.backgroundColor;
  const color = VALUE_COLOR_MAP[rawColor];

  if (color === game.color) return;

  game.color = color;
  game.stepsLeft -= 1;
  renderCounter();

  for (const [x, y] of game.captured) {
    game.grid[x][y].color = color;
  }

  capture();
  renderGrid();

  if (game.captured.length === GRID_DIMENSION * GRID_DIMENSION) {
    alert(`You win with ${game.stepsLeft} steps left!`);
    resetGame();
  }

  if (game.stepsLeft === 0) {
    alert('Game over!');
    resetGame();
  }
}

window.onload = () => {
  // Set grid for game
  const table = document.createElement('table');
  table.id = 'grid';

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    const row = document.createElement('tr');

    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const cell = document.createElement('td');
      cell.addEventListener('click', setColor);
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  // Set color palette
  const palette = document.createElement('div');
  palette.id = 'palette';

  for (let color of COLORS) {
    const colorButton = document.createElement('span');
    colorButton.style.backgroundColor = COLOR_VALUE_MAP[color];
    colorButton.addEventListener('click', setColor);

    palette.appendChild(colorButton);
  }

  const gameContainer = document.querySelector('#game');
  gameContainer.appendChild(table);
  gameContainer.appendChild(palette);

  resetGame();
};
