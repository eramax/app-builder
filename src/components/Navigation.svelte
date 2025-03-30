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
  {/each}
</div>