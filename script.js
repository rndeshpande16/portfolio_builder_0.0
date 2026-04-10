let currentPage = "home";
var portfolio = {};

async function start() {
  setupIframe();
  portfolio = {
    home: await loadContent("homesection"),
    contact: await loadContent("contact"),
    nav: await loadContent("navsection"),
  };

  setTimeout(function () {
    loadPage("home");
  }, 200);
}

function setupIframe() {
  const iframe = document.getElementById("show");
  const idoc = iframe.contentDocument;
  const propertySec = document.getElementById("properties");
  const theme = localStorage.getItem("theme") || "ocean";
  idoc.open();
  idoc.write(
    `<!DOCTYPE html><html lang='en'><head><link rel='stylesheet' href='themes.css' /></head><body data-theme='${theme}' style='transition: 0.3s all ease; margin:0; padding:0; min-height: 100vh; width: 100%; box-sizing: border-box;'></body></html>`,
  );
  idoc.close();
  idoc.body.addEventListener("dragenter", function (ev) {
    ev.preventDefault();
  });

  idoc.body.addEventListener("dragover", function (ev) {
    ev.preventDefault();
  });

  idoc.body.addEventListener("drop", function (ev) {
    ev.preventDefault();
    var h = ev.dataTransfer.getData("text/html");
    var c = ev.dataTransfer.getData("text/component");
    var comps = JSON.parse(localStorage.getItem(currentPage)) || [];
    if (h) {
      comps.push([c, h]);
      var htmlString = "";
      var props = "";
      comps.forEach((comp) => {
        htmlString += comp[1];
        props += `<li>${comp[0]}</li>`;
      });
      propertySec.innerHTML = props;
      idoc.body.innerHTML = htmlString;
      savePage(currentPage, comps);
    }
  });
}

async function loadContent(name) {
  try {
    const response = await fetch("components/" + name + ".html");
    const htmlString = await response.text();

    const parser = new DOMParser();
    const virtualDoc = parser.parseFromString(htmlString, "text/html");
    const fetchedStyles = virtualDoc.querySelectorAll(
      'style, link[rel="stylesheet"]',
    );

    const iframeHead = document.getElementById("show").contentDocument.head;

    fetchedStyles.forEach((styleNode) => {
      iframeHead.insertBefore(styleNode.cloneNode(true), iframeHead.firstChild);
    });

    return virtualDoc.body.innerHTML;
  } catch (error) {
    console.error("Error fetching " + name + ":", error);
    return "";
  }
}

function dragContent(ev, name) {
  ev.dataTransfer.setData("text/html", portfolio[name]);
  ev.dataTransfer.setData("text/component", name);
}

function savePage(page, content) {
  localStorage.setItem(page, JSON.stringify(content));
}

function loadPage(page) {
  let data = JSON.parse(localStorage.getItem(page)) || [];
  const iframeBody = document.getElementById("show").contentDocument.body;
  const propertySec = document.getElementById("properties");
  var theme = localStorage.getItem("theme") || "ocean";
  console.log(theme);
  document.getElementsByClassName(`${theme}`)[0].classList.toggle("active");

  if (data != null) {
    var properties = data.map((item) => item[0]);
    var propertyString = "";
    properties.forEach(
      (property) => (propertyString += `<li>${property}</li>`),
    );
    propertySec.innerHTML = propertyString;
    var comps = data;
    var htmlString = "";
    comps.forEach((comp) => (htmlString += comp[1]));
    iframeBody.innerHTML = htmlString;
  } else {
    iframeBody.innerHTML = "";
  }
}

function openPage(page) {
  loadPage(page);
  document.getElementsByClassName("selected")[0].classList.remove("selected");
  document.getElementById(page + "PageOpener").classList.add("selected");
  currentPage = page;
}

function closeThemePicker() {
  document.querySelector(".blur").style.opacity = "0";
  document.querySelector(".themePicker").style.opacity = "0";
  document.querySelector(".blur").style.zIndex = "-1";
  document.querySelector(".themePicker").style.zIndex = "-1";
}

function openThemePicker() {
  document.querySelector(".blur").style.opacity = "1";
  document.querySelector(".themePicker").style.opacity = "1";
  document.querySelector(".blur").style.zIndex = "10";
  document.querySelector(".themePicker").style.zIndex = "11";
}

function changeTheme(theme) {
  const oldTheme = localStorage.getItem("theme") || "ocean";
  const idoc = document.getElementById("show").contentDocument;
  idoc.body.setAttribute("data-theme", theme);
  document.getElementsByClassName(`${theme}`)[0].classList.toggle("active");
  document.getElementsByClassName(`${oldTheme}`)[0].classList.toggle("active");
  localStorage.setItem("theme", theme);
  closeThemePicker();
}
