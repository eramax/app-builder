<script>
  import { siteStore } from "$lib/store.svelte";
  
  const fileTypes = {
    "index.html": "HTML",
    "app.css": "CSS",
    "app.js": "JavaScript"
  };
</script>

<div class="navigation">
  {#each Object.keys(siteStore.files) as file}
    <button 
      class="tab" 
      class:active={file === siteStore.activeFile}
      onclick={() => siteStore.activeFile = file}
    >
      {fileTypes[file]}
    </button>
  {/each}
</div>

<style>
  .navigation {
    display: flex;
    background-color: #252526;
    border-bottom: 1px solid #3c3c3c;
  }

  .tab {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: none;
    color: #cccccc;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .tab:hover {
    background-color: #2d2d2d;
  }

  .tab.active {
    background-color: #1e1e1e;
    border-top: 2px solid #007acc;
    color: #ffffff;
  }
</style>