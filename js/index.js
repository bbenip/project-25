const projects = [
  '2048',
  'Sliding Puzzle',
  'Snake',
  'Flood-It!',
  'Pong',
  'Tic-Tac-Toe',
];

window.onload = () => {
  for (const [index, project] of Object.entries(projects)) {
    const number = projects.length - index;
    const file = 'game' + number + '.html';
    const link = '<a href="' + file + '">' + project + '</a>';
    const entry = '<p>Game ' + number + ': ' + link + '</p>';

    document.getElementById('project-list').innerHTML += entry;
  }
};
