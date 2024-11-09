fetch('/assets/json/apps.json')
    .then(response => response.json())
    .then(apps => {
        const appsContainer = document.querySelector('.apps');

        apps.forEach(app => {
            const appElement = document.createElement('div');
            appElement.className = 'app';

            appElement.innerHTML = `
        <img src="${app.image}" alt="${app.name}">
        <h3>${app.name}</h3>
      `;

            appElement.addEventListener('click', async () => {
                var ute = await chemical.encode(app.url, {
                    service: localStorage.getItem("proxy") || "uv",
                    autoHttps: true,
                    searchEngine: "https://www.google.com/search?q=%s"
                })
                localStorage.setItem('url', ute);
                window.location.href = '/browser.html';
            });

            appsContainer.appendChild(appElement);
        });
    });