const projects = [
  'Flappy Bird',
  'Reversi',
  '2048',
  'Sliding Puzzle',
  'Snake',
  'Flood-It!',
  'Pong',
  'Tic-Tac-Toe',
];

function getFilename(project) {
  let filename = project.toLowerCase();
  filename = filename.replace(/ /g, '-');
  filename = filename.replace(/!/g, '');

  if (!isNaN(filename)) {
    filename = 'game' + filename;
  }

  return filename;
}

window.onload = () => {
  for (const [index, project] of Object.entries(projects)) {
    const number = projects.length - index;
    const filename = getFilename(project) + '.html';
    const link = '<a href="' + filename + '">' + project + '</a>';
    const entry = '<p>Game ' + number + ': ' + link + '</p>';

    document.getElementById('project-list').innerHTML += entry;
  }
};
