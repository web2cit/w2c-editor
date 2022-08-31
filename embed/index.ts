import { getRequestMessageListener } from '../src/api/crossFetch';

const script = document.currentScript as HTMLScriptElement;

const web2cit = document.createElement("iframe");
// todo: use a special id so we prevent injecting twice
web2cit.src = new URL(
  // consider adding some parameter indicating that we are loading from an iframe
  // this may be useful to indicate that the message listener should be available
  `./#${document.URL}`,
  script.src
).href;
web2cit.style.position = "fixed";
web2cit.style.right = "0";
web2cit.style.top = "0";
web2cit.style.height = "100%";
web2cit.style.width = "50%";
web2cit.style.zIndex = "2147483647";
web2cit.style.background = "white";
document.body.appendChild(web2cit);
// todo: listen for location changes (triggered by react router; e.g., elobservador.com.uy)
// and update the hash in the iframe src accordingly
// https://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate/4585031#4585031

// todo: add sidebar show/hide/close buttons
const listener = getRequestMessageListener(
  fetch,
  web2cit.contentWindow!
)
window.addEventListener("message", listener, false);
