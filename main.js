document.addEventListener(
  "DOMContentLoaded",
  async () => {
    loadSkillsPage();
    loadProjectsPage();
    loadResearchPage();
  },
  false
);

function loadSkillsPage() {
  var skills = [
    { name: "C", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg" },
    { name: "C++", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "Java", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "Python", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "HTML", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg" },
    { name: "ReactJs", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "AngularJs", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
    { name: "NodeJs", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "ExpressJs", image: "./assets/express.png" },
    { name: "MongoDB", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg" },
    { name: "Matlab", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" },
    { name: "Git", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", image: "./assets/github.png" },
    { name: "Discord.js", image: "./assets/discord.png" },
    { name: "VS Code", image: "./assets/vs_code.svg" },
    { name: "Manjaro", image: "https://user-images.githubusercontent.com/63140632/145705669-2050df14-6b64-44a9-aa66-dd62bafb4936.png" },
    { name: "NextJs", image: "https://user-images.githubusercontent.com/63140632/159057943-66bda3ce-5f77-41e7-814e-fc57f6e3540a.svg" },
    { name: "SASS", image: "https://user-images.githubusercontent.com/63140632/159058821-9e2c882c-b0cd-4248-9ec5-5f87c32e4f3c.svg" },
    { name: "JQuery", image: "https://user-images.githubusercontent.com/63140632/138343999-b14291bb-a436-47c8-8b6e-8e27843f2228.png" },
    { name: "Tailwind", image: "https://user-images.githubusercontent.com/63140632/155379705-ba343eb1-9336-49ed-8cb2-14e476320433.svg" },
    { name: "MySQL", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg" },
    { name: "IntelliJ", image: "https://user-images.githubusercontent.com/63140632/159059401-30767299-0aff-471b-a4d5-f0cf1b740902.svg" },
    { name: "Figma", image: "https://user-images.githubusercontent.com/63140632/159059723-a6c20188-ea00-45b0-a930-fbcf1a4e804d.svg" },
  ];

  var allSkills = document.getElementById("all-skills");

  for (var i = 0; i < skills.length; i++) {
    var element = document.createElement("div");
    element.classList.add("skill-card");
    element.innerHTML = `
            <img src="${skills[i].image}" alt="${skills[i].name}">
            <p>${skills[i].name}</p>
        `;
    allSkills.appendChild(element);
  }
}

function loadProjectsPage() {
  projects = [
    {
      title: "ADG-VIT Official Website",
      image: "./assets/adg-official.png",
      description:
        "The official website of Apple Developers Group, VIT Technical Club. Built using ReactJs and various npm packages.",
      deploy: "https://adgvit.com",
      repo: "https://github.com/ADG-VIT/ADG-VIT-Website",
    },
    {
      title: "DC Official Website",
      image: "./assets/dc-official.png",
      description:
        "Contributing to and maintaining the official website for Design and Code built using ReactJs.",
      deploy: "",
      repo: "https://github.com/csivitu/CCS-Frontend-2022",
    },
    {
      title: "Core Committee Selections",
      image: "./assets/ccs-csivit.png",
      description:
        "The official website for Core Committee Selections for CSI-VIT built using MERN stack.",
      deploy: "",
      repo: "https://github.com/csivitu/CCS-Frontend-2022",
    },
    {
      title: "Otôbus",
      image: "./assets/otobus.png",
      description:
        "A MEAN Stack project for Bus Management System having features like view, book and cancel buses.",
      deploy: "https://designandcode.us",
      repo: "https://github.com/Design-and-Code/Design-and-Code",
    },
    {
      title: "Riddler Frontend 2021",
      image: "./assets/riddler.png",
      description:
        "Frontend of Riddler game website made using ReactJs framework and various npm packages.",
      deploy: "",
      repo: "https://github.com/csivitu/riddler-frontend-2021",
    },
    {
      title: "Portfolio Website",
      image: "./assets/portfolio.png",
      description:
        "Portfolio website to display my skills, projects, research work, etc built using HTML, CSS and JavaScript.",
      deploy: "https://www.nimish-jain.com/",
      repo: "https://github.com/nimishjn/portfolio/",
    },
    {
      title: "Links",
      image: "./assets/links.png",
      description: "Used to host all my skills and links in one website.",
      deploy: "https://links.nimish-jain.com/",
      repo: "https://github.com/nimishjn/links/",
    },
  ];

  var allProjects = document.getElementById("all-projects");

  for (var i = 0; i < projects.length; i++) {
    var element = document.createElement("div");
    element.classList.add("project-card");
    element.innerHTML = `
            <img src="${projects[i].image}" alt="${projects[i].title}">
            <h2>${projects[i].title}</h2>
            <p>${projects[i].description}</p>
            <div class="project-buttons">
                ${
                  projects[i].deploy !== ""
                    ? `<a id="deploy-button" href="${projects[i].deploy}" target="_blank"><i class="fas fa-eye"></i> View</a>`
                    : ``
                }
                ${
                  projects[i].repo !== ""
                    ? `<a href="${projects[i].repo}" id="code-button" target="_blank"><i class="fas fa-file-code"></i> Code</a>`
                    : ``
                }
            </div>
        `;
    allProjects.appendChild(element);
  }
}

function loadResearchPage() {
  researchProfiles = [
    {
      name: "ORCID iD",
      logo: "<i class='fab fa-orcid'></i>",
      link: "https://orcid.org/0000-0001-9607-0764",
    },
    {
      name: "Google Scholar",
      logo: "<i class='fas fa-graduation-cap'></i>",
      link: "https://scholar.google.com/citations?user=oKBKRQ0AAAAJ&hl=en",
    },
    {
      name: "ResearchGate",
      logo: "<i class='fab fa-researchgate'></i>",
      link: "https://www.researchgate.net/profile/Nimish-Jain-4",
    },
    {
      name: "Publons",
      logo: "<i class='fas fa-file-powerpoint'></i>",
      link: "https://publons.com/researcher/4167049/nimish-jain/",
    },
    {
      name: "SciProfiles",
      logo: "<i class='fas fa-graduation-cap'></i>",
      link: "https://sciprofiles.com/profile/1689275",
    },
  ];

  var allResearchProfiles = document.getElementById("all-research-profiles");

  for (var i = 0; i < researchProfiles.length; i++) {
    var element = document.createElement("a");
    element.rel = "noreferrer noopener";
    element.href = `${researchProfiles[i].link}`;
    element.target = "_blank";
    element.innerHTML = `
            <div class="research-card">
                ${researchProfiles[i].logo}
                <p>${researchProfiles[i].name}</p>
                <i class="fas fa-angle-right"></i>
            </div>
        `;
    allResearchProfiles.appendChild(element);
  }

  researchPapers = [
    {
      title:
        "Modeling of Predictable Variations in Multi-Time Instant Ambient Temperature Time Series",
      link: "https://ieeexplore.ieee.org/document/9404497",
      logo: "<i class='fas fa-file-alt'></i>",
    },
    {
      title:
        "Performance Comparison of Two Statistical Parametric Methods for Outlier Detection and Correction",
      link: "https://www.sciencedirect.com/science/article/pii/S2405896321014919",
      logo: "<i class='fas fa-file-alt'></i>",
    },
    {
      title:
        "New Performance Evaluation Metrics for Outlier Detection and Correction",
      link: "https://link.springer.com/chapter/10.1007/978-981-16-9033-4_63",
      logo: "<i class='fas fa-file-alt'></i>",
    },
  ];

  var allResearchPapers = document.getElementById("all-research-papers");

  for (var i = 0; i < researchPapers.length; i++) {
    var element = document.createElement("a");
    element.rel = "noreferrer noopener";
    element.href = `${researchPapers[i].link}`;
    element.target = "_blank";
    element.innerHTML = `
            <div class="research-card">
                ${researchPapers[i].logo}
                <p>${researchPapers[i].title}</p>
                <i class="fas fa-angle-right"></i>
            </div>
        `;
    allResearchPapers.appendChild(element);
  }
}

function darkModeSwitch() {
  var element = document.getElementById("dark-mode-switch");
  setTimeout(function () {
    element.style.opacity = 0;
    setTimeout(function () {
      if (element.name == "dark") {
        element.innerHTML = '<i class="fas fa-sun"></i>';
        element.name = "light";
        document.documentElement.style.setProperty(
          "--background1",
          "var(--white1)"
        );
        document.documentElement.style.setProperty(
          "--background2",
          "var(--white2)"
        );
        document.documentElement.style.setProperty("--text", "var(--black1)");
        document.documentElement.style.setProperty(
          "--navbar",
          "var(--navbar-light)"
        );
      } else {
        element.innerHTML = '<i class="fas fa-moon"></i>';
        element.name = "dark";
        document.documentElement.style.setProperty(
          "--background1",
          "var(--black1)"
        );
        document.documentElement.style.setProperty(
          "--background2",
          "var(--black2)"
        );
        document.documentElement.style.setProperty("--text", "var(--white1)");
        document.documentElement.style.setProperty(
          "--navbar",
          "var(--navbar-dark)"
        );
      }
      element.style.opacity = 1;
    }, 250);
  });
}

function openNavbar() {
  var nav = document.getElementById("mobile-navbar");
  nav.style.transform = "translateX(-200px)";
}

function closeNavbar() {
  var nav = document.getElementById("mobile-navbar");
  nav.style.transform = "translateX(0px)";
}

const scriptURL =
  "https://script.google.com/macros/s/AKfycbxhd-eQtInVaoQ_hWsLtgQSt7oEXjMMUkASrd2k-gObhuGQZx9STGuh_kX13yE9lLeVrA/exec";
const form = document.forms["say-hi-form"];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => notification("Your message has been received!"))
    .catch((error) => notification("Some error occured on form submit!"));

  form.reset();
});

async function notification(message) {
  const element = document.createElement("div");
  element.id = "notification";
  element.innerHTML = `
    <h1>${message}</h1>
    `;
  document.querySelector("body").appendChild(element);
  setTimeout(() => {
    document.querySelector("body").removeChild(element);
  }, 5000);
}
