<script>
    import { onMount } from "svelte";
    import Editor from "../components/Editor.svelte";
    import Preview from "../components/Preview.svelte";
    import Toolbar from "../components/Toolbar.svelte";
    import { streamLLMResponse } from "../lib/api.js";
    import { userPrompt, isStreaming, activeFile, files, loadDemoFiles } from '../lib/store';

    onMount(async () => {
        console.log("App mounted");
        await loadDemoFiles();
    });

    async function handleSubmit() {
        if (!$userPrompt.trim() || $isStreaming) return;

        $isStreaming = true;
        const generator = streamLLMResponse($files[$activeFile], $userPrompt);

        for await (const response of generator) {
            $files[$activeFile] = response;
        }

        $isStreaming = false;
    }


    function switchFile(filename) {
        $activeFile = filename;
    }

    async function deployToVercel() {
        alert("Deployment to Vercel initiated!");
    }
</script>

<main class="flex flex-col h-screen bg-app-darker">
    <nav
        class="bg-app-dark p-4 border-b border-gray-800 flex justify-between items-center"
    >
        <div class="flex items-center space-x-2">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="white">
                <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                ></path>
            </svg>
            <span class="font-bold">App-Builder</span>
        </div>

        <div class="flex space-x-2">
            <button class="bg-app-gray px-3 py-1 rounded-md text-sm">New</button
            >
            <span class="text-gray-400">Imagine and Build</span>
        </div>

        <button
            class="bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded-md text-white font-medium"
            onclick={deployToVercel}
        >
            Deploy to Vercel
        </button>
    </nav>

    <div class="flex flex-1 overflow-hidden">
        <!-- Left panel: Code editor -->
        <div class="w-1/2 border-r border-gray-800 flex flex-col">
            <Toolbar />

            <Editor />

            <div class="bg-app-dark p-3 border-t border-gray-800 flex">
                <input
                    type="text"
                    bind:value={$userPrompt}
                    placeholder="Ask AI anything..."
                    class="bg-app-gray rounded-l-md px-3 py-2 flex-1 text-white"
                    onkeydown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button
                    class="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-r-md disabled:opacity-50"
                    onclick={handleSubmit}
                    disabled={isStreaming || !userPrompt.trim()}
                >
                    {#if isStreaming}
                        <span class="inline-block animate-pulse">•••</span>
                    {:else}
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="white">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    {/if}
                </button>
            </div>
        </div>

        <!-- Right panel: Preview -->
        <div class="w-1/2 p-4 bg-app-dark">
            <Preview/>
        </div>
    </div>
</main>
