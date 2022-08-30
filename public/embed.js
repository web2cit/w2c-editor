// create, position and append iframe, with source the react app, with some
// argument indicating that we want to use webpage preload (and maybe also
// domain name and current path

// use a special id so we prevent injecting twice

// elobservador (for example) seems to use react router to move around pages
// we should listen to this to change the hash in the iframe src
// https://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate/4585031#4585031

// const url = document.URL;

const web2cit = document.createElement("iframe");
web2cit.src = `http://localhost:8080/#${document.URL}`;
web2cit.style.position = "fixed";
web2cit.style.right = 0;
web2cit.style.top = 0;
web2cit.style.height = "100%";
web2cit.style.width = "50%";
web2cit.style.zIndex = 2147483647;
web2cit.style.background = "white";
document.body.appendChild(web2cit);

window.addEventListener("message", async (event) => {
  // if (event.origin !== "https://example.org:8080") return;
  if (event.data.type === "request" ) {
    const { url } = event.data;
    // todo: return an error message in case of error
    const response = await fetch(url);
    const text = await response.text();
    const headers = new Map(response.headers);
    web2cit.contentWindow.postMessage(
      {
        type: "response",
        url,
        text,
        headers,
        status: response.status
      },
      "*"    
      // event.origin
    )
  }  
}, false);

// confiugre the listener for the preloader