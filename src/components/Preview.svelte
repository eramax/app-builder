<script>
  import { siteStore } from "$lib/store.svelte";
</script>

<div class="w-full h-full">
  <iframe 
    title="Preview" 
    srcdoc={siteStore.preview} 
    sandbox="allow-scripts allow-popups allow-same-origin allow-forms allow-pointer-lock allow-modals allow-storage-access-by-user-activation allow-downloads" 
    class="w-full h-full border-none bg-white"
    allow="accelerometer; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; web-share"
  ></iframe>
</div>