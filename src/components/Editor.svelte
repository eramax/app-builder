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
  class="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 border-none resize-none outline-none"
  placeholder="Enter your code here..."
  bind:this={editor}
></textarea>