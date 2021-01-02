const projects = [
  'Tic-Tac-Toe',
  'Pong',
  'Flood-It!',
  'Snake',
  'Sliding Puzzle',
  '2048',
  'Reversi',
  'Flappy Bird',
  'Connect 4',
  'Tron',
  'Tetris',
];

function getFilename(project) {
  let filename = project.toLowerCase();
  filename = filename.replace(/ /g, '-');
  filename = filename.replace(/!/g, '');

  if (!isNaN(filename)) {
    filename = `game-${filename}`;
  }

  return `${filename}.html`;
}

window.onload = () => {
  projects.forEach((project, index) => {
    const gameHyperlink = document.createElement('a');
    gameHyperlink.href = getFilename(project);
    gameHyperlink.textContent = project;

    const gameEntry = document.createElement('p');
    gameEntry.textContent = `Game ${index + 1}: `;
    gameEntry.appendChild(gameHyperlink);

    document.querySelector('#project-list').prepend(gameEntry);
  });
};
