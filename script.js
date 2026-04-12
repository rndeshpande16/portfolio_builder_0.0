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
    `<!DOCTYPE html><html lang='en'><head><link rel='stylesheet' href='themes.css' /><link rel='stylesheet' href='compsstyles.css' /></head><body data-theme='${theme}' style='transition: 0.3s all ease; margin:0; padding:0; min-height: 100vh; width: 100%; box-sizing: border-box;'></body></html>`,
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
      comps.forEach((comp, index) => {
        htmlString += comp[1];
        props += `<li id='openEditor${index}' ondragend="handleDragStart(event)" draggable='true' onclick='openEditBar(${index})'><div class='text'>${comp[0]}</div></li>`;
      });
      propertySec.innerHTML = props;
      idoc.body.innerHTML = htmlString;
      localStorage.setItem("html", htmlString);
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
function handleDragStart(ev){
  const propertySec = document.getElementById("properties");
  let editorPos=[];
  const x = ev.clientX;
    const y = ev.clientY;
  for(let i=0;i<propertySec.childElementCount;i++){
    editorPos.push(propertySec.children[i].getBoundingClientRect().top+ window.scrollY);
  }
  let newElem=-1;
  var changeY=0;
  if(propertySec.childElementCount>1){
    changeY=editorPos[1]-editorPos[0];
  }
   for(let i=0;i<propertySec.childElementCount;i++){
    if(y>editorPos[i]&&y<editorPos[i]+changeY){
      newElem=i;
      console.log(i);
    }
   }
   if(newElem==-1){
    return;
   }
   let currentElem=parseInt(ev.target.id.split("openEditor")[1]);
   let data=JSON.parse(localStorage.getItem(currentPage)) || [];
   let temp = data[currentElem];
  data[currentElem] = data[newElem];
  data[newElem] = temp;
  localStorage.setItem(currentPage, JSON.stringify(data));
  loadPage(currentPage);
   // console.log(`Drag ended at: X=${x}, Y=${y}`);
    
}
function loadPage(page) {
  let data = JSON.parse(localStorage.getItem(page)) || [];
  const iframeBody = document.getElementById("show").contentDocument.body;
  const propertySec = document.getElementById("properties");
  var theme = localStorage.getItem("theme") || "ocean";
  document.getElementsByClassName(`${theme}`)[0].classList.toggle("active");

  if (data != null) {
    var properties = data.map((item) => item[0]);
    var propertyString = "";
    properties.forEach(
      (property, index) =>
        (propertyString += `<li id='openEditor${index}'  ondragend="handleDragStart(event)" draggable='true' onclick='openEditBar(${index})'><div class='text'>${property}</div><!--<div class='adjust'><i class="fa-solid fa-angle-down"></i><i class="fa-solid fa-angle-up fa-dark"></i><i class="fa-solid fa-xmark"></i></div>--></li>`),
    );
    propertySec.innerHTML = propertyString;
    var comps = data;
    var htmlString = "";
    comps.forEach((comp) => (htmlString += comp[1]));
    iframeBody.innerHTML = htmlString;
    localStorage.setItem("html", htmlString);
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
  const preview = document.getElementById("preview").contentDocument;
  preview.body.setAttribute("data-theme", theme);
  document.getElementsByClassName(`${theme}`)[0].classList.toggle("active");
  document.getElementsByClassName(`${oldTheme}`)[0].classList.toggle("active");
  localStorage.setItem("theme", theme);
  closeThemePicker();
}

async function expandView() {
  const preview = await document.getElementById("preview");
  window.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      preview.style.zIndex = -2;
      preview.style.opacity = 0;
    }
  });
  const previewDoc =
    (await preview.contentDocument) || (await preview.contentWindow.document);
  previewDoc.write(
    `<!DOCTYPE html><html lang='en'><head><link rel='stylesheet' href='themes.css' /><link rel='stylesheet' href='compsstyles.css' /></head><body data-theme='${localStorage.getItem("theme") || "ocean"}' style='transition: 0.3s all ease; margin:0; padding:0; min-height: 100vh; width: 100%; box-sizing: border-box;'></body></html>`,
  );
  previewDoc.body.innerHTML = localStorage.getItem("html");
  preview.style.zIndex = 1000;
  preview.style.opacity = 1;
  preview.contentWindow.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      preview.style.zIndex = -2;
      preview.style.opacity = 0;
    }
  });
}

const parser = new DOMParser();
const serializer = new XMLSerializer();

function handleImageEdit(ev, val, row, ind) {
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  doc.querySelectorAll("img")[row].src = val;
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
}

function handleHeadingEdit(ev, val, row, ind) {
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  doc.querySelectorAll("h1")[row].innerText = val;
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
}

function handleParaEdit(ev, val, row, ind) {
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  doc.querySelectorAll("p")[row].innerText = val;
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
}

