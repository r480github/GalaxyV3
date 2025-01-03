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
  
    // Position cursor relative to actual cursor position on page load
    gsap.set(cursorItem, {xPercent: xOffset, yPercent: yOffset});
  
    // Use GSAP quick.to for a more performative tween on the cursor
    let xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
    let yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });
  
    // On mousemove, call the quickTo functions to the actual cursor position
    window.addEventListener("mousemove", e => {
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;
      let scrollY = window.scrollY;
      let cursorX = e.clientX;
      let cursorY = e.clientY + scrollY; // Adjust cursorY to account for scroll
  
      // Default offsets
      let xPercent = xOffset;
      let yPercent = yOffset;
  
      // Adjust X offset if in the rightmost 19% of the window
      if (cursorX > windowWidth * 0.66) {
        cursorIsOnRight = true;
        xPercent = -100;
      } else {
        cursorIsOnRight = false;
      }
  
      // Adjust Y offset if in the bottom 10% of the current viewport
      if (cursorY > scrollY + windowHeight * 0.9) {
        yPercent = -120; 
      }
  
      if (currentTarget) {
        let newText = currentTarget.getAttribute("data-cursor");
        if (currentTarget.hasAttribute("data-easteregg") && cursorIsOnRight) {
          newText = currentTarget.getAttribute("data-easteregg");
        }
  
        if (newText !== lastText) { // Only update if the text is different
          cursorParagraph.innerHTML = newText;
          lastText = newText;
        }
      }
  
      gsap.to(cursorItem, { xPercent: xPercent, yPercent: yPercent, duration: 0.9, ease: "power3" });
      xTo(cursorX);
      yTo(cursorY - scrollY); // Subtract scroll for viewport positioning
    });
  
    // Add a mouse enter listener for each link that has a data-cursor attribute
    targets.forEach(target => {
      target.addEventListener("mouseenter", () => {
        currentTarget = target; // Set the current target
  
        // If element has data-easteregg attribute, load different text
        let newText = target.hasAttribute("data-easteregg")
          ? target.getAttribute("data-easteregg")
          : target.getAttribute("data-cursor");
  
        // Update only if the text changes
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

        var name = "Google Classroom";
        var icon =
          "data:image/jpeg;base64,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";
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