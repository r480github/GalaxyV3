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
var gamesJson = [];
var searchedGamesJson = [];
var currentPage = 0;

var gamesDiv = document.getElementById("games-container");

const pageSize = 200;

function getGameHTML(game) {
  return (`
  <div class="game" onclick="openGame('${game["url"]}')">
    <div class="game-image-container">
      <img class="game-image" src="/img/${game["image"]}">
    </div>
    <p class="game-title">
      ${game["name"]}
    </p>
  </div>
  `);
}

function setGames(page) {
  var html = '<div class="game-row">';
  for (var i = page * pageSize; i < searchedGamesJson.length; i++) {
    html += getGameHTML(searchedGamesJson[i]);
    if (((1 + i) - (page * pageSize)) % 5 == 0) html += '</div><div class="game-row">';
    if (i - (page * pageSize) == pageSize - 1) break;
  }
  gamesDiv.innerHTML = html + '</div>';
  if (!gamesDiv.childNodes[gamesDiv.childNodes.length - 1].hasChildNodes()) gamesDiv.childNodes[gamesDiv.childNodes.length - 1].remove();
}

function loadGames() {
  fetch("games.json").then((res) => res.json()).then((res) => {
    gamesJson = res;
    searchedGamesJson = gamesJson;
    currentPage = 0;
    setGames(0);
  });
}

function searchGames(e) {
  currentPage = 0;
  var games = [];
  for (var i = 0; i < gamesJson.length; i++) {
    if (gamesJson[i]["name"].toLowerCase().search(e.value.toLowerCase()) != -1) games.push(gamesJson[i]);
  }
  searchedGamesJson = games;
  setGames(currentPage);
}

function getPageCount() {
  return Math.ceil(searchedGamesJson.length / pageSize);
}

function scrollToTopOfGames() {
  document.getElementsByClassName("main-div")[0].scroll({ top: 0, left: 0, behavior: "instant" });
}

loadGames();
