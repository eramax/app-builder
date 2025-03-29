<script>
    import { activeFile, isStreaming, files } from "../lib/store";
</script>

<div class="bg-app-dark p-3 border-b border-gray-800 flex space-x-2">
    {#each Object.keys($files) as filename}
        <button
            class="px-3 py-1 rounded-md text-sm"
            class:bg-neutral-500={filename === $activeFile}
            class:bg-neutral-800={filename !== $activeFile}
            onclick={() => $activeFile = filename}
            disabled={$isStreaming}
        >
            {filename}
        </button>
    {/each}
</div>
