"use strict";


const stockSW = "/uv/sw.js";

const swAllowedHostnames = ["localhost", "127.0.0.1"];
registerSW();

async function registerSW() {
    if (!navigator.serviceWorker) {
        if (
            location.protocol !== "https:" &&
            !swAllowedHostnames.includes(location.hostname)
        )
            throw new Error("Service workers cannot be registered without https.");

        throw new Error("Your browser doesn't support service workers.");
    }
    else {
        console.log("Service worker registered.");
    }

    await navigator.serviceWorker.register(stockSW);
    const registration = await navigator.serviceWorker.register('/meteorsw.js')
    let connection = new BareMux.BareMuxConnection("/baremux/worker.js")
    await connection.setTransport(
        "/epoxy/index.mjs", // replace with your transport
        [{
            wisp: (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/",
        }]
    )
}