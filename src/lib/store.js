import { writable, get } from 'svelte/store';

export const userPrompt = writable("");
export const isStreaming = writable(false);
export const activeFile = writable("index.html");
export const files = writable({
    "index.html": "",
    "app.css": "",
    "app.js": "",
});

export const loadDemoFiles = async () => {
    const htmlResponse = await fetch("/demo/index.html");
    const cssResponse = await fetch("/demo/app.css");
    const jsResponse = await fetch("/demo/app.js");

    const [html, css, js] = await Promise.all([
        htmlResponse.text(),
        cssResponse.text(),
        jsResponse.text()
    ]);

    files.set({
        "index.html": html,
        "app.css": css,
        "app.js": js
    });
};
