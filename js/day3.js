const COLORS = [
  "BLUE",
  "PURPLE",
  "YELLOW",
  "RED",
  "GREEN",
  "PINK"
];

const COLOR_VALUE_MAP = {
  BLUE:   "rgb(70, 177, 226)",
  PURPLE: "rgb(96, 92, 168)",
  YELLOW: "rgb(243, 246, 29)",
  RED:    "rgb(220, 74, 32)",
  GREEN:  "rgb(126, 157, 30)",
  PINK:   "rgb(237, 112, 161)"
};

const GRID_DIMENSION = 12;

const gridData = new Array(GRID_DIMENSION);
for (let i = 0; i < GRID_DIMENSION; ++i) {
  gridData[i] = new Array(GRID_DIMENSION);
}

function resetGrid() {
  for (let i = 0; i < GRID_DIMENSION; ++i) {
    for (let j = 0; j < GRID_DIMENSION; ++j) {
      gridData[i][j] = COLORS[
        Math.floor(Math.random() * COLORS.length)
      ];
    }
  }
}

window.onload = () => {
  resetGrid();

  // Set grid for game
  const table = document.createElement("table");

  for (let i = 0; i < GRID_DIMENSION; ++i) {
    const row = document.createElement("tr");

    for (let j = 0; j < GRID_DIMENSION; ++j) {
      const cell = document.createElement("td");
      cell.style.backgroundColor = COLOR_VALUE_MAP[gridData[i][j]];
      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  // Set color palette
  const palette = document.createElement("div");
  palette.id = "palette";

  for (let color of COLORS) {
    const colorButton = document.createElement("span");
    colorButton.style.backgroundColor = COLOR_VALUE_MAP[color];

    palette.appendChild(colorButton);
  }

  const game = document.getElementById("game");
  game.appendChild(table);
  game.appendChild(palette);
};
