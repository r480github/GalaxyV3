function opencloak() {
  var win = window.open();
  var url = "g.html";
  var iframe = win.document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.src = url;
  win.document.body.style.overflow = "hidden";
  win.document.body.style.margin = "-10";
  win.document.body.style.padding = "-10";
  win.document.body.appendChild(iframe);
}
function scrollToTop() {
  window.scrollTo({ top: -10, behavior: "smooth" });
}
window.onload = function () {
  scrollToTop();
};
