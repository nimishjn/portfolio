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

function darkModeSwitch() {
    var element = document.getElementById('dark-mode-switch');
    setTimeout(function () {
        element.style.opacity = 0;
        setTimeout(function() {
            if(element.name == 'dark') {
                element.innerHTML = '<i class="fas fa-sun"></i>';
                element.name = 'light';
                document.documentElement.style.setProperty('--background1', 'var(--white1)');
                document.documentElement.style.setProperty('--background2', 'var(--white2)');
                document.documentElement.style.setProperty('--text', 'var(--black1)');
            } else {
                element.innerHTML = '<i class="fas fa-moon"></i>';
                element.name = 'dark';
                document.documentElement.style.setProperty('--background1', 'var(--black1)');
                document.documentElement.style.setProperty('--background2', 'var(--black2)');
                document.documentElement.style.setProperty('--text', 'var(--white1)');
            }
            element.style.opacity = 1;
        }, 250);
    });
}

function openNavbar() {
    var nav = document.getElementById('mobile-navbar');
    nav.style.transform = 'translateX(-200px)';
}

function closeNavbar() {
    var nav = document.getElementById('mobile-navbar');
    nav.style.transform = 'translateX(0px)';
}