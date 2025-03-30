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

<div class="prompt-container">
  <form on:submit|preventDefault={handleSubmit} class="prompt-form">
    <input
      type="text"
      placeholder="Describe your website..."
      bind:value={siteStore.userPrompt}
      disabled={siteStore.isStreaming}
    />
    <button type="submit" disabled={siteStore.isStreaming || !siteStore.userPrompt.trim()}>
      {siteStore.isStreaming ? 'Generating...' : 'Generate'}
    </button>
  </form>
</div>

<style>
  .prompt-container {
    width: 100%;
  }

  .prompt-form {
    display: flex;
    gap: 0.5rem;
  }

  input {
    flex-grow: 1;
    padding: 0.75rem;
    border: 1px solid #3c3c3c;
    border-radius: 4px;
    background-color: #1e1e1e;
    color: #ffffff;
    font-size: 1rem;
  }

  button {
    padding: 0.75rem 1rem;
    background-color: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover:not(:disabled) {
    background-color: #0098ff;
  }

  button:disabled {
    background-color: #555555;
    cursor: not-allowed;
  }
</style>