// create, position and append iframe, with source the react app, with some
// argument indicating that we want to use webpage preload (and maybe also
// domain name and current path

// use a special id so we prevent injecting twice

// elobservador (for example) seems to use react router to move around pages
// we should listen to this to change the hash in the iframe src
// https://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate/4585031#4585031

const url = document.URL;

const app = document.createElement("iframe");
app.src = `http://localhost:3000/#${url}`;
app.style.position = "fixed";
app.style.right = 0;
app.style.top = 0;
app.style.height = "100%";
app.style.width = "50%";
app.style.zIndex = 2147483647;
app.style.background = "white";
document.body.appendChild(app);

// confiugre the listener for the preloader