document.addEventListener("DOMContentLoaded", async () => {
    loadSkillsPage();
    loadProjectsPage();
    loadResearchPage();
}, false);

function loadSkillsPage() {
    var skills = [{name: "C", image: "./assets/c.png"},
                  {name: "C++", image: "./assets/cpp.png"},
                  {name: "Java", image: "./assets/java.png"},
                  {name: "Python", image: "./assets/python.png"},
                  {name: "HTML", image: "./assets/HTML5.png"},
                  {name: "CSS", image: "./assets/css3.png"},
                  {name: "JavaScript", image: "./assets/javascript.png"},
                  {name: "Matlab", image: "./assets/matlab.png"},
                  {name: "Git", image: "./assets/git.png"},
                  {name: "GitHub", image: "./assets/github.png"},
                  {name: "Discord.py", image: "./assets/discord.png"}
                ];
    
    var allSkills = document.getElementById('all-skills');

    for(var i = 0; i < skills.length; i++) {
        var element = document.createElement('div');
        element.classList.add('skill-card');
        element.innerHTML = `
            <img src="${skills[i].image}" alt="${skills[i].name}">
            <p>${skills[i].name}</p>
        `;
        allSkills.appendChild(element);
    }
}

function loadProjectsPage() {

}

function loadResearchPage() {

}