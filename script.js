let currentPage="home";
function homeDrag(ev) {
  const html = `<section class="home">
      <style>
        .home {
          background: linear-gradient(45deg, darkblue 50%, cornflowerblue 50%);
          background-attachment: fixed;
          background-size: cover;
          padding: 35px;
          color: white;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          container-type: inline-size;
          img {
            height: 250px;
            border-radius: 100%;
            transition: 0.3s border-radius ease-in-out;
          }
          .imageintro {
            display: flex;
            justify-content: space-around;
            gap: 25pt;
          }
          .imageintro div.intro {
            min-width: 40%;
            text-align: justify;
            text-align-last: left;
          }
          .imageintro .img {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
          @container (max-width: 1200px) {
            .imageintro {
              display: inline;
            }
            .imageintro .img {
              float: left;
              width: auto;
              padding: 25pt;
              margin: 0;
            }
            .imageintro img {
              border-radius: 10pt;
            }
          }
        }
      </style>
      <div class="heading">
        <h1>Hey, this is John! Welcome to my website!</h1>
      </div>
      <div class="imageintro">
        <div class="img">
          <img
            src="https://images.pexels.com/photos/36536611/pexels-photo-36536611.jpeg"
          />
        </div>
        <div class="intro">
          <p>
            I have always felt that the thin, biting air of the high altitudes
            is the only thing that truly allows me to breathe. My fascination
            with the Himalayas isn't about ticking famous summits off a
            checklist; it is a deliberate, soul-deep immersion into the rugged
            landscapes of Himachal Pradesh and the sacred, echoing silences of
            Uttarakhand. Whether I am navigating the stark, rain-shadow deserts
            of Spiti or finding a rare kind of stillness amidst the
            mist-shrouded oak forests of Kumaon, I am drawn to the raw and
            unfiltered spirit of these mountains. To me, these peaks are not
            just a backdrop for an adventure—they are a demanding teacher and my
            ultimate sanctuary.
          </p>
          <p>
            The path I tread is defined by the shift from the lush, rolling
            meadows of the Garhwal region to the formidable, snow-dusted passes
            that guard the gateway to Tibet. I find myself equally at home
            sharing tea in a remote Himalayan hamlet in the Parvati Valley as I
            am tracing the ancient pilgrim trails that wind toward the high
            shrines of the Char Dham. My journey is a constant search for that
            perfect intersection of physical endurance and spiritual clarity,
            proving that the further I climb into the heart of Devbhumi, the
            closer I get to understanding the true scale of the world and my
            place within it.
          </p>
        </div>
      </div>
    </section>`;
  ev.dataTransfer.setData("html", html);
}

function dragNav(ev) {
  const html = `<section class="nav">
      <nav>
        <style>
          .nav nav {
            position: sticky;
            background: linear-gradient(
              -45deg,
              darkblue 50%,
              cornflowerblue 50%
            );
            color: white;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            padding: 10px;
            ul {
              display: flex;
              list-style-type: none;
              justify-content: space-around;
              align-items: center;
            }
            a {
              color: white;
              text-decoration: none;
            }
            li div {
              height: 3px;
              width: 0;
              background-color: white;
              border-radius: 2px;
              margin-top: 8px;
              position: relative;
              transition: 0.3s width ease;
            }
            li:hover {
              div {
                width: 100%;
              }
            }
          }
        </style>
        <ul>
          <li>
            <a onclick="openPage('home')">Home</a>
            <div></div>
          </li>
          <li>
            <a onclick="openPage('about')">About</a>
            <div></div>
          </li>
          <li>
            <a onclick="openPage('myWork')">My Work</a>
            <div></div>
          </li>
          <li>
            <a onclick="openPage('contacts')">Contacts</a>
            <div></div>
          </li>
        </ul>
      </nav>
    </section>`;
  ev.dataTransfer.setData("html", html);
}
function contactDrag(ev) {
  const html = `
    <style>
        /* Exact variables from your homesection.html */
        :root {
          --light: #f0f0f0;
          --dark: #1a1a1a;
          --angle: 45deg;
        }

        
        .gradient-container {
            width: 100%;
           min-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            box-sizing: border-box;
            
            
            background: linear-gradient(
                var(--angle),
                var(--light) 50%,
                var(--dark) 50%
            );
            background-attachment: fixed;
        }
        .main-menu {
            background-color: #ffffff;
            width: 450px;
            max-width: 100%;
            padding: 40px 30px;
            border: 4px solid #26a69a;
            border-radius: 20px;
        }

        .main-menu h1 {
            color: #004d40;
            margin-top: 0;
            font-size: 28px;
        }

        .main-menu p {
            color: #444444;
            margin-bottom: 30px;
            line-height: 1.5;
        }

        .contact-link {
            display: block;
            background-color: #f5f5f5;
            border: 2px solid #cccccc;
            border-radius: 8px;
            margin: 20px 0;
            padding: 15px;
            text-decoration: none;
            font-size: 20px;
            font-weight: bold;
        }

        .contact-link:hover {
            background-color: #e0e0e0;
            border-color: #999999;
        }
        
        .email-link { color: #d84315; }
        .github-link { color: #37474f; }
        .linkedin-link { color: #1565c0; }

    </style>
</head>


    <div class="gradient-container">
        <section class="main-menu">
            <h1>Get In Touch</h1>
            <p>Feel free to reach out to me through any of the links below!</p>
            
            <a href="mailto:sahil@example.com" class="contact-link email-link">
                Email Me
            </a>

            <a href="https://github.com/sahil" target="_blank" class="contact-link github-link">
                GitHub Profile
            </a>

            <a href="https://linkedin.com/in/sahil" target="_blank" class="contact-link linkedin-link">
                LinkedIn Profile
            </a>
        </section>
    </div>`;
  ev.dataTransfer.setData("html", html);
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
