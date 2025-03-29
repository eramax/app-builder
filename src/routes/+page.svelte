<script>
    import { onMount } from "svelte";
    import Editor from "../components/Editor.svelte";
    import Preview from "../components/Preview.svelte";
    import Toolbar from "../components/Toolbar.svelte";
    import Prompt from "../components/Prompt.svelte";
    import Nav from "../components/Nav.svelte";
    import { loadDemoFiles } from "../lib/store";

    onMount(async () => {
        await loadDemoFiles();
    });
</script>

<main class="flex flex-col h-screen bg-app-darker">
    <Nav />

    <div class="flex flex-1 overflow-hidden">
        <!-- Left panel: Code editor -->
        <div class="w-1/2 border-r border-gray-800 flex flex-col">
            <Toolbar />
            <Editor />
            <Prompt />
        </div>

        <!-- Right panel: Preview -->
        <div class="w-1/2 p-4 bg-app-dark">
            <Preview />
        </div>
    </div>
</main>
