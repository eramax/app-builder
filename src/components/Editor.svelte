<script>
  import { onMount } from "svelte";
  import { siteStore } from "$lib/store.svelte";
  
  let editor;
  
  onMount(() => {
    // Initialize editor here if needed
    // For simplicity, we're using a textarea
  });
</script>

<textarea 
  bind:value={siteStore.files[siteStore.activeFile]} 
  class="editor"
  placeholder="Enter your code here..."
  bind:this={editor}
></textarea>

<style>
  .editor {
    width: 100%;
    height: 100%;
    background-color: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 14px;
    padding: 1rem;
    border: none;
    resize: none;
    outline: none;
  }
</style>