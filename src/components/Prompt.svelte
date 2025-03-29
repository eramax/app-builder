<script>
    import { userPrompt, isStreaming } from '../lib/store';

</script>

<div class="bg-app-dark p-3 border-t border-gray-800 flex">
    <input
        type="text"
        bind:value={$userPrompt}
        placeholder="Ask AI anything..."
        class="bg-app-gray rounded-l-md px-3 py-2 flex-1 text-white"
        onkeydown={(e) => e.key === "Enter" && onSubmit()}
    />
    <button
        class="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-r-md disabled:opacity-50"
        onclick={onSubmit}
        disabled={$isStreaming || !$userPrompt.trim()}
    >
        {#if $isStreaming}
            <span class="inline-block animate-pulse">•••</span>
        {:else}
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
        {/if}
    </button>
</div>