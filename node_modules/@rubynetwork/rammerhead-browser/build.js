import * as esbuild from "esbuild";
console.time('esbuild');

const browser = await esbuild.build({
    entryPoints: ['src/rammerhead-browser.ts'],
    bundle: true,
    outfile: "dist/index.js",
    format: "iife",
    minify: true,
    platform: "browser",
    sourcemap: true,
    target: ["es2015"],
    plugins: [],
    metafile: true
})

console.log(await esbuild.analyzeMetafile((browser.metafile)));
console.timeEnd("esbuild");
