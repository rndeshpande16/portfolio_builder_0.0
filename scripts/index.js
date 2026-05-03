document.addEventListener("DOMContentLoaded", () => {
  const text1 = document.getElementById("text1");
  const text2 = document.getElementById("text2");
  const text3 = document.getElementById("text3");
  const text4 = document.getElementById("text4");

  const q1 = document.getElementById("q1");
  const q2 = document.getElementById("q2");
  const q3 = document.getElementById("q3");
  const q4 = document.getElementById("q4");
  const q5 = document.getElementById("q5");

  q1.addEventListener("click", () => {
    const ans = document.getElementById("ans-1");
    if (ans.style.height == "0px") {
      ans.style.height = "auto";
      ans.style.opacity = 1;
    } else {
      ans.style.height = "0px";
      ans.style.opacity = 0;
    }
  });
  q2.addEventListener("click", () => {
    const ans = document.getElementById("ans-2");
    if (ans.style.height == "0px") {
      ans.style.height = "auto";
      ans.style.opacity = 1;
    } else {
      ans.style.height = "0px";
      ans.style.opacity = 0;
    }
  });
  q3.addEventListener("click", () => {
    const ans = document.getElementById("ans-3");
    if (ans.style.height == "0px") {
      ans.style.height = "auto";
      ans.style.opacity = 1;
    } else {
      ans.style.height = "0px";
      ans.style.opacity = 0;
    }
  });
  q4.addEventListener("click", () => {
    const ans = document.getElementById("ans-4");
    if (ans.style.height == "0px") {
      ans.style.height = "auto";
      ans.style.opacity = 1;
    } else {
      ans.style.height = "0px";
      ans.style.opacity = 0;
    }
  });

  setContent(
    text1,
    "Live Code Demos",
    "Embed interactive demos of projects directly on the site. This proves hands-on capability and lets recruiters experience the work without setup.",
  );
  setContent(
    text2,
    "Tech Stack Badges",
    "Display concise badges for languages, frameworks, and tools used. This quickly communicates expertise and helps match to role requirements.",
  );
  setContent(
    text3,
    "Case Study Write-ups",
    "Provide detailed project narratives covering problem, approach, architecture, and results. This shows depth of thinking and engineering decision-making.",
  );
  setContent(
    text4,
    "GitHub Integration",
    "Auto-pull pinned repositories, commits, and contribution graphs. This adds credibility and keeps the portfolio fresh with real activity.",
  );

  function setContent(el, title, desc) {
    if (!el) return;
    el.classList.add("fade-out");

    setTimeout(() => {
      el.innerHTML = "";

      const h = document.createElement("h2");
      h.innerText = title;

      const p = document.createElement("p");
      p.innerText = desc;

      el.append(h, p);

      el.classList.remove("fade-out");
    }, 300);
  }

  let button1 = document.getElementById("text1-button");
  let button2 = document.getElementById("text2-button");
  let button3 = document.getElementById("text3-button");
  let button4 = document.getElementById("text4-button");

  button1.addEventListener("click", () => {
    button1.classList.add("active");
    button2.classList.remove("active");
    button4.classList.remove("active");
    button3.classList.remove("active");
    setContent(
      text1,
      "Live Code Demos",
      "Embed interactive demos of projects directly on the site. This proves hands-on capability and lets recruiters experience the work without setup.",
    );
    setContent(
      text2,
      "Tech Stack Badges",
      "Display concise badges for languages, frameworks, and tools used. This quickly communicates expertise and helps match to role requirements.",
    );
    setContent(
      text3,
      "Case Study Write-ups",
      "Provide detailed project narratives covering problem, approach, architecture, and results. This shows depth of thinking and engineering decision-making.",
    );
    setContent(
      text4,
      "GitHub Integration",
      "Auto-pull pinned repositories, commits, and contribution graphs. This adds credibility and keeps the portfolio fresh with real activity.",
    );
  });

  button2.addEventListener("click", () => {
    button2.classList.add("active");
    button1.classList.remove("active");
    button3.classList.remove("active");
    button4.classList.remove("active");
    setContent(
      text1,
      "Service Packages",
      "Present clear, tiered service offerings with deliverables and outcomes. This reduces friction and helps buyers self-select the right option.",
    );
    setContent(
      text2,
      "Client Logos & Testimonials",
      "Show recognizable logos and short quotes from happy clients. This builds social proof and lowers perceived risk.",
    );
    setContent(
      text3,
      "ROI Case Studies",
      "Highlight measurable before-and-after results with business metrics. This ties your value to outcomes.",
    );
    setContent(
      text4,
      "Quote Request Form",
      "Provide a guided intake form that qualifies leads and captures requirements.",
    );
  });

  button3.addEventListener("click", () => {
    button3.classList.add("active");
    button1.classList.remove("active");
    button2.classList.remove("active");
    button4.classList.remove("active");
    setContent(
      text1,
      "Resume Download",
      "Offer a clean, ATS-friendly PDF and DOCX resume. This ensures easy sharing while preserving formatting for screening systems.",
    );
    setContent(
      text2,
      "Skills Matrix",
      "Present proficiency levels across core skills with evidence links. This helps recruiters quickly map you to role competencies.",
    );
    setContent(
      text3,
      "Targeted Projects",
      "Curate projects aligned to the specific roles you seek. This focuses attention on the most relevant achievements and increases fit.",
    );
    setContent(
      text4,
      "Availability Scheduler",
      "Embed a calendar link for interviews and coffee chats. This removes scheduling friction and speeds up the hiring process.",
    );
  });

  button4.addEventListener("click", () => {
    button4.classList.add("active");
    button1.classList.remove("active");
    button2.classList.remove("active");
    button3.classList.remove("active");
    setContent(
      text1,
      "Visual Grid Gallery",
      "Showcase work in a clean, responsive image grid with filters. This lets visitors quickly scan your aesthetic and find relevant pieces.",
    );
    setContent(
      text2,
      "Process Walkthroughs",
      "Detail discovery, sketches, wireframes, and iterations per project. This demonstrates design thinking and how you solve problems.",
    );
    setContent(
      text3,
      "Interactive Prototypes",
      "Embed Figma or prototype links for hands-on exploration. This conveys interactivity and user flow better than static images.",
    );
    setContent(
      text4,
      "Style Guide Page",
      "Present typography, color systems, components, and spacing tokens. This proves systems thinking and readiness for scalable design work.",
    );
  });

  // const loginBtn = document.getElementById("login");
  const formOverlay = document.querySelector(".form-overlay");
  const formSubmit = document.getElementById("form-submit");
  const loggedUserName = document.querySelector("#login-user-name");
  const logout = document.querySelector("#logout");
  const closeBtn = document.getElementById("close-modal");

  loadUserData();

  loggedUserName.addEventListener("click", () => {
    // formOverlay.style.display = "flex";
    formOverlay.style.zIndex = 100;
    formOverlay.style.opacity = 1;
  });

  formSubmit.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameValue = document.getElementById("username").value;
    const goalValue = document.getElementById("usergoal").value;

    localStorage.setItem("username", nameValue);
    localStorage.setItem("usergoal", goalValue);

    // formOverlay.style.display = "none";
    formOverlay.style.zIndex = -20;
    formOverlay.style.opacity = 0;
    loadUserData();
  });

  function loadUserData() {
    const storedName = localStorage.getItem("username");

    if (storedName) {
      if (loggedUserName) {
        loggedUserName.innerText = "Hello " + storedName.split(" ")[0] + "!";
      }
      logout.style.display = "block";
      logOut();
    }
  }

  function logOut() {
    logout.onclick = () => {
      localStorage.clear();
      window.location.reload();
    };
  }

  closeBtn.addEventListener("click", () => {
    formOverlay.style.zIndex = -20;
    formOverlay.style.opacity = 0;
  });
});

window.addEventListener(
  "scroll",
  () => {
    document.body.style.setProperty(
      "--scroll",
      window.pageYOffset / (document.body.offsetHeight - window.innerHeight),
    );
  },
  false,
);

window.onload = () => {
  document.getElementsByName("username")[0].value =
    localStorage.getItem("username");
  document.getElementsByName("usergoal")[0].value =
    localStorage.getItem("usergoal");
};
