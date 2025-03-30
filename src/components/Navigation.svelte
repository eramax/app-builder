<script>
  import { siteStore } from "$lib/store.svelte";
</script>

<div class="flex bg-[#252526] border-b border-[#3c3c3c]">
  {#each Object.keys(siteStore.files) as file}
    <button 
      class="py-2 px-4 bg-transparent border-0 text-[#cccccc] cursor-pointer text-sm hover:bg-[#2d2d2d] {file === siteStore.activeFile ? 'bg-[#1e1e1e] border-t-2 border-t-[#007acc] text-white' : ''}"
      onclick={() => siteStore.activeFile = file}
    >
      {file}
    </button>
    <!-- Add a download app files as zip button -->
  {/each}
  <button onclick={siteStore.downloadFilesasZip} download class="py-2 px-4 bg-transparent border-0 text-[#cccccc] cursor-pointer text-sm hover:bg-[#2d2d2d]">
    <!-- Add a download icon here -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 10l5 5 5-5m-5 5V3m0 12h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2h6z"/></svg>
  </button>
</div>