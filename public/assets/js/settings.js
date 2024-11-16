var proxySelect = document.getElementById("proxy-select");

if (proxySelect) {
  proxySelect.value = localStorage.getItem("proxy") || "uv";
  proxySelect.addEventListener("change", function () {
    localStorage.setItem("proxy", proxySelect.value);
  });
}
if (wispSelect) {
  if (localStorage.getItem("wisp") == (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/") {
    wispSelect.value = "default";
  } else {
    wispSelect.value = "tp";
  }
  wispSelect.addEventListener("change", function () {
    if (wispSelect.value == "default") {
      localStorage.setItem("wisp", (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/");
    }
    if (wispSelect.value == "tp") {
      localStorage.setItem("wisp", prompt("Enter your WISP URL:"));
    }
  });
}

if (ab) {
  ab.addEventListener("click", function () {
    var abtab = window.open("about:blank", "blank");
    abtab.document.write(`
  <html>
    <head>
      
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
    </head>
    <body>
      <iframe src="/index.html" frameborder="0"></iframe>
    </body>
  </html>
`);
    window.location.href = "https://classroom.google.com/u/";
  });
}

if (blooket) {
  blooket.addEventListener("click", async function () {
    try {
      const response = await fetch('/assets/cheats/blooket.txt');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Failed to copy cheats");
    }
  });
}

if (gimkit) {
  gimkit.addEventListener("click", async function () {
    try {
      const response = await fetch('/assets/cheats/gimkit.txt');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Failed to copy cheats");
    }
  });
}