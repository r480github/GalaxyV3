fetch('/assets/json/games.json')
    .then(response => response.json())
    .then(games => {
        const appsContainer = document.querySelector('.games');

        games.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'game';

            gameElement.innerHTML = `
        <img src="${game.image}" alt="${game.name}">
        <h3>${game.name}</h3>
      `;

            gameElement.addEventListener('click', async () => {
                var ute = game.url;
                if (localStorage.getItem("proxy") == "uv") {
                    ute = __uv$config.prefix + __uv$config.encodeUrl(ute);
                    localStorage.setItem('url', ute);
                    window.location.href = '/browser.html';
                }
                else if (localStorage.getItem("proxy") == "rammerhead") {
                    rhEncode();
                }

                async function rhEncode() {
                    ute = await RammerheadEncode(ute);
                    window.location.href = "/" + ute;
                }
            });

            appsContainer.appendChild(gameElement);
        });
    });


