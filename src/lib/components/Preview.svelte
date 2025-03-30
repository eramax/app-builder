<script>
  import { siteStore } from "../store.svelte";
</script>

<div class="preview">
  <iframe title="Preview" srcdoc={siteStore.preview} sandbox="allow-scripts allow-popups"></iframe>
</div>

<style>
  .preview {
    width: 100%;
    height: 100%;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    background-color: white;
  }
</style>