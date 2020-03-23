const projects = [
  'Tic-Tac-Toe',
  'Pong',
  'Flood-It!',
  'Snake',
  'Sliding Puzzle',
];

window.onload = () => {
  projects.reverse().forEach((project, index) => {
    const number = projects.length - index;
    const file = 'game' + number + '.html';

    const link = '<a href="' + file + '">' + project + '</a>';
    const entry = '<p>Game ' + number + ': ' + link + '</p>';

    document.getElementById('project-list').innerHTML += entry;
  });
};
