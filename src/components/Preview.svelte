<script>
  import { siteStore } from "$lib/store.svelte";
</script>

<div class="w-full h-full">
  <iframe title="Preview" srcdoc={siteStore.preview} sandbox="allow-scripts allow-popups" class="w-full h-full border-none bg-white"></iframe>
</div>