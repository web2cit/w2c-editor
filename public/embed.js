// create, position and append iframe, with source the react app, with some
// argument indicating that we want to use webpage preload (and maybe also
// domain name and current path

// use a special id so we prevent injecting twice

// elobservador (for example) seems to use react router to move around pages
// we should listen to this to change the hash in the iframe src
// https://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate/4585031#4585031

// const url = document.URL;

const web2cti = document.createElement("iframe");
web2cti.src = `http://localhost:3000/#${document.URL}`;
web2cti.style.position = "fixed";
web2cti.style.right = 0;
web2cti.style.top = 0;
web2cti.style.height = "100%";
web2cti.style.width = "50%";
web2cti.style.zIndex = 2147483647;
web2cti.style.background = "white";
document.body.appendChild(web2cti);

// confiugre the listener for the preloader