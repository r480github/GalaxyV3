// ------- Osmo [https://osmo.supply/] ------- //
document.addEventListener("DOMContentLoaded", () => {
    let cursorItem = document.querySelector(".cursor");
    let cursorParagraph = cursorItem.querySelector("p");
    let targets = document.querySelectorAll("[data-cursor]");
    let xOffset = 6;
    let yOffset = 50;
    let cursorIsOnRight = false;
    let currentTarget = null;
    let lastText = '';
  
    gsap.set(cursorItem, {xPercent: xOffset, yPercent: yOffset});
  
    let xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
    let yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });
  

    window.addEventListener("mousemove", e => {
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;
      let scrollY = window.scrollY;
      let cursorX = e.clientX;
      let cursorY = e.clientY + scrollY; 
  
      let xPercent = xOffset;
      let yPercent = yOffset;
  

      if (cursorX > windowWidth * 0.66) {
        cursorIsOnRight = true;
        xPercent = -100;
      } else {
        cursorIsOnRight = false;
      }
  
      if (cursorY > scrollY + windowHeight * 0.9) {
        yPercent = -120; 
      }
  
      if (currentTarget) {
        let newText = currentTarget.getAttribute("data-cursor");
        if (currentTarget.hasAttribute("data-easteregg") && cursorIsOnRight) {
          newText = currentTarget.getAttribute("data-easteregg");
        }
  
        if (newText !== lastText) { 
          cursorParagraph.innerHTML = newText;
          lastText = newText;
        }
      }
  
      gsap.to(cursorItem, { xPercent: xPercent, yPercent: yPercent, duration: 0.9, ease: "power3" });
      xTo(cursorX);
      yTo(cursorY - scrollY); 
    });
  

    targets.forEach(target => {
      target.addEventListener("mouseenter", () => {
        currentTarget = target; 
  
        let newText = target.hasAttribute("data-easteregg")
          ? target.getAttribute("data-easteregg")
          : target.getAttribute("data-cursor");
  
        if (newText !== lastText) {
          cursorParagraph.innerHTML = newText;
          lastText = newText;
        }
      });
    });
  });
  let inIframe;
try {
  inIframe = window.self !== window.top;
} catch (e) {
  inIframe = true;
}
const educationalSites = ["https://google.com"];
function ABCloak(redirectToEducationalSite) {
  try {
    if (!inIframe) {
      const popup = open("about:blank", "_blank");
      if (popup) {
        const doc = popup.document;
        const iframe = doc.createElement("iframe");
        const style = iframe.style;
        const link = doc.createElement("link");

        var name = "Home";
        var icon =
          "https://www.gstatic.com/";
        if (localStorage.getItem("cloakTitle") !== null) {
          name = localStorage.getItem("cloakTitle");
          icon = localStorage.getItem("cloakIcon");
        }
        doc.title = name;
        link.rel = "icon";
        link.href = icon;

        iframe.src = location.href;
        style.border = style.outline = "none";
        style.width = style.height = "100%";
        style.overflow = "hidden";
        doc.body.style.margin = style.margin = 0;
        style.padding = 0;
        doc.head.appendChild(link);
        doc.body.appendChild(iframe);
        doc.URLBeforeCloak = location.href;

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML =
          `
            window.onmessage = function (e) {
              if (e.data == 'cancelABCloak') {
                location.replace("` +
          location.href +
          `");
              } else {
                try {
                  var msg = JSON.parse(e.data);
                  if (msg.msg === "changeCloak") {
                    document.title = msg.title
                    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                    link.type = 'image/x-icon';
                    link.rel = 'shortcut icon';
                    link.href = msg.icon;
                    document.getElementsByTagName('head')[0].appendChild(link);
                  }
                } catch { }
              }
            };`;
        doc.body.append(script);

        if (redirectToEducationalSite)
          location.replace(
            educationalSites[
              Math.floor(Math.random() * educationalSites.length)
            ]
          );
      }
    }
  } catch {
    ABCloak(true);
  }
}

if (localStorage.getItem("autoAB") == "true") {
  ABCloak(true);
}

window.addEventListener('beforeunload', function (e) {
  if (myToggle.checked) {
    e.preventDefault();
    e.returnValue = '';
  }
}); 