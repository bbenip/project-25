const projects = [
  "Tic-Tac-Toe",
];

window.onload = () => {
  projects.reverse().forEach((project, index) => {
    const day = projects.length - index;
    const file = "day" + day + ".html";

    const link = "<a href=\"" + file + "\">" + project + "</a>";
    const entry = "<p>Day " + day + ": " + link + "</p>";

    document.getElementById("project-list").innerHTML += entry;
  });
};
