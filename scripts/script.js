let currentPage = localStorage.getItem("last-page") || "home";
var portfolio = {};
var changes = [[]];
let currentChange = 0;
async function start() {
  setupIframe();
  portfolio = {
    home: await loadContent("homesection"),
    contact: await loadContent("contactsection"),
    nav: await loadContent("navsection"),
    gallery: await loadContent("gallerysection"),
    testimonials: await loadContent("testimonialssection"),
    about: await loadContent("aboutsection"),
    footer: await loadContent("footersection"),
  };

  setTimeout(function () {
    const lastPage = localStorage.getItem("last-page") || "home";
    document.getElementById(`${lastPage}PageOpener`).classList.add("selected");
    loadPage(lastPage);
    const linkFont = localStorage.getItem("link-font") || "Roboto";
    document.querySelectorAll(`#${linkFont.split(" ").join("-")}`)[2].selected =
      true;
    const paraFont = localStorage.getItem("paragraph-font") || "Ubuntu";
    document.querySelectorAll(`#${paraFont.split(" ").join("-")}`)[1].selected =
      true;
    const headFont = localStorage.getItem("heading-font") || "Pacifico";
    document.querySelectorAll(`#${headFont.split(" ").join("-")}`)[0].selected =
      true;
    document.querySelector("#fontHead").style.fontFamily = `${headFont}`;
    document.querySelector("#fontPara").style.fontFamily = `${paraFont}`;
    document.querySelector("#fontLink").style.fontFamily = `${linkFont}`;
  }, 200);
}

function setupIframe() {
  const iframe = document.getElementById("show");
  const idoc = iframe.contentDocument;
  const theme = localStorage.getItem("theme") || "ocean";
  const headFont = localStorage.getItem("heading-font") || "Pacifico";
  const paraFont = localStorage.getItem("paragraph-font") || "Ubuntu";
  const linkFont = localStorage.getItem("link-font") || "Roboto";
  idoc.open();
  idoc.write(
    `<!DOCTYPE html><html lang='en'><head><link rel='stylesheet' href='/styles/themes.css' /><link
      rel="stylesheet"
      href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css'
    /><style>h1 {font-family: '${headFont}' !important;} p {font-family: '${paraFont}' !important;} a {font-family: '${linkFont}' !important;}</style><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bitcount+Grid+Double:wght@100..900&family=Creepster&family=Pacifico&family=Playwrite+IE:wght@100..400&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet"><link rel='stylesheet' href='/styles/compsstyles.css' /></head><body data-theme='${theme}' style='transition: 0.3s all ease; margin:0; padding:0; min-height: 100vh; width: 100%; box-sizing: border-box;'></body></html>`,
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
    addComponent(c, h);
  });
}
function addComponent(c, h) {
  const iframe = document.getElementById("show");
  const idoc = iframe.contentDocument;
  const propertySec = document.getElementById("properties");
  var comps = JSON.parse(localStorage.getItem(currentPage)) || [];
  if (h) {
    comps.push([c, h]);
    var htmlString = "";
    var props = "";
    comps.forEach((comp, index) => {
      htmlString += comp[1];
      props += `<li id='openEditor${index}' ondragend="handleDragStart(event)" draggable='true' onclick='openEditBar(${index})'><div class='text'>${comp[0].charAt(0).toUpperCase() + comp[0].slice(1)}</div></li>`;
    });
    propertySec.innerHTML = props;
    idoc.body.innerHTML = htmlString;
    localStorage.setItem("html", htmlString);
    savePage(currentPage, comps);
  }
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
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css";

    const iframeHead = document.getElementById("show").contentDocument.head;

    fetchedStyles.forEach((styleNode) => {
      iframeHead.insertBefore(styleNode.cloneNode(true), iframeHead.firstChild);
    });
    iframeHead.appendChild(fa);

    return virtualDoc.body.innerHTML;
  } catch (error) {
    console.error("Error fetching " + name + ":", error);
    return "";
  }
}

