const form = document.getElementById("form");
const input = document.getElementById("input");

var urlToEncode;

async function init() {
    await chemical.setTransport(localStorage.getItem("transport") || "epoxy");
}
window.addEventListener("chemicalLoaded", function (e) {
    init();
});

async function encodeUrl() {

    var url = await chemical.encode(urlToEncode, {
        service: localStorage.getItem("proxy") || "uv",
        autoHttps: true,
        searchEngine: "https://www.google.com/search?q=%s"
    })
    console.log(url)
    localStorage.setItem("url", url);
    window.location.href = "/browser.html";
}


if (form && input) {
    console.log("Ready to search!");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        urlToEncode = input.value;
        encodeUrl();
    })
}




