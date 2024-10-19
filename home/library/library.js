const searchInput = document.getElementById("search");
const userCards = document.querySelectorAll(".user-cards a");

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  userCards.forEach((card) => {
    const cardName = card
      .querySelector(".cardname p")
      .textContent.toLowerCase();
    if (cardName.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

function opencloak() {
  var win = window.open();
  var url = "../index.html";
  var iframe = win.document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.src = url;
  win.document.body.style.margin = "0";
  win.document.body.style.padding = "0";
  win.document.body.appendChild(iframe);
} 
