// Site builder state management using Svelte runes
import { get } from "svelte/store";
import JSZip from "jszip";

function createSiteStore() {
  let userPrompt = $state("");
  let isStreaming = $state(false);
  let activeFile = $state("index.html");
  let files = $state({});
  let currentWritableFile = $state("");
  let systemPrompt = "";

  // Generate preview combining all files
  let preview = $derived(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      ${files["app.css"] ? `<style>${files['app.css']}</style>` : ""}
    </head>
    <body>
      ${files["index.html"] || ""}
      ${files["app.js"] ? `<script>${files["app.js"]}</script>` : ""}
    </body>
    </html>`);

  return {
    get userPrompt() { return userPrompt; },
    set userPrompt(value) { userPrompt = value; },

    get isStreaming() { return isStreaming; },
    set isStreaming(value) { isStreaming = value; },

    get activeFile() { return activeFile; },
    set activeFile(value) { activeFile = value; },

    get files() { return files; },
    set files(value) { files = value; },

    get currentWritableFile() { return currentWritableFile; },
    set currentWritableFile(value) { currentWritableFile = value; },

    get preview() { return preview; },

    get systemPrompt() { return systemPrompt; },

    get activeFileLanguage() {
      if (!activeFile) return 'plaintext';
      const extension = activeFile.split('.').pop().toLowerCase();
      const languageMap = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        html: 'html',
        htm: 'html',
        css: 'css',
        scss: 'scss',
        less: 'less',
        json: 'json',
        md: 'markdown',
        markdown: 'markdown',
        py: 'python',
        sh: 'shell',
        bash: 'shell',
        yml: 'yaml',
        yaml: 'yaml',
        xml: 'xml',
        svg: 'xml'
      };
      return languageMap[extension] || 'plaintext';
    },

    async loadSystemPrompt() {
      const res = await fetch("/system_prompt.md");
      if (res.ok) {
        systemPrompt = await res.text();
      } else {
        console.error("Failed to load system prompt:", res.statusText);
      }
    },

    async downloadFilesasZip() {
      const zip = new JSZip();
      for (const [filename, content] of Object.entries(files)) {
        zip.file(filename, content);
      }
      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "app.zip";
      a.click();
      URL.revokeObjectURL(url);
    },

    async loadDemoFiles() {
      try {
        // First fetch the list of files
        const fileList = await fetch("/demo/files.json").then(res => res.json());
        const fileContents = {};
        // Load each file in parallel but preserve order from files.json
        await Promise.all(fileList.map(async (filename) => {
          try {
            const content = await fetch(`/demo/${filename}`).then(res => res.text());
            fileContents[filename] = content;
          } catch (error) {
            console.error(`Failed to load ${filename}:`, error);
            fileContents[filename] = `// Error loading ${filename}`;
          }
        }));

        files = fileContents;
      } catch (error) {
        console.error("Failed to load demo files:", error);
      }
    }
  };
}

export const siteStore = createSiteStore();

