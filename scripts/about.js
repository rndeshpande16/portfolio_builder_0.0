var typewriterNames = new Typewriter(".typewrite-names", {
  loop: true,
  delay: 75,
  strings: ["Ruturaaj Deshpande", "Sahil Pojee", "Awdhoot Prasad"],
  autoStart: true,
});

var typewriterFeatures = new Typewriter(".typewrite-features", {
  loop: true,
  delay: 75,
  strings: [
    "Choose favorite theme",
    "Customize fonts",
    "Preview Website",
    "Download Zipped Website",
  ],
  autoStart: true,
});

const loginBtn = document.getElementById("login");
const formOverlay = document.querySelector(".form-overlay");
const formSubmit = document.getElementById("form-submit");
const loggedUserName = document.querySelector("#login-user-name");
const logout = document.querySelector("#logout");
const closeBtn = document.getElementById("close-modal");

loadUserData();

loginBtn.addEventListener("click", () => {
  formOverlay.style.display = "flex";
});

formSubmit.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameValue = document.getElementById("username").value;
  const goalValue = document.getElementById("usergoal").value;

  localStorage.setItem("username", nameValue);
  localStorage.setItem("usergoal", goalValue);

  formOverlay.style.display = "none";
  loadUserData();
});

function loadUserData() {
  const storedName = localStorage.getItem("username");

  if (storedName) {
    if (loggedUserName) {
      loggedUserName.innerText = "Hello " + storedName + "!";
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
  formOverlay.style.display = "none";
});
