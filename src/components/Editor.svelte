<script>
    import { files, activeFile } from "../lib/store";
</script>

<div class="flex-1 bg-app-darker">
    <textarea
        class="w-full h-full bg-transparent text-white p-4 font-mono focus:outline-none"
        bind:value={$files[$activeFile]}
    ></textarea>
</div>

