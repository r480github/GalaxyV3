var proxySelect = document.getElementById("proxy-select");
var transportSelect = document.getElementById("transport-select");

if (proxySelect && transportSelect) {
    proxySelect.value = localStorage.getItem("proxy") || "uv";
    transportSelect.value = localStorage.getItem("transport") || "epoxy";
    proxySelect.addEventListener("change", function () {
        localStorage.setItem("proxy", proxySelect.value);
    });
    transportSelect.addEventListener("change", function () {
        localStorage.setItem("transport", transportSelect.value);
    });
}