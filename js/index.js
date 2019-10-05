const projects = [];

window.onload = () => {
  projects.reverse().forEach((project, index) => {
    const day = projects.length - index;
    const file = project.toLowerCase() + ".html";

    const link = "<a href=\"" + file + "\">" + project + "</a>";
    const entry = "<p>Day " + day + ": " + link + "</p>";

    document.getElementById("project-list").innerHTML += entry;
  });
};
