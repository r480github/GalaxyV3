fetch("/assets/json/apps.json")
  .then((response) => response.json())
  .then((games) => {
    const appsContainer = document.querySelector(".games");

    games.forEach((game) => {
      const gameElement = document.createElement("div");
      gameElement.className = "game";

      gameElement.innerHTML = `
                <img src="/img/${game.image}" alt="${game.name}" class="cards">
                        <h3>${game.name}</h3>

      `;

      gameElement.addEventListener("click", async () => {
        localStorage.setItem('previous', window.location.href);
        console.log('previous page is ' + window.location.href);
        var ute = game.url;
        if (localStorage.getItem("proxy") == "uv") {
          ute = __uv$config.prefix + __uv$config.encodeUrl(ute);
          localStorage.setItem("url", ute);
          window.location.href = "/search.html";
        } 
      });

      appsContainer.appendChild(gameElement);
    });
  });
  document.getElementById('search').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const games = document.querySelectorAll('.game');
  
    games.forEach(game => {
      const gameName = game.querySelector('h3').textContent.toLowerCase();
      if (gameName.includes(query)) {
        game.style.display = 'flex';
      } else {
        game.style.display = 'none';
      }
    });
  });
   