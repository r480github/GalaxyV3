import { ChemicalServer } from "chemicaljs";
import express from "express";
import cors from "cors";

const [app, listen] = new ChemicalServer();
const port = process.env.PORT || 8080;


app.use(express.static("public", {
    index: "index.html",
    extensions: ["html"]
}));

app.use(cors({
    origin: '*',
    methods: 'GET',
    allowedHeaders: 'Content-Type',
}));

app.on("request", (req, res) => {
    res.setHeader("Cross-Origin-Opener-Policy", "anonymous");
    res.setHeader("Cross-Origin-Embedder-Policy", "anonymous");
    app(req, res);
});

app.serveChemical();

app.use((req, res) => {
    res.status(404);
    res.send("404 Error");
});

listen(port, () => {
    console.log(`Galaxy is listening on port ${port}`);
});