function handleLtextEdit(ev, val, row, ind) {
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  doc.querySelectorAll("a")[row].innerText = val;
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
}

function handleLhrefEdit(ev, val, row, ind) {
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  doc.querySelectorAll("a")[row].href = val;
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
}

async function closeEditComponent() {
  // document.querySelector(".editComponent").style.opacity = 0;
  // await setTimeout(() => {
  //   document.querySelector(".editComponent").style.zIndex = -2;
  // }, 300);
  document.querySelector(".editComponent").style.transform =
    "translateX(22.5vw)";
  setTimeout(() => {
    document.querySelector("#editForm").innerHTML =
      `     <input type="hidden" name="row" id="row" value="0" />
          <div class="closebtn" onclick="closeEditComponent()">
            <i class="fa-solid fa-xmark"></i>
          </div>`;
  }, 300);
}

function openEditBar(index) {
  let editForm = document.querySelector("#editForm");
  let editBar = document.querySelector(".editComponent");
  if (editBar.querySelectorAll(".empty").length != 0) {
    editBar.removeChild(editBar.querySelector(".empty"));
  }
  let data = JSON.parse(localStorage.getItem(currentPage));
  let elems = 0;
  editBar.classList.remove("empty-bar");
  data = parser.parseFromString(data[index][1], "text/html");
  editForm.querySelector("#row").value = index;
  let heading = (val, ind) => {
    return `<hr />
            <label for="heading${ind}">Heading ${ind + 1}:</label>
            <input
              type="text"
              value="${val}"
              id="heading${ind}"
              name="heading${ind}"
              onchange="handleHeadingEdit(event, this.value, ${ind}, ${index})"
            />
          `;
  };
  let para = (val, ind) => {
    return `<hr />
            <label for="paragraph${ind}">Paragraph ${ind + 1}:</label>
            <textarea
              id="paragraph${ind}"
              name="paragraph${ind}"
              minlength="50"
              resize='vertical'
              onkeydown="
                if (event.key === 'Enter') {
                  handleParaEdit(event, this.value, ${ind}, ${index});
                }
              "
            >${val}</textarea>
          `;
  };
  let img = (val, ind) => {
    return `<hr />
            <label for="image${ind}">Image Link ${ind + 1}:</label>
            <input
              type="text"
              value="${val}"
              id="image${ind}"
              name="image${ind}"
              onchange="handleImageEdit(event, this.value, ${ind}, ${index})"
            />`;
  };
  let anchor = (val, href, ind) => {
    return `<hr /><label for="ltext${ind}">Link ${ind + 1} Text:</label>
            <input
              type="text"
              value="${val}"
              id="ltext${ind}"
              name="ltext${ind}"
              onchange="handleLtextEdit(event, this.value, ${ind}, ${index})"
            />
            <label for="href${ind}">Link ${ind + 1} Address:</label>
            <input
              type="text"
              value="${href}"
              id="href${ind}"
              name="href${ind}"
              onchange="handleLhrefEdit(event, this.value, ${ind}, ${index})"
            />`;
  };
  data.querySelectorAll("h1").forEach((head, ind) => {
    let elem = document.createElement("div");
    elem.classList.add("compe");
    elem.innerHTML = heading(head.innerText, ind);
    console.log(head.innerText);
    editForm.appendChild(elem);
    elems += 1;
  });
  data.querySelectorAll("img").forEach((image, ind) => {
    let elem = document.createElement("div");
    elem.classList.add("compe");
    elem.innerHTML = img(image.src, ind);
    console.log("img");
    editForm.appendChild(elem);
    elems += 1;
  });
  data.querySelectorAll("p").forEach((paragraph, ind) => {
    let elem = document.createElement("div");
    elem.classList.add("compe");
    elem.innerHTML = para(paragraph.innerText, ind);
    editForm.appendChild(elem);
    console.log("para");
    elems += 1;
  });
  data.querySelectorAll("a").forEach((a, ind) => {
    let elem = document.createElement("div");
    elem.classList.add("compe");
    elem.innerHTML = anchor(a.innerText, a.href, ind);
    editForm.appendChild(elem);
    elems += 1;
  });
  if (elems === 0) {
    let emp = document.createElement("div");
    emp.classList.add("empty");
    emp.innerHTML =
      "Nothing here. Close this window and add elements <i style='background-color: green; color: white;' class='fa-solid fa-check'></i>";
    if (document.querySelectorAll(".empty").length == 0) {
      editBar.append(emp);
    }
    editBar.classList.add("empty-bar");
  }
  editBar.style.transform = "translateX(0)";
}

function clearCurrent() {
  if (confirm("Are you sure?")) {
    localStorage.removeItem(currentPage);
    window.location.reload();
  } else {
    return;
  }
}

function clearAll() {
  if (confirm("Are you sure?")) {
    localStorage.clear();
    window.location.reload();
  } else {
    return;
  }
}