function dragContent(ev, name) {
  ev.dataTransfer.setData("text/html", portfolio[name]);
  ev.dataTransfer.setData("text/component", name);
  addChange(["add", name]);
}

function savePage(page, content) {
  localStorage.setItem(page, JSON.stringify(content));
}
function handleDragStart(ev) {
  const propertySec = document.getElementById("properties");
  let editorPos = [];
  const x = ev.clientX;
  const y = ev.clientY;
  for (let i = 0; i < propertySec.childElementCount; i++) {
    editorPos.push(
      propertySec.children[i].getBoundingClientRect().top + window.scrollY,
    );
  }
  let newElem = -1;
  var changeY = 0;
  if (propertySec.childElementCount > 1) {
    changeY = editorPos[1] - editorPos[0];
  }
  for (let i = 0; i < propertySec.childElementCount; i++) {
    if (y > editorPos[i] && y < editorPos[i] + changeY) {
      newElem = i;
      console.log(i);
    }
  }
  if (newElem == -1) {
    return;
  }
  let currentElem = parseInt(ev.target.id.split("openEditor")[1]);
  addChange(["swap", currentElem, newElem]);
  swapComponents(currentElem, newElem);
  // console.log(`Drag ended at: X=${x}, Y=${y}`);
}
function swapComponents(comp1, comp2) {
  let data = JSON.parse(localStorage.getItem(currentPage)) || [];
  let temp = data[comp1];
  data[comp1] = data[comp2];
  data[comp2] = temp;
  localStorage.setItem(currentPage, JSON.stringify(data));

  loadPage(currentPage);
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
        (propertyString += `<li id='openEditor${index}'  ondragend="handleDragStart(event)" draggable='true' onclick='openEditBar(${index})'><div class='text'>${property.charAt(0).toUpperCase() + property.slice(1)}</div><!--<div class='adjust'><i class="fa-solid fa-angle-down"></i><i class="fa-solid fa-angle-up fa-dark"></i><i class="fa-solid fa-xmark"></i></div>--></li>`),
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
  localStorage.setItem("last-page", page || "home");
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
  document.getElementsByClassName(`${oldTheme}`)[0].classList.remove("active");
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
  const headFont = localStorage.getItem("heading-font") || "Pacifico";
  const paraFont = localStorage.getItem("paragraph-font") || "Ubuntu";
  const linkFont = localStorage.getItem("link-font") || "Roboto";
  const theme = localStorage.getItem("theme") || "ocean";
  const previewDoc =
    (await preview.contentDocument) || (await preview.contentWindow.document);
  previewDoc.write(
    `<!DOCTYPE html><html lang='en'><head><link rel='stylesheet' href='/styles/themes.css' /><link
      rel="stylesheet"
      href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css'
    /><style>h1 {font-family: '${headFont}' !important;} p {font-family: '${paraFont}' !important;} a {font-family: '${linkFont}' !important;}</style><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bitcount+Grid+Double:wght@100..900&family=Creepster&family=Pacifico&family=Playwrite+IE:wght@100..400&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet"><link rel='stylesheet' href='/styles/compsstyles.css' /></head><body data-theme='${theme}' style='transition: 0.3s all ease; margin:0; padding:0; min-height: 100vh; width: 100%; box-sizing: border-box;'></body></html>`,
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
  ev.preventDefault();
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
  ev.preventDefault();
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  doc.querySelectorAll("a")[row].innerText = val;
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
}

function handleLhrefEdit(ev, val, row, ind) {
  ev.preventDefault();
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  doc.querySelectorAll("a")[row].href = val;
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
}

async function closeEditComponent() {
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
  editForm.innerHTML = `
    <input type="hidden" name="row" id="row" value="${index}" />
    <div class="closebtn" onclick="closeEditComponent()">
      <i class="fa-solid fa-xmark"></i>
    </div>
  `;
  if (editBar.querySelectorAll(".empty").length != 0) {
    editBar.removeChild(editBar.querySelector(".empty"));
  }
  let fulldata = JSON.parse(localStorage.getItem(currentPage));
  let elems = 0;
  editBar.classList.remove("empty-bar");
  data = parser.parseFromString(fulldata[index][1], "text/html");
  editForm.querySelector("#row").value = index;
  let heading = (val, ind) => {
    return `<hr />
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <label for="heading${ind}" style="margin: 0;">Heading ${ind + 1}:</label>
              <i class="fa-solid fa-trash" style="cursor: pointer; color: black;" onclick="deleteSubElement(event, 'h1', ${ind}, ${index})"></i>
              <i class="fa-solid fa-circle-half-stroke" style="cursor: pointer; color: black;" onclick="changeColor(event, 'h1', ${ind}, ${index})"></i>
              <i class="fa-solid fa-font" style="cursor: pointer; color: black; margin: 0pt 10pt;" onclick="changeFont(event, 'h1', ${ind}, ${index})"></i>
            </div>
            <input
              type="text"
              value="${val}"
              id="heading${ind}"
              name="heading${ind}"
              onkeydown="if (event.key === 'Enter') {
                event.preventDefault();
                handleHeadingEdit(event, this.value, ${ind}, ${index});
              }"
            />
          `;
  };

  let para = (val, ind) => {
    return `<hr />
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <label for="paragraph${ind}" style="margin: 0;">Paragraph ${ind + 1}:</label>
              <i class="fa-solid fa-trash" style="cursor: pointer; color: black;" onclick="deleteSubElement(event, 'p', ${ind}, ${index})"></i>
              <i class="fa-solid fa-circle-half-stroke" style="cursor: pointer; color: black;" onclick="changeColor(event, 'p', ${ind}, ${index})"></i>
              <i class="fa-solid fa-font" style="cursor: pointer; color: black; margin: 0pt 10pt;" onclick="changeFont(event, 'p', ${ind}, ${index})"></i>
            </div>
            <textarea
              id="paragraph${ind}"
              name="paragraph${ind}"
              minlength="50"
              style='overflow-x: hidden;overflow-y: scroll;'
              onkeydown="
                if (event.key === 'Enter') {
                  event.preventDefault();handleParaEdit(event, this.value, ${ind}, ${index});
                }
              "
            >${val}</textarea>
          `;
  };

  let img = (val, ind) => {
    return `<hr />
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <label for="image${ind}" style="margin: 0;">Image Link ${ind + 1}:</label>
              <i class="fa-solid fa-trash" style="cursor: pointer; color: black;" onclick="deleteSubElement(event, 'img', ${ind}, ${index})"></i>
            </div>
            <input
              type="text"
              value="${val}"
              id="image${ind}"
              name="image${ind}"
              onkeydown="if (event.key === 'Enter'){
                event.preventDefault();
                handleImageEdit(event, this.value, ${ind}, ${index});
              }"
            />`;
  };
  let anchor = (val, href, ind) => {
    return `<hr />
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
              <label for="ltext${ind}" style="margin: 0;">Link ${ind + 1} Text:</label>
              <i class="fa-solid fa-trash" style="cursor: pointer; color: black;" onclick="deleteSubElement(event, 'a', ${ind}, ${index})"></i>
              <i class="fa-solid fa-circle-half-stroke" style="cursor: pointer; color: black;" onclick="changeColor(event, 'a', ${ind}, ${index})"></i>
              <i class="fa-solid fa-font" style="cursor: pointer; color: black; margin: 0pt 10pt;" onclick="changeFont(event, 'a', ${ind}, ${index})"></i>
            </div>
            <input
              type="text"
              value="${val}"
              id="ltext${ind}"
              name="ltext${ind}"
              onkeydown="if (event.key === 'Enter') {
                event.preventDefault();
                handleLtextEdit(event, this.value, ${ind}, ${index});
              }"
            />
            <label for="href${ind}">Link ${ind + 1} Address:</label>
            <input
              type="text"
              value="${href}"
              id="href${ind}"
              name="href${ind}"
              onkeydown="if (event.key === 'Enter') {
                event.preventDefault();
                handleLhrefEdit(event, this.value, ${ind}, ${index});
              }"
            />`;
  };
  let deleteButton =
    "<button type='button' class='delbtn' onclick='deleteManual(event," +
    index +
    ")'>Delete</button>";
  let delem = document.createElement("div");
  //delem.classList.add("compe");
  delem.innerHTML = deleteButton;

  // editForm.appendChild(delem);
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
  const changeBackground = document.createElement("div");
  changeBackground.innerHTML = `<button onclick='handleBgColorChange(event, ${index})' class='bg-change-btn'>Change BG-Color</button>`;
  editForm.append(document.createElement("hr"));
  editForm.appendChild(delem);
  editForm.append(document.createElement("hr"));
  editForm.appendChild(changeBackground);
  editForm.append(document.createElement("hr"));
  let addElementUI = document.createElement("div");
  addElementUI.classList.add("compe");
  addElementUI.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;width: 100%;">
      <label style="margin: 0; font-weight: bold; font-size: 1.1rem;">Add New Element:</label>
      
      <select id="newElementType" style="background-color: var(--dark); padding: 10px; border-radius: 5pt; border: none; width: 100%; font-size: 1rem; color: white;">
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="img">Image</option>
        <option value="a">Link</option>
      </select>

      <button 
        id="addNewElement" 
        type="button" 
        onclick="addNewElementHandler(event)"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--light); 
          border-radius: 5px; 
          border: none; 
          width: 100%;
          min-height: 8vh;
          background-color: var(--dark);
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: bold;
        ">
        Add
      </button>
    </div>
  `;
  editForm.appendChild(addElementUI);
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
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "addNewElement") {
    e.preventDefault();
    console.log("Add new element clicked");
    let index = parseInt(document.getElementById("row").value);
    let elementType = document.getElementById("newElementType").value;
    var htmlString = JSON.parse(localStorage.getItem(currentPage));
    const doc = parser.parseFromString(htmlString[index][1], "text/html");
    let newElem = doc.createElement(elementType);
    //localStorage.setItem(currentPage, JSON.stringify(htmlString));
    if (elementType === "p") {
      newElem.innerText = "Write your new paragraph here";
    } else if (elementType === "h1") {
      newElem.innerText = "New Heading";
    } else if (elementType === "img") {
      newElem.src = "https://placehold.co/600x400?text=Placeholder+Image";
    } else if (elementType === "a") {
      newElem.innerText = "New Link";
      newElem.href = "#";
    }
    let container = doc.body.querySelector("section") || doc.body;
    container.appendChild(newElem);
    const str = serializer.serializeToString(doc);
    htmlString[index][1] = str;
    localStorage.setItem(currentPage, JSON.stringify(htmlString));
    loadPage(currentPage);
    openEditBar(index);
  }
});
function addChange(arr) {
  if (currentChange !== changes.length - 1) {
    changes = changes.slice(0, currentChange + 1);
   }
   changes.push(arr);
   currentChange++;
}
function undo() {
  let command = changes[currentChange];
  let success = false;
  let data = JSON.parse(localStorage.getItem(currentPage));
  if (command[0] == "add") {
    //deleteBlock(data.length-1);
    data.pop();
    localStorage.setItem(currentPage, JSON.stringify(data));
    loadPage(currentPage);
    success = true;
  } else if (command[0] == "swap") {
    let ind1 = command[1];
    let ind2 = command[2];
    let temp = data[ind1];
    data[ind1] = data[ind2];
    data[ind2] = temp;

    localStorage.setItem(currentPage, JSON.stringify(data));
    loadPage(currentPage);
    success = true;
  } else if (command[0] == "delete") {
    let originalIndex = command[1];
    let deletedItem = JSON.parse(command[2]);
    data.splice(originalIndex, 0, deletedItem);
    localStorage.setItem(currentPage, JSON.stringify(data));
    loadPage(currentPage);
    success = true;
  }
  if (success) {
    currentChange--;
  }
}
function redo() {
  if(currentChange>=changes.length-1) {
    return;
  }
  currentChange++;
  let command = changes[currentChange];
  let success = false;
  let data = JSON.parse(localStorage.getItem(currentPage)) || [];
  if(command[0] === "add") {
    data.push([command[1], portfolio[command[1]]]);
    localStorage.setItem(currentPage, JSON.stringify(data));
    loadPage(currentPage);
    success = true; 
  }else if (command[0] === "swap") {
    let ind1 = command[1];
    let ind2 = command[2];
    let temp = data[ind1];
    data[ind1] = data[ind2];
    data[ind2] = temp;
    localStorage.setItem(currentPage, JSON.stringify(data));
    loadPage(currentPage);
    success = true;
  }else if (command[0] === "delete") {
    let originalIndex = command[1];
    data.splice(originalIndex, 1);
    localStorage.setItem(currentPage, JSON.stringify(data));
    loadPage(currentPage);
    success = true;
  }else if (command[0] === "theme") {
    changeTheme(command[2], true); 
    success = true;
  }
  if (!success) {
    currentChange--;
  }
}
function deleteManual(event, index) {
  event.preventDefault();
  if (confirm("Are you sure?")) {
    deleteBlock(index);
    loadPage(currentPage);
    closeEditComponent();
  } else {
    return;
  }
}
function deleteBlock(index) {
  let data = JSON.parse(localStorage.getItem(currentPage));
  addChange(["delete", index, JSON.stringify(data[index])]);
  data.splice(index, 1);
  localStorage.setItem(currentPage, JSON.stringify(data));
}
function deleteSubElement(ev, tag, row, ind) {
  ev.preventDefault();
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  const elements = doc.querySelectorAll(tag);
  if (elements[row]) {
    elements[row].remove();
  }
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
  //closeEditComponent();
  openEditBar(ind);
}
function changeColor(ev, tag, row, ind) {
  ev.preventDefault();
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  const elements = doc.querySelectorAll(tag);
  if (elements[row]) {
    elements[row].style.color =
      prompt("Enter Color:", elements[row].style.color) ||
      elements[row].style.color;
  }
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
  //closeEditComponent();
  openEditBar(ind);
}
function changeFont(ev, tag, row, ind) {
  ev.preventDefault();
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  const elements = doc.querySelectorAll(tag);
  if (elements[row]) {
    elements[row].style.setProperty(
      "font-family",
      prompt("Enter Font Name:", elements[row].style.fontFamily) ||
        elements[row].style.fontFamily,
      "important",
    );
  }
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
  //closeEditComponent();
  openEditBar(ind);
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
    const username = localStorage.getItem("username");
    const usergoal = localStorage.getItem("usergoal");
    localStorage.clear();
    localStorage.setItem("username", username);
    localStorage.setItem("usergoal", usergoal);
    window.location.reload();
  } else {
    return;
  }
}

function openFontPicker() {
  document.querySelector(".blur").style.opacity = "1";
  document.querySelector(".fontPicker").style.opacity = "1";
  document.querySelector(".blur").style.zIndex = "10";
  document.querySelector(".fontPicker").style.zIndex = "11";
}

function closeFontPicker() {
  document.querySelector(".blur").style.opacity = "0";
  document.querySelector(".fontPicker").style.opacity = "0";
  document.querySelector(".blur").style.zIndex = "-1";
  document.querySelector(".fontPicker").style.zIndex = "-1";
}

function changeHeadFont(val) {
  localStorage.setItem("heading-font", val);
  window.location.reload();
}

function changeParaFont(val) {
  localStorage.setItem("paragraph-font", val);
  window.location.reload();
}

function changeLinkFont(val) {
  localStorage.setItem("link-font", val);
  window.location.reload();
}

const downloadPage = (pageName, fileName) => {
  loadPage(pageName);
  const iframe = document.getElementById("show");
  let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  let htmlText = iframeDoc.documentElement.innerHTML;
  const blob = new Blob([htmlText], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  loadPage(currentPage);
};

const downloadStyles = async (fileName) => {
  const file = await fetch("/styles/compsstyles.css");
  var css = await file.text();
  const blob = new Blob([css], { type: "text/css" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadThemes = async (fileName) => {
  const file = await fetch("/styles/themes.css");
  var css = await file.text();
  const blob = new Blob([css], { type: "text/css" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// const downloadAllPages = () => {
//   downloadPage("home", "index.html");
//   downloadPage("about", "about.html");
//   downloadPage("myWork", "myWork.html");
//   downloadPage("contacts", "contacts.html");
//   downloadStyles("compsstyles.css");
//   downloadThemes("themes.css");
//   loadPage(currentPage);
// };

function openDownloadPicker() {
  document.querySelector(".blur").style.opacity = "1";
  document.querySelector(".downloadPicker").style.opacity = "1";
  document.querySelector(".blur").style.zIndex = "10";
  document.querySelector(".downloadPicker").style.zIndex = "11";
}

function closeDownloadPicker() {
  document.querySelector(".blur").style.opacity = "0";
  document.querySelector(".downloadPicker").style.opacity = "0";
  document.querySelector(".blur").style.zIndex = "-1";
  document.querySelector(".downloadPicker").style.zIndex = "-1";
}

const returnHtml = async (pageName = "home") => {
  loadPage(pageName);
  const iframe = document.getElementById("show");
  let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  let htmlText = iframeDoc.documentElement.innerHTML;
  return htmlText;
};

const returnCss = async (fileName = "compsstyles") => {
  const file = await fetch(`/styles/${fileName}.css`);
  var css = await file.text();
  return css;
};

const downloadAllPages = async () => {
  const zip = new JSZip();
  let filesFound = false;
  const folder = zip.folder("main");
  folder.file("index.html", await returnHtml("home"));
  folder.file("about.html", await returnHtml("about"));
  folder.file("myWork.html", await returnHtml("myWork"));
  folder.file("contacts.html", await returnHtml("contacts"));
  const stylesFolder = folder.folder("styles");
  stylesFolder.file("compsstyles.css", await returnCss("compsstyles"));
  stylesFolder.file("themes.css", await returnCss("themes"));
  try {
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(
      content,
      prompt("Enter website name: ", localStorage.getItem("username")),
    );
  } catch (err) {
    alert("Couldn't be downloaded :(\nPlease retry");
    console.log(err);
  }
};

function handleBgColorChange(ev, ind) {
  ev.preventDefault();
  var htmlString = JSON.parse(localStorage.getItem(currentPage));
  const doc = parser.parseFromString(htmlString[ind][1], "text/html");
  const main = doc.querySelectorAll("section")[0];
  const fixed = "fixed";
  if (
    confirm(
      "Add gradient (like current) or keep a single color? (Okay for gradient, and Cancel for single color)",
    )
  ) {
    const color1 = prompt("Enter color 1: (bottom)", "");
    const color2 = prompt("Enter color 2: (upper)", "");
    const angle = Number(prompt("Enter angle: (in degrees)", "45"));
    main.style.background = `linear-gradient(${angle}deg, ${color1} 50%, ${color2} 50%) ${fixed}`;
  } else {
    const color = prompt("Enter color");
    if (color) {
      main.style.background = `${color} ${fixed}`;
    }
  }
  const str = serializer.serializeToString(doc);
  htmlString[ind][1] = str;
  localStorage.setItem(currentPage, JSON.stringify(htmlString));
  loadPage(currentPage);
  //closeEditComponent();
  openEditBar(ind);
}
