<script>
  import { onMount, onDestroy } from "svelte";
  import { siteStore } from "$lib/store.svelte";
  import loader from "@monaco-editor/loader";

  let editorContainer;
  let monacoEditor;
  let monaco;

  $effect(() => {
    // Update editor language when active file changes
    const newLanguage = siteStore.activeFileLanguage;
    if (
      monacoEditor &&
      newLanguage !== monacoEditor.getModel().getLanguageId()
    ) {
      monacoEditor.getModel().setLanguage(newLanguage);
    }
  });

  $effect(() => {
    // Update editor content when file content changes externally
    const activeFile = siteStore.activeFile;
    const fileContent = siteStore.files[activeFile];

    if (
      monacoEditor &&
      fileContent !== undefined &&
      monacoEditor.getValue() !== fileContent
    ) {
      monacoEditor.setValue(fileContent);
      monacoEditor.revealLine(monacoEditor.getModel().getLineCount())
    }
  });

  onMount(async () => {
    monaco = await loader.init();

    const activeFile = siteStore.activeFile;
    const language = siteStore.activeFileLanguage;
    const content = siteStore.files[activeFile] || "";

    monacoEditor = monaco.editor.create(editorContainer, {
      value: content,
      language,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      formatOnPaste: true,
      formatOnType: true,
      tabSize: 2,
      wordWrap: "on",
      scrollbar: {
        vertical: "visible",
        horizontal: "visible",
      },
    });

    // Optimize content change handler with debounce
    let timeout;
    monacoEditor.onDidChangeModelContent(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (siteStore.activeFile) {
          siteStore.files[siteStore.activeFile] = monacoEditor.getValue();
        }
      }, 200);
    });
  });

  onDestroy(() => {
    if (monacoEditor) {
      monacoEditor.dispose();
    }
  });
</script>

<div bind:this={editorContainer} class="w-full h-full"></div>
