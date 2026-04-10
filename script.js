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
  document.documentElement.setAttribute("data-theme", "ocean");
  iframe.contentWindow.postMessage({ type: "THEME_CHANGE", theme: "ocean" });
  idoc.open();
  idoc.write(
    "<!DOCTYPE html><html lang='en' data-theme='ocean'><head><link rel='stylesheet' href='themes.css' /></head><body style='margin:0; padding:0; min-height: 100vh; width: 100%; box-sizing: border-box;'></body></html>",
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
    if (h) {
      idoc.body.innerHTML += h;
      savePage(currentPage);
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
}

function savePage(page) {
  const iframeBody = document.getElementById("show").contentDocument.body;
  localStorage.setItem(page, iframeBody.innerHTML);
}

function loadPage(page) {
  let data = localStorage.getItem(page);
  const iframeBody = document.getElementById("show").contentDocument.body;

  if (data != null) {
    iframeBody.innerHTML = data;
  } else {
    iframeBody.innerHTML = "";
  }
}

function openPage(page) {
  savePage(currentPage);
  loadPage(page);
  document.getElementsByClassName("selected")[0].classList.remove("selected");
  document.getElementById(page + "PageOpener").classList.add("selected");
  currentPage = page;
}
