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
                var ute = await chemical.encode(game.url, {
                    service: localStorage.getItem("proxy") || "uv",
                    autoHttps: true,
                    searchEngine: "https://www.google.com/search?q=%s"
                })
                localStorage.setItem('url', ute);
                window.location.href = '/browser.html';
            });

            appsContainer.appendChild(gameElement);
        });
    });