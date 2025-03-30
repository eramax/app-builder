<script>
  import { siteStore } from "./lib/store.svelte";
  import Editor from "./lib/components/Editor.svelte";
  import Preview from "./lib/components/Preview.svelte";
  import Prompt from "./lib/components/Prompt.svelte";
  import Navigation from "./lib/components/Navigation.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    siteStore.loadDemoFiles();
  });
</script>

<div class="app">
  <div class="layout">
    <div class="left-panel">
      <Prompt />
      <div class="editor-container">
        <Navigation />
        <Editor />
      </div>
    </div>
    <div class="preview-container">
      <Preview />
    </div>
  </div>
</div>

<style>
  .app {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    flex-grow: 1;
    height: 100%;
    padding: 1rem;
  }

  .left-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
  }

  .editor-container {
    background-color: #1e1e1e;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
  }

  .preview-container {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
  }
</style>