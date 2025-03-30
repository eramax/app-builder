<script>
  import { askAI } from "$lib/api";
  import { siteStore } from "$lib/store.svelte";
</script>

<div class="w-full">
  <form on:submit|preventDefault={askAI} class="flex gap-2">
    <input
      type="text"
      placeholder="Describe your website..."
      bind:value={siteStore.userPrompt}
      disabled={siteStore.isStreaming}
      class="flex-grow p-3 border border-gray-700 rounded bg-app-gray text-white text-base"
    />
    <button
      type="submit"
      disabled={siteStore.isStreaming || !siteStore.userPrompt.trim()}
      class="px-4 py-3 bg-app-blue text-white border-none rounded text-base cursor-pointer transition-colors hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
    >
      {siteStore.isStreaming ? "Generating..." : "Generate"}
    </button>
  </form>
</div>
