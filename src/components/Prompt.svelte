<script>
  import { siteStore } from "$lib/store.svelte";

  async function handleSubmit() {
    if (!siteStore.userPrompt.trim()) return;

    siteStore.isStreaming = true;
    
    // Replace this with actual API call for prompt handling
    try {
      // Simulate API response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example: Update the HTML file based on the prompt
      siteStore.files = {
        ...siteStore.files,
        "index.html": `<h1>Generated from prompt: ${siteStore.userPrompt}</h1>
<p>This is an example of content generated based on your prompt.</p>`
      };
    } catch (error) {
      console.error("Error processing prompt:", error);
    } finally {
      siteStore.isStreaming = false;
      siteStore.userPrompt = "";
    }
  }
</script>

<div class="w-full">
  <form on:submit|preventDefault={handleSubmit} class="flex gap-2">
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
      {siteStore.isStreaming ? 'Generating...' : 'Generate'}
    </button>
  </form>
</div>