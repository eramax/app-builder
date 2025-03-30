// Site builder state management using Svelte runes

function createSiteStore() {
  let userPrompt = $state("");
  let isStreaming = $state(false);
  let activeFile = $state("index.html");
  let files = $state({
    "index.html": "",
    "app.css": "",
    "app.js": "",
  });

  // Generate preview combining all files
  let preview = $derived(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${files["app.css"]}</style>
    </head>
    <body>
      ${files["index.html"]}
      <script>${files["app.js"]}</script>
    </body>
    </html>`);
  
  // Load demo files from server
  async function loadDemoFiles() {
    const [html, css, js] = await Promise.all([
      fetch("/demo/index.html").then(res => res.text()),
      fetch("/demo/app.css").then(res => res.text()),
      fetch("/demo/app.js").then(res => res.text())
    ]);

    files = {
      "index.html": html,
      "app.css": css,
      "app.js": js
    };
  }
  
  return {
    get userPrompt() { return userPrompt; },
    set userPrompt(value) { userPrompt = value; },
    
    get isStreaming() { return isStreaming; },
    set isStreaming(value) { isStreaming = value; },
    
    get activeFile() { return activeFile; },
    set activeFile(value) { activeFile = value; },
    
    get files() { return files; },
    set files(value) { files = value; },
    
    get preview() { return preview; },

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
    
    loadDemoFiles
  };
}

export const siteStore = createSiteStore();

