let currentPage="home";
var portfolio={};
async function start(){
  portfolio={
  "home": await loadContent("homesection"),
  "contact":await loadContent("contact"),
  "nav":await loadContent("navsection")
};

}
async function loadContent(name) {
  try {
    const response = await fetch('components/' + name + '.html');
    const htmlString = await response.text();
    //making a virtual DOM so we can like edit it before appending it to main body
    const parser = new DOMParser();
    const virtualDoc = parser.parseFromString(htmlString, 'text/html');

    //get every <style> tags and <link rel="stylesheet">
    const fetchedStyles = virtualDoc.querySelectorAll('style, link[rel="stylesheet"]');
    
    fetchedStyles.forEach(styleNode => {
      // to make sure main CSS body is not affected
      document.head.insertBefore(styleNode, document.head.firstChild);
    });
    const fetchedBody = virtualDoc.body;
    return fetchedBody.innerHTML;
    
  } catch (error) {
    console.error('Error fetching ' + name + ':', error);
    return ""; 
  }
}

function dragContent(ev,name) {
  ev.dataTransfer.setData("html", portfolio[name]);
}
function DragOver(ev) {
  ev.preventDefault();
}

function Drop(ev) {
  ev.preventDefault();
  var h = ev.dataTransfer.getData("html");
  document.getElementById("show").innerHTML += h;
}
function savePage(page){
localStorage.setItem(page,document.getElementById("show").innerHTML);
}
function loadPage(page){
  let data=localStorage.getItem(page);
  if(data!=null){
    document.getElementById("show").innerHTML=data;
  }else{
    document.getElementById("show").innerHTML="";
  }
}
function openPage(page){
  savePage(currentPage);
  loadPage(page);
  document.getElementsByClassName("selected")[0].classList.remove("selected");
  document.getElementById(page+"PageOpener").classList.add("selected");
  currentPage=page;
}
setTimeout(function(){
loadPage("home");
},200);
